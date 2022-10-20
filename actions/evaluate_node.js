import { evaluateNode } from "../evaluateNode.js";
import { global_state as STATE } from "../global_state.js";
import { renderApp } from "./renderApp.js";

export function evaluate_node(id) {
  evaluateNode(id, STATE.nodes, STATE.connections, STATE.nodeTypes)
    .then( () => {
      renderApp();
    });
}