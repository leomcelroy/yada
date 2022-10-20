import { global_state as STATE } from "../global_state.js";
import { validateName } from "../validateName.js";

export function set_name() {
  STATE.name = validateName(name);
  const nameContainer = document.querySelector(".menu-name");

  // unfortunately we break our RENDER pattern here
  nameContainer.innerText = STATE.name;
}