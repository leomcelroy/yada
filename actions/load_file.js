import { global_state as STATE } from "../global_state.js";
import { encode, decode } from "./encodeDecodeBOTA.js";
import { render } from "./render.js";
import { set_name } from "./set_name.js";

export function load_file(json) {
  const { nodes, connections, name } = decode(json);
  STATE.nodes = nodes;
  STATE.connections = connections;
  STATE.name = name;
  render();
  set_name(name);
}
