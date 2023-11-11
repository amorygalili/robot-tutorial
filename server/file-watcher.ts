import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import fs from "fs";
import { join, resolve } from "path";
import { ChildProcess, type ExecException, exec } from "child_process";
import treeKill from 'tree-kill';
import { getLocalDirectory } from "./fs-utils.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const projectPath = resolve(getLocalDirectory(import.meta.url), "..", "bleh", "workspace");

// Serve the frontend
app.use(express.static("public"));

const simCommand = `cd ${projectPath} && py -3 robot.py sim --ws-server --nogui`;
let simProcess: ChildProcess | undefined;

function launchSim(callback: (err: ExecException | null) => unknown) {
  console.log(`Running command: ${simCommand}`);

  // If there is an existing process, kill it and all its children.
  if (simProcess && !simProcess.killed) {
    treeKill(simProcess?.pid!, 'SIGKILL', (err) => {
      if (err) {
        console.error('Failed to kill the simulation process:', err);
        callback(err);
        return;
      }
      console.log('Previous simulation process terminated.');
      startNewProcess(callback);
    });
  } else {
    startNewProcess(callback);
  }
}

function startNewProcess(callback: (err: ExecException | null) => unknown) {
  simProcess = exec(simCommand, (err, stdout, stderr) => {
    if (err) {
      console.error('Failed to start simProcess:', err);
      callback(err);
      return;
    }
    callback(null);
  });
}


launchSim(() => {});

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("WebSocket connected");

  // Handle incoming messages
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);

    // Parse the message as JSON
    const data = JSON.parse(message.toString());

    const { action, params } = data;

    if (action === "updateFile") {
      const { file, content } = params;
      const filePath = join(projectPath, file);

      // Update the file with the new content
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          console.error(`Error writing file: ${err}`);
          ws.send(JSON.stringify({ error: err }));
        } else {
          console.log(`File ${data.filePath} updated`);
          ws.send(JSON.stringify({ success: true }));
        }
      });
    } else if (action === "runSim") {
      launchSim((err) => {
        if (err) {
          console.error(`Error running command: ${err}`);
          ws.send(JSON.stringify({ error: err }));
        } else {
          console.log(`Command ${simCommand} ran successfully`);
          ws.send(JSON.stringify({ success: true }));
        }
      });
    }
  });
});

// Start the server
export function startFileWatcher() {
  server.listen(3040, () => {
    console.log("Server listening on port 3040");
  });
}
