<script lang="ts">
  import "@frc-web-components/fwc/components/field";
  import { dsStore } from "../wpilib-sim-ws/driver-station";

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
  <h4>Robot State</h4>
  <div class="robot-states">
    <label>
      <input
        type="radio"
        name="robot-state"
        checked={$isDisabled}
        on:click={() => {
          setDisabled();
        }}
      />
      Disabled
    </label>
    <label>
      <input
        type="radio"
        name="robot-state"
        checked={$isAuto}
        on:click={() => {
          setAuto();
        }}
      />
      Autonomous
    </label>
    <label>
      <input
        type="radio"
        name="robot-state"
        checked={$isTeleop}
        on:click={() => {
          setTeleop();
        }}
      />
      Teleoperated
    </label>
    <label>
      <input
        type="radio"
        name="robot-state"
        checked={$isTest}
        on:click={() => {
          setTest();
        }}
      />
      Test
    </label>
  </div>
</div>

<style>
  h4 {
    font-family: sans-serif;
    margin: 0 0 8px;
    color: #333;
  }

  .robot-states {
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
    gap: 5px;
  }
</style>
