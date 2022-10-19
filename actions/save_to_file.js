import { encode, decode } from "./encodeDecodeBOTA.js";
import { global_state as STATE } from "../global_state.js";
import { saveToFile } from "../saveToFile.js";

export function save_to_file() {
  const { nodes, connections, name } = STATE;

  // need to serialize and deserialize typed arrays better
  const file = encode({ nodes, connections, name });
  saveToFile(`${state.name}.json`, file);
}