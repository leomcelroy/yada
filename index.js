import { addEvents } from "./addEvents.js";
import { view } from "./view.js";
import { global_state as STATE } from "./global_state.js";
import { render, html, svg } from 'https://cdn.skypack.dev/lit-html';


const r = () => render(view(STATE), document.body);

window.LOG_STATE = () => console.log(STATE);

let lastTime = 0;
const loop = (time) => {
  const fps = 60;
  const elapsed = time - lastTime;
  if (fps === 0 || elapsed > 1000/fps) {
    r();
    lastTime = time;
  }
  requestAnimationFrame(loop);
};

// setInterval(r, 1000/30);

window.addEventListener("load", () => {
  r();
  addEvents(STATE);
  r();
  // setInterval(r, 1000/30);
  // requestAnimationFrame(loop);
});