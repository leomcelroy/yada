import { addEvents } from "./addEvents.js";
import { view } from "./view.js";
import { global_state as STATE } from "./global_state.js";
import { render, html, svg } from 'lit-html';
// import { render, html, svg } from '../uhtml.js';


const r = () => render(view(STATE), document.body);
// const r = () => render(document.body, view(STATE));

window.LOG_STATE = () => console.log(STATE);

let lastTime = 0;
const loop = (time) => {
  // const fps = 0;
  // const elapsed = time - lastTime;
  // if (elapsed > 1000/fps) {
  //   r();
  //   lastTime = time;
  // }

  // console.time();
  r();
  // console.timeEnd();
  requestAnimationFrame(loop);
};

// setInterval(r, 1000/30);

window.addEventListener("load", () => {
  r();
  addEvents(STATE);
  // r();
  // setInterval(r, 1000/30);
  requestAnimationFrame(loop);
});