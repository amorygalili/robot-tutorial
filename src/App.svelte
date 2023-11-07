<script lang="ts">
  import { setSimWsContext } from "./wpilib-sim-ws/websocket";
  import Counter from "./lib/Counter.svelte";
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import { startPythonClient } from "./python/client/main";
  import { onMount } from "svelte";
  import FileExplorer from "./lib/file-explorer/FileExplorer.svelte";
  import { type FileExplorerNode } from "./lib/file-explorer/types";

  let fileData: FileExplorerNode[] = [
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "util",
          type: "folder",
          children: [{ name: "units.py", type: "file" }],
        },
        {
          name: "robot.py",
          type: "file",
        },
      ],
    },
  ];

  setSimWsContext();

  onMount(() => {
    startPythonClient();
  });
</script>

<main>
  <Splitpanes class="default-theme" style="height: 100vh">
    <Pane minSize={20}>I have a min width of 20%</Pane>
    <Pane minSize={40} size={60}>
      <Splitpanes class="default-theme" horizontal={true}>
        <Pane minSize={15}>
          <Splitpanes class="default-theme">
            <Pane minSize={15} size={25}>
              <div class="file-explorer">
                <h2>Project Files</h2>
                <FileExplorer {fileData} />
              </div>
            </Pane>
            <Pane minSize={50}>
              <div
                id="container"
                style="width:100%;height:100%;border:1px solid grey"
              />
            </Pane>
          </Splitpanes>
        </Pane>
        <Pane minSize={15}>
          <Counter />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</main>

<style>

  h2 {
    font-family: sans-serif;
    margin: 0 0 14px;
    color: #333;
  }

  :global(.splitpanes__pane) {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2) inset;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
  }

  .file-explorer {
    height: 100%;
    width: 100%;
    padding: 12px 10px;
    box-sizing: border-box;
  }
</style>
