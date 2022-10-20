import { render, html, svg } from './uhtml.js';
import { addEvents } from "./addEvents.js";
import { view } from "./view.js";
import { global_state as STATE } from "./global_state.js";

window.LOG_STATE = () => console.log(STATE);

let lastTime = 0;
const r = (time) => {
  const fps = 0;
  const elapsed = time - lastTime;
  if (fps === 0 || elapsed > 1000/fps) {
    render(document.body, view(STATE));
    lastTime = time;
  }
  requestAnimationFrame(r);
};

// setInterval(r, 1000/30);

window.addEventListener("load", () => {
  render(document.body, view(STATE));
  addEvents(STATE);
  render(document.body, view(STATE));
  // setInterval(r, 1000/30);
  // requestAnimationFrame(r);
});