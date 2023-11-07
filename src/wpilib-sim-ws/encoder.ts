import { writable } from "svelte/store";
import { wss, wssReadyPromise } from "./websocket";

const encoderPayloadToStoreMap = {
  "<channel_a": "channelA",
  "<channel_b": "channelB",
  "<init": "init",
  "<reverse_direction": "reverseDirection",
  "<samples_to_avg": "samplesToAverage",
  ">count": "count",
  ">period": "period",
};

function createEncoderStore() {
  return {
    channelA: writable(-1),
    channelB: writable(-1),
    init: writable(false),
    reverseDirection: writable(false),
    samplesToAverage: writable(0),
    count: writable(0),
    period: writable(0),
  };
}

function createEncoderStores() {
  const stores = Array.from({ length: 8 }, () => createEncoderStore());
  const userStores = stores.map((store, channel) => {
    const setCount = (count: number) => {
      wssReadyPromise.then(() => {
        wss.encoderUpdateToWpilib(channel, {
          ">count": count,
        });
        stores[channel].count.set(count);
      });
    };
    const setPeriod = (period: number) => {
      wssReadyPromise.then(() => {
        wss.encoderUpdateToWpilib(channel, {
          ">period": period,
        });
        stores[channel].period.set(period);
      });
    };

    return {
      ...store,
      count: { subscribe: store.count.subscribe, set: setCount },
      period: { subscribe: store.period.subscribe, set: setPeriod },
      channelA: { subscribe: store.channelA.subscribe },
      channelB: { subscribe: store.channelB.subscribe },
      init: { subscribe: store.init.subscribe },
      reverseDirection: { subscribe: store.reverseDirection.subscribe },
      samplesToAverage: { subscribe: store.samplesToAverage.subscribe },
    };
  });

  wss.addListener("encoderEvent", (channel, payload) => {
    Object.entries(payload).forEach(([payloadProp, value]) => {
      const storeProp = (encoderPayloadToStoreMap as any)[payloadProp];
      (stores[channel] as any)[storeProp].set(value);
    });
  });

  return userStores;
}

export const encoderStore = createEncoderStores();
