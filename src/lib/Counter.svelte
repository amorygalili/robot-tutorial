<script lang="ts">
  import { encoderStore } from "../wpilib-sim-ws/encoder";

  const {
    channelA,
    channelB,
    count,
    init,
    period,
    reverseDirection,
    samplesToAverage,
  } = encoderStore[0];
</script>

<div>
  <p>channel A: {$channelA}</p>
  <p>channel B: {$channelB}</p>
  <p><input type="number" bind:value={$count}  /></p>
</div>
