import { render, html, svg } from './uhtml.js';
import { download } from "./download.js";
import { addEvents } from "./events.js";
import nodeList from "./nodes/nodeList.js"
import view from "./view.js";

const STATE = {
  nodeTypes: nodeList,
  nodes: {
    "fds": { type: "number", x: 150, y: 0 },
    "fsa": { type: "number", x: 30, y: 0 },
    "dsf": { type: "adder", x: 100, y: 100 }
  },
  connections: [
    ["fds:out:0", "dsf:in:0"],
    ["fsa:out:0", "dsf:in:1"]
  ],
  selectedNodes: [],
  addDrag: "",
  tempEdge: ["", [0 ,0]],
  dataflow: null,
}

const ACTIONS = {
  RENDER(args, state) {
    render(document.body, view(state));
  },
  INIT(args, state) {
    dispatch("RENDER");
    addEvents(state);
    dispatch("RENDER");
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
  if (trigger) return trigger(args, STATE);
  else {
    console.log("Action not recongnized:", action);
    return null;
  }
}

dispatch("INIT");





