import { addPanZoom } from "./panZoom.js";
import { dispatch } from "./index.js";
import { addSelectBox } from "./addSelectBox.js";
import { addDropUpload } from "./addDropUpload.js";

const w = 100;
const h = 100;
const buf = new Uint8ClampedArray(w * h * 4);

for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
        buf[(i * w + j)*4] = i*255/w;
        buf[(i * w + j)*4+1] = j*255/h;
        buf[(i * w + j)*4+2] = 0;
        buf[(i * w + j)*4+3] = 255;
    }
}

const defaultValues = {
  "number": 0,
  "img_uint8": { data: buf, width: w, height: h },
  "img_float32": {"data": new Float32Array(1), "width": 1, "height": 1}
};

const trigger = e => e.composedPath()[0];
const matchesTrigger = (e, selectorString) => trigger(e).matches(selectorString);
const pathContains = (e, selectorString) => e.composedPath().some(el => el.matches && el.matches(selectorString));
// create on listener
const createListener = (target) => (eventName, selectorString, event) => { // focus doesn't work with this, focus doesn't bubble, need focusin
  target.addEventListener(eventName, (e) => {
    e.trigger = trigger(e); // Do I need this? e.target seems to work in many (all?) cases
    if (selectorString === "" || matchesTrigger(e, selectorString)) event(e);
  })
}

function pauseEvent(e) {
  if(e.stopPropagation) e.stopPropagation();
  if(e.preventDefault) e.preventDefault();
  e.cancelBubble=true;
  e.returnValue=false;
  return false;
}

function getRelative(selector0, selector1) {
  // Get the top, left coordinates of two elements
  const el0 = document.querySelector(selector0);
  const el1 = document.querySelector(selector1);
  const eleRect = el0.getBoundingClientRect();
  const targetRect = el1.getBoundingClientRect();

  // Calculate the top and left positions
  const top = eleRect.top - targetRect.top;
  const left = eleRect.left - targetRect.left;

  return [ left, top ];
}

const getXY = (e, selector) => {
  let rect = document.querySelector(selector).getBoundingClientRect();
  let x = e.clientX - rect.left; //x position within the element.
  let y = e.clientY - rect.top;  //y position within the element.

  return [ x, y ];
}

function addNodeAdding(listen, state) {
  let dragging = false;
  let id = "";

  listen("mousedown", ".toolbox-node", e => {
    state.addDrag = e.target.dataset.type;
    dragging = true;
    id = Math.random().toString(16).slice(2);
    dispatch("RENDER");
  })

  listen("mousemove", "", e => {
    if (!dragging) return;


    const [ x, y ] = state.dataflow.getPoint(...getXY(e, ".dataflow"));

    const { inputs, outputs } = state.nodeTypes[state.addDrag];

    const defaultInputs = inputs.map(x => defaultValues[x.type]);
    const defaultOutputs = outputs.map(x => defaultValues[x.type]);

    // TODO: get default values from types
    state.nodes[id] = {
      type: state.addDrag,
      x,
      y,
      inputs: defaultInputs,
      outputs: defaultOutputs,
      evaluated: new Array(defaultOutputs.length).fill(false)
    }
    dispatch("RENDER");

  })

  listen("mouseup", "", e => {
    if (dragging && pathContains(e, ".toolbox")) {
      delete state.nodes[id];
      dispatch("RENDER");
    }

    if (id !== "") {
      dispatch("EVALUATE_NODE", { id });
    }

    id = "";
    state.addDrag = "";
    dragging = false;
  })
}

