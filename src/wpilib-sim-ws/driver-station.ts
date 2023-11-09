import { writable, derived } from "svelte/store";
import { wss, wssReadyPromise } from "./websocket";

const dsPayloadToStoreMap = {
  ">new_data": "newData",
  ">enabled": "enabled",
  ">autonomous": "autonomous",
  ">test": "test",
  ">estop": "eStop",
  ">fms": "fms",
  ">ds": "ds",
  ">station": "station",
  ">match_time": "matchTime",
  ">game_data": "gameData",
};

function createDsStore() {
  return {
    newData: writable(false),
    enabled: writable(false),
    autonomous: writable(false),
    test: writable(false),
    eStop: writable(false),
    fms: writable(false),
    ds: writable(false),
    station: writable("red1"),
    matchTime: writable(-1),
    gameData: writable(""),
  };
}

function createUserDsStore() {
  const dsStore = createDsStore();

  const setAuto = () => {
    wssReadyPromise.then(() => {
      wss.driverStationUpdateToWpilib({
        ">enabled": true,
        ">autonomous": true,
        ">test": false,
        ">new_data": true,
      });
      dsStore.enabled.set(true);
      dsStore.autonomous.set(true);
      dsStore.test.set(false);
      dsStore.newData.set(true);
    });
  };
  const setTeleop = () => {
    wssReadyPromise.then(() => {
      wss.driverStationUpdateToWpilib({
        ">enabled": true,
        ">autonomous": false,
        ">test": false,
        ">new_data": true,
      });
      dsStore.enabled.set(true);
      dsStore.autonomous.set(false);
      dsStore.test.set(false);
      dsStore.newData.set(true);
    });
  };
  const setTest = () => {
    wssReadyPromise.then(() => {
      wss.driverStationUpdateToWpilib({
        ">enabled": true,
        ">autonomous": false,
        ">test": true,
        ">new_data": true,
      });
      dsStore.enabled.set(true);
      dsStore.autonomous.set(false);
      dsStore.test.set(true);
      dsStore.newData.set(true);
    });
  };
  const setDisabled = () => {
    wssReadyPromise.then(() => {
      wss.driverStationUpdateToWpilib({
        ">enabled": false,
        ">autonomous": false,
        ">test": false,
        ">new_data": true,
      });
      dsStore.enabled.set(false);
      dsStore.autonomous.set(false);
      dsStore.test.set(false);
      dsStore.newData.set(true);
    });
  };

  const setStation = (station: string) => {
    wssReadyPromise.then(() => {
      wss.driverStationUpdateToWpilib({
        ">station": station,
      });
      dsStore.station.set(station);
    });
  };
  const setMatchTime = (matchTime: number) => {
    wssReadyPromise.then(() => {
      wss.driverStationUpdateToWpilib({
        ">match_time": matchTime,
      });
      dsStore.matchTime.set(matchTime);
    });
  };
  const setGameData = (gameData: string) => {
    wssReadyPromise.then(() => {
      wss.driverStationUpdateToWpilib({
        ">game_data": gameData as any,
      });
      dsStore.gameData.set(gameData);
    });
  };

  const isTeleop = derived(
    [dsStore.autonomous, dsStore.test, dsStore.enabled],
    ([$autonomous, $test, $enabled]) => !$autonomous && !$test && $enabled
  );

  const isAuto = derived(
    [dsStore.autonomous, dsStore.test, dsStore.enabled],
    ([$autonomous, $test, $enabled]) => $autonomous && !$test && $enabled
  );

  const isTest = derived(
    [dsStore.autonomous, dsStore.test, dsStore.enabled],
    ([$autonomous, $test, $enabled]) => !$autonomous && $test && $enabled
  );

  const isDisabled = derived(
    [dsStore.enabled],
    ([$enabled]) => !$enabled
  );

  
  wss.addListener("driverStationEvent", (payload) => {
    Object.entries(payload).forEach(([payloadProp, value]) => {
      const storeProp = (dsPayloadToStoreMap as any)[payloadProp];
      (dsStore as any)[storeProp].set(value);
    });
  });

  return {
    isTeleop,
    isAuto,
    isTest,
    isDisabled,
    station: { subscribe: dsStore.station.subscribe, set: setStation },
    matchTime: { subscribe: dsStore.matchTime.subscribe, set: setMatchTime },
    gameData: { subscribe: dsStore.gameData.subscribe, set: setGameData },
    setAuto,
    setTeleop,
    setTest,
    setDisabled,
    setStation,
    setMatchTime,
    setGameData,
  };
}

export const dsStore = createUserDsStore();
