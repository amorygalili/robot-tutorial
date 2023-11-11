import { setContext, getContext } from "svelte";
import { WPILibWebSocketClient } from "@wpilib/node-wpilib-ws";

export const wss = new WPILibWebSocketClient();

export const wssReadyPromise = new Promise((resolve) => {
  wss.addListener("ready", () => {
    resolve(true);
  });
});

export function setSimWsContext() {
  wss.start();
  setContext("simWs", wss);
}

export function getSimWsContext(): WPILibWebSocketClient {
  return getContext("simWs");
}
