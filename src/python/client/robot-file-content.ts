/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
export const robotFileContent =
  "#!/usr/bin/env python3\r\n" +
  "#\r\n" +
  "# Copyright (c) FIRST and other WPILib contributors.\r\n" +
  "# Open Source Software; you can modify and/or share it under the terms of\r\n" +
  "# the WPILib BSD license file in the root directory of this project.\r\n" +
  "#\r\n" +
  "\r\n" +
  "import wpilib\r\n" +
  "import wpimath\r\n" +
  "import wpimath.controller\r\n" +
  "import wpimath.system\r\n" +
  "import wpimath.system.plant\r\n" +
  "import wpimath.estimator\r\n" +
  "\r\n" +
  "import math\r\n" +
  "import numpy\r\n" +
  "\r\n" +
  "# A simple utility class for converting rpm to radians, as robotPY does not currently have a wpimath.util class.\r\n" +
  "import util.units\r\n" +
  "\r\n" +
  '"""This is a sample program to demonstrate how to use a state-space controller to control a\r\n' +
  "flywheel.\r\n" +
  '"""\r\n' +
  "\r\n" +
  "\r\n" +
  "class MyRobot(wpilib.TimedRobot):\r\n" +
  "    kMotorPort = 0\r\n" +
  "    kEncoderAChannel = 0\r\n" +
  "    kEncoderBChannel = 1\r\n" +
  "    kJoystickPort = 0\r\n" +
  "\r\n" +
  "    kFlywheelMomentOfInertia = 0.00032  # kg/m^2\r\n" +
  "\r\n" +
  "    # Reduction between motors and encoder, as output over input. If the flywheel spins slower than\r\n" +
  "    # the motors, this number should be greater than one.\r\n" +
  "    kFlywheelGearing = 1\r\n" +
  "\r\n" +
  "    def robotInit(self) -> None:\r\n" +
  "        self.kSpinUpRadPerSec = util.units.Units.rotationsPerMinuteToRadiansPerSecond(\r\n" +
  "            500\r\n" +
  "        )\r\n" +
  "\r\n" +
  "        # The plant holds a state-space model of our flywheel. This system has the following properties:\r\n" +
  "        #\r\n" +
  "        # States: [velocity], in radians per second.\r\n" +
  '        # Inputs (what we can "put in"): [voltage], in volts.\r\n' +
  "        # Outputs (what we can measure): [velocity], in radians per second.\r\n" +
  "        self.flywheelPlant = wpimath.system.plant.LinearSystemId.flywheelSystem(\r\n" +
  "            wpimath.system.plant.DCMotor.NEO(2),\r\n" +
  "            self.kFlywheelMomentOfInertia,\r\n" +
  "            self.kFlywheelGearing,\r\n" +
  "        )\r\n" +
  "\r\n" +
  "        # The observer fuses our encoder data and voltage inputs to reject noise.\r\n" +
  "        self.observer = wpimath.estimator.KalmanFilter_1_1_1(\r\n" +
  "            self.flywheelPlant,\r\n" +
  "            [3],  # How accurate we think our model is\r\n" +
  "            [0.01],  # How accurate we think our encoder data is\r\n" +
  "            0.020,\r\n" +
  "        )\r\n" +
  "\r\n" +
  "        # A LQR uses feedback to create voltage commands.\r\n" +
  "        self.controller = wpimath.controller.LinearQuadraticRegulator_1_1(\r\n" +
  "            self.flywheelPlant,\r\n" +
  "            [8],  # qelms. Velocity error tolerance, in radians per second. Decrease\r\n" +
  "            # this to more heavily penalize state excursion, or make the controller behave more\r\n" +
  "            # aggressively.\r\n" +
  "            [12],  # relms. Control effort (voltage) tolerance. Decrease this to more\r\n" +
  "            # heavily penalize control effort, or make the controller less aggressive. 12 is a good\r\n" +
  "            # starting point because that is the (approximate) maximum voltage of a battery.\r\n" +
  "            0.020,  # Nominal time between loops. 0.020 for TimedRobot, but can be lower if using notifiers.\r\n" +
  "        )\r\n" +
  "\r\n" +
  "        # The state-space loop combines a controller, observer, feedforward and plant for easy control.\r\n" +
  "        self.loop = wpimath.system.LinearSystemLoop_1_1_1(\r\n" +
  "            self.flywheelPlant, self.controller, self.observer, 12.0, 0.020\r\n" +
  "        )\r\n" +
  "\r\n" +
  "        # An encoder set up to measure flywheel velocity in radians per second.\r\n" +
  "        self.encoder = wpilib.Encoder(self.kEncoderAChannel, self.kEncoderBChannel)\r\n" +
  "\r\n" +
  "        self.motor = wpilib.PWMSparkMax(self.kMotorPort)\r\n" +
  "\r\n" +
  "        # A joystick to read the trigger from.\r\n" +
  "        self.joystick = wpilib.Joystick(self.kJoystickPort)\r\n" +
  "\r\n" +
  "        # We go 2 pi radians per 4096 clicks.\r\n" +
  "        self.encoder.setDistancePerPulse(2 * math.pi / 4096)\r\n" +
  "\r\n" +
  "    def teleopInit(self) -> None:\r\n" +
  "        self.loop.reset([self.encoder.getRate()])\r\n" +
  "\r\n" +
  "    def teleopPeriodic(self) -> None:\r\n" +
  "        # Sets the target speed of our flywheel. This is similar to setting the setpoint of a\r\n" +
  "        # PID controller.\r\n" +
  "        if self.joystick.getTriggerPressed():\r\n" +
  "            # We just pressed the trigger, so let's set our next reference\r\n" +
  "            self.loop.setNextR(numpy.array([self.kSpinUpRadPerSec]))\r\n" +
  "\r\n" +
  "        elif self.joystick.getTriggerReleased():\r\n" +
  "            # We just released the trigger, so let's spin down\r\n" +
  "            self.loop.setNextR(numpy.array([self.kSpinUpRadPerSec]))\r\n" +
  "\r\n" +
  "        # Correct our Kalman filter's state vector estimate with encoder data.\r\n" +
  "        self.loop.correct([self.encoder.getRate()])\r\n" +
  "\r\n" +
  "        # Update our LQR to generate new voltage commands and use the voltages to predict the next\r\n" +
  "        # state with out Kalman filter.\r\n" +
  "        self.loop.predict(0.020)\r\n" +
  "\r\n" +
  "        # Send the new calculated voltage to the motors.\r\n" +
  "        # voltage = duty cycle * battery voltage, so\r\n" +
  "        # duty cycle = voltage / battery voltage\r\n" +
  "        nextVoltage = self.loop.U()\r\n" +
  "        self.motor.setVoltage(nextVoltage)\r\n" +
  "\r\n" +
  "\r\n" +
  'if __name__ == "__main__":\r\n' +
  "    wpilib.run(MyRobot)";
