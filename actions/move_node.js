import { global_state as STATE } from "../global_state.js";
import { renderApp } from "./renderApp.js";

export function move_node(id, dx, dy) {
  const node = STATE.nodes[id];
  if (!node) return;
  node.x += dx;
  node.y += dy;

  renderApp();
}
