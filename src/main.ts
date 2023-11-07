import "./app.css";
import App from "./App.svelte";

// wss.on("driverStationEvent", (event) => {
//   console.log("driverstation event:", event);
// });

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
