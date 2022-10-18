import { global_state as STATE } from "../global_state.js";
import { render } from "./render.js";

export function delete_node(id) {
  STATE.connections = STATE.connections
    .filter(([o, i]) => !o.includes(id) && !i.includes(id));
  
  delete STATE.nodes[id];
  STATE.selectedNodes = STATE.selectedNodes.filter(x => x !== id);
  
  render();
}
