<script lang="ts">
  import "@frc-web-components/fwc/components/field";
  import { getEntry } from "../networktables";
  import { dsStore } from "../wpilib-sim-ws/driver-station";
  import RobotState from "./RobotState.svelte";

  let robotPose = getEntry("/SmartDashboard/Field/Robot", []);
  let trajectory = getEntry("/SmartDashboard/Field/trajectory", []);

  const {
    isDisabled,
    isAuto,
    isTeleop,
    isTest,
    setAuto,
    setDisabled,
    setTeleop,
    setTest,
  } = dsStore;
</script>

<div>
  <h2>Simulation</h2>
  <div class="sim-components">
    <RobotState />

    <div>
      <frc-field origin="blue" rotation-unit="deg">
        <frc-field-robot pose={$robotPose} />
        <frc-field-path poses={$trajectory} />
      </frc-field>
    </div>
  </div>
</div>

<style>
  h2 {
    font-family: sans-serif;
    margin: 0 0 14px;
    color: #333;
  }

  .sim-components {
    display: flex;
    gap: 20px;
  }
</style>