function addWireManipulation(listen, state) {
  let from = "";
  let to = "";
  let currentIndex = -1;

  listen("mousedown", ".node-input-circle", e => {
    // if connected clickedKey is current input
    const temp = e.target.dataset.id;
    const currentConnection = state.connections.find( x => x[1] === temp);
    currentIndex = state.connections.findIndex( x => x[1] === temp);
    if (currentConnection) {
      from = currentConnection[0];
    }
  })

  listen("mousedown", ".node-output-circle", e => {
    from = e.target.dataset.id;
  })

  listen("mouseup", ".node-input-circle", e => {
    to = e.target.dataset.id;
  })

  listen("wheel", "", e => {
    dispatch("RENDER");
  })

  listen("mousemove", "", e => {
    if (from !== "") {
      const rect = document.querySelector(`[data-id="${from}"]`).getBoundingClientRect();
      const [ rx, ry ] = getRelative(`[data-id="${from}"]`, ".dataflow");
      state.tempEdge = [
        from,
        getXY(e, ".dataflow")
      ];
      dispatch("RENDER");
    }

    if (currentIndex !== -1) {
      // console.log("remove", currentIndex);
      dispatch("REMOVE_CONNECTION", { index: currentIndex });
      currentIndex = -1;
    }
  })


  listen("mouseup", "", e => {
    if (from === "") return;

    if (from !== "" && to !== "") {
      // console.log("add", from, to);
      currentIndex = state.connections.findIndex( x => x[1] === to);
      if (currentIndex !== -1) {
        dispatch("REMOVE_CONNECTION", { index: currentIndex });
      }
      dispatch("ADD_CONNECTION", { from, to });
    }

    from = "";
    to = "";
    currentIndex = -1;

    state.tempEdge = ["", [0, 0]];
    dispatch("RENDER");
  })

}

function addNodeDragging(listen, state) {
  let nodeClicked = false;
  let nodeId = "";
  let moved = false;

  listen("mousedown", "", e => {
    document.body.classList.add("no-select");
    const path = e.composedPath();
    if (path.some(div => div.matches && div.matches(".socket"))) {
      state.dataflow.togglePanZoom(true);
      return;
    }

    if (!pathContains(e, ".dataflow")) return;

    nodeClicked = path.find(div => div.matches && div.matches(".node"));

    if (nodeClicked) {
      state.dataflow.togglePanZoom(true);
      nodeId = nodeClicked.dataset.id;
      const selected = state.selectedNodes.includes(nodeId);
      if (selected && e.detail === 2) {
        state.selectedNodes = state.selectedNodes.filter(id => id !== nodeId);
      } else if (!state.selectedNodes.includes(nodeId) && !e.shiftKey){
        state.selectedNodes = [nodeId];
      } else if (!state.selectedNodes.includes(nodeId) && e.shiftKey) {
        state.selectedNodes.push(nodeId);
      }
    } else if (!e.shiftKey) {
      state.selectedNodes = [];
    }

    // hacky bug fix, for some reason input views intefere with each other
    const tempSelected = state.selectedNodes;
    state.selectedNodes = [];
    dispatch("RENDER");

    state.selectedNodes = tempSelected;
    dispatch("RENDER");
  })

  listen("mousemove", "", e => {
    if (!nodeClicked) return

    moved = true;

    const scale = state.dataflow.scale()
    state.selectedNodes.forEach(id => {
      dispatch("MOVE_NODE", {
        id,
        dx: e.movementX/scale,
        dy: e.movementY/scale
      });
    })

    dispatch("RENDER");

  })

  listen("mouseup", "", e => {
    // TODO: if over toolbox then delete node

    document.body.classList.remove("no-select");

    // if (state.selectedNodes.length === 1 && moved) {
    //   state.selectedNodes = [];
    //   dispatch("RENDER");
    // }

    nodeClicked = false;
    nodeId = "";
    state.dataflow.togglePanZoom(false);
    moved = false;

  })
}

export function addEvents(state) {

  state.dataflow = addPanZoom(document.querySelector(".dataflow"));

  const body = document.querySelector("body");
  const listenBody = createListener(body);

  addNodeDragging(listenBody, state);
  addWireManipulation(listenBody, state);
  addNodeAdding(listenBody, state);
  addSelectBox(listenBody, state);
  addDropUpload(listenBody, state);
}
