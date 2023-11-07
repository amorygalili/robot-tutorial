<script lang="ts">
  import type { FileExplorerNode } from "./types";
  import FileExplorerItem from "./FileExplorerItem.svelte";

  export let fileData: FileExplorerNode[];
</script>

<div>
  {#each fileData as node}
    <FileExplorerItem {node} />
  {/each}
</div>
