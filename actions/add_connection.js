import { global_state as STATE } from "../global_state.js";
import { renderApp } from "./renderApp.js";

export function add_connection(from, to) {
  STATE.connections.push([ from, to ]);
  
  renderApp();
}
