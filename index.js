import { render, html, svg } from './uhtml.js';
import { addEvents } from "./addEvents.js";
import { view } from "./view.js";
import { saveToFile } from "./saveToFile.js";
import { validateName } from "./validateName.js";
import { encode, decode } from "./encodeDecodeBOTA.js";
import { global_state } from "./global_state.js";


const ACTIONS = {
  RENDER(args, state) {
    render(document.body, view(state));
  },
  SET_NAME({ name }, state) {
    state.name = validateName(name);
    const nameContainer = document.querySelector(".menu-name");

    // unfortunately we break our RENDER pattern here
    nameContainer.innerText = state.name;
  },
  SAVE_TO_FILE(args, state) {
    const { nodes, connections, name } = state;

    // need to serialize and deserialize typed arrays better
    const file = encode({ nodes, connections, name });
    console.log(file);
    saveToFile(`${state.name}.json`, file);
  },
  LOAD_FILE({ json }, state) {
    const { nodes, connections, name } = decode(json);
    state.nodes = nodes;
    state.connections = connections;
    state.name = name;
    dispatch("RENDER");
    dispatch("SET_NAME", { name });
  },
  INIT(args, state) {
    console.log("initting");
    dispatch("RENDER");
    addEvents(state);
    dispatch("RENDER");
  },
}

export function dispatch(action, args = {}) {
  const trigger = ACTIONS[action];
  if (trigger) return trigger(args, global_state);
  else {
    console.log("Action not recongnized:", action);
    return null;
  }
}

window.LOG_STATE = () => console.log(global_state);

let lastTime = 0;
const r = (time) => {
  const fps = 0;
  const elapsed = time - lastTime;
  if (fps === 0 || elapsed > 1000/fps) {
    render(document.body, view(global_state));
    lastTime = time;
  }
  requestAnimationFrame(r);
};

// setInterval(r, 1000/30);

window.addEventListener("load", () => {
  // render(document.body, view(global_state));
  dispatch("INIT");
  // requestAnimationFrame(r);
});