import { render, html, svg } from './uhtml.js';
import { download } from "./download.js";
import { addEvents } from "./addEvents.js";
import view from "./view.js";
import { evaluateNode } from "./evaluateNode.js";
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
  EVALUATE_NODE({ id }, state) {
    evaluateNode(id, state.nodes, state.connections, state.nodeTypes).then( () => {
      dispatch("RENDER");
    });
  },
  DELETE_NODE({ id }, state) {
    state.connections =
      state.connections.filter(([o, i]) => !o.includes(id) && !i.includes(id));
    delete state.nodes[id];
    state.selectedNodes = state.selectedNodes.filter(x => x !== id);
    dispatch("RENDER");
  },
  MOVE_NODE({ id, dx, dy }, state) {
    const node = state.nodes[id];
    if (!node) return;
    node.x += dx;
    node.y += dy;
  },
  REMOVE_CONNECTION({ index }, state) {
    state.connections = state.connections.filter((x, i) => i !== index);
    dispatch("RENDER");
  },
  ADD_CONNECTION({ from, to }, state) {
    // TODO: type check here
    state.connections.push([ from, to ]);
    dispatch("RENDER");
  }
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

window.addEventListener("load", () => {
  const r = () => {
    render(document.body, view(global_state));
    requestAnimationFrame(r);
  };
  // requestAnimationFrame(r);

  // setInterval(r, 1000/30);
  

  dispatch("INIT");
});