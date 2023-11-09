import debounce from "lodash/debounce";

// Expose a function to send the updated contents of a file
class FileWatcher {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket("ws://localhost:3040");
    this.sendUpdatedFileContents = debounce(this.sendUpdatedFileContents, 500);
    this.runSim = debounce(this.runSim, 500);
  }

  public sendUpdatedFileContents(fileContents: string) {
    console.log('send updated file content:', fileContents);
    const message = {
      action: "updateFile",
      params: {
        file: "robot.py",
        content: fileContents,
      },
    };
    this.socket.send(JSON.stringify(message));
  }

  public runSim() {
    const message = {
      action: "runSim",
    };
    this.socket.send(JSON.stringify(message));
  }
}

const fileWatcher = new FileWatcher();

export default fileWatcher;