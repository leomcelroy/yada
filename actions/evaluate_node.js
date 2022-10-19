import { evaluateNode } from "../evaluateNode.js";
import { global_state as STATE } from "../global_state.js";
import { render } from "./render.js";

export function evaluate_node(id) {
  evaluateNode(id, STATE.nodes, STATE.connections, STATE.nodeTypes)
    .then( () => {
      render();
    });
}