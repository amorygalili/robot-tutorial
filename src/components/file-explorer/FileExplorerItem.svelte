<script lang="ts">
  import type { FileExplorerNode, FolderNode } from "./types";
  import "@frc-web-components/fwc/components/icon";

  export let node: FileExplorerNode;
</script>

{#if node.type === "folder"}
  <details>
    <summary>
      <div class="info">
        <frc-icon
          class="icon closed"
          color="#555"
          svg-path="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z"
          view-box="0 -960 960 960"
        />
        <frc-icon
          class="icon open"
          color="#555"
          svg-path="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H160v400l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Z"
          view-box="0 -960 960 960"
        />
        {node.name}
      </div>
    </summary>
    <div class="children">
      {#each node.children as child}
        <svelte:self node={child} />
      {/each}
    </div>
  </details>
{:else}
  <div>
    <div class="info file">
      <frc-icon
        class="icon"
        color="black"
        svg-path="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
        view-box="0 -960 960 960"
      />
      {node.name}
    </div>
  </div>
{/if}

<style lang="scss">
  details {
    padding: 2px 0;

    & .open {
      display: none;
    }

    &[open] > summary .open {
      display: inline;
    }

    &[open] > summary .closed {
      display: none;
    }
  }

  details > summary {
    list-style: none;
    cursor: pointer;
  }
  details > summary::-webkit-details-marker {
    display: none;
  }

  .children {
    padding-left: 17px;
  }

  .info {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: sans-serif;
  }

  .file {
    cursor: pointer;
    padding: 2px 0;

    &:hover {
      background-color: #eee;
    }
  }

  .icon {
    width: 15px;
    height: 15px;
  }
  /* Add styles for file and folder icons */
</style>
