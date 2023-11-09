<script lang="ts">
  import "@frc-web-components/fwc/components/field";
  import "@frc-web-components/fwc/components/icon";
  import { getEntry } from "../networktables";
  import RobotState from "./RobotState.svelte";
  import fileWatcher from "../python/client/file-watcher";

  let robotPose = getEntry("/SmartDashboard/Field/Robot", []);
  let trajectory = getEntry("/SmartDashboard/Field/trajectory", []);
</script>

<div>
  <div class="sim-header">
    <h2>Simulation</h2>
    <button
      class="refresh-button"
      title="Refresh simulator with latest file content"
      on:click={() => {
        fileWatcher.runSim();
      }}
    >
      <frc-icon
        class="icon closed"
        color="#555"
        svg-path="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"
        view-box="0 -960 960 960"
      />
    </button>
  </div>
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
    margin: 0;
    color: #333;
  }

  .sim-components {
    display: flex;
    gap: 20px;
  }

  .sim-header {
    display: flex;
    gap: 3px;
    align-items: center;
    margin: 0 0 14px;
  }

  .refresh-button {
    border: none;
    cursor: pointer;
    background: none;
    border-radius: 3px;
  }
</style>
