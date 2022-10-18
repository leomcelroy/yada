import { render as r, html, svg } from '../uhtml.js';
import { global_state as STATE } from "../global_state.js";
import { view } from "../view.js";

export const render = () => {
  r(document.body, view(STATE));
}