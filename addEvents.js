import { addSelectBox } from "./events/addSelectBox.js";
import { addDropUpload } from "./events/addDropUpload.js";
import { addPanZoom } from "./events/addPanZoom.js";

import { renderApp } from "./actions/renderApp.js";
import { remove_connection } from "./actions/remove_connection.js";
import { add_connection } from "./actions/add_connection.js";
import { delete_node } from "./actions/delete_node.js";
import { move_node } from "./actions/move_node.js";
import { evaluate_node } from "./actions/evaluate_node.js";

import { defaultValues } from "./types.js";

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
  let typeToAdd = "";

  listen("mousedown", ".toolbox-node", e => {
    typeToAdd = e.target.dataset.type;
    dragging = true;
    id = Math.random().toString(16).slice(2);
    renderApp();
  })

  listen("mousemove", "", e => {
    if (!dragging) return;


    const [ x, y ] = state.dataflow.getPoint(...getXY(e, ".dataflow"));

    const { inputs, outputs } = state.nodeTypes[typeToAdd];

    const defaultInputs = inputs.map(x => defaultValues[x.type]);
    const defaultOutputs = outputs.map(x => defaultValues[x.type]);

    // TODO: get default values from types
    state.nodes[id] = {
      type: typeToAdd,
      state: {},
      x,
      y,
      inputs: defaultInputs,
      outputs: defaultOutputs,
      evaluated: new Array(defaultOutputs.length).fill(false)
    }
    renderApp();

  })

  listen("mouseup", "", e => {
    if (dragging && pathContains(e, ".toolbox")) {
      delete state.nodes[id];
      renderApp();
    }

    /*
    TODO: FIXME:
    Do I need this? 
    adding node should set proper default value
    */
    if (id !== "" && pathContains(e, ".dataflow")) {
      evaluate_node(id);
    }

    id = "";
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
    renderApp();
  })

  listen("mousemove", "", e => {
    if (from !== "") {
      const rect = document.querySelector(`[data-id="${from}"]`).getBoundingClientRect();
      const [ rx, ry ] = getRelative(`[data-id="${from}"]`, ".dataflow");
      state.tempEdge = [
        from,
        getXY(e, ".dataflow")
      ];
      renderApp();
    }

    if (currentIndex !== -1) {
      remove_connection(currentIndex);
      currentIndex = -1;
    }
  })


  listen("mouseup", "", e => {
    if (from === "") return;

    if (from !== "" && to !== "") {
      // console.log("add", from, to);
      currentIndex = state.connections.findIndex( x => x[1] === to);
      if (currentIndex !== -1) {
        remove_connection(currentIndex);
      }
      add_connection(from, to);
    }

    from = "";
    to = "";
    currentIndex = -1;

    state.tempEdge = ["", [0, 0]];
    renderApp();
  })

}

function addNodeDragging(listen, state) {
  let nodeClicked = false;
  let nodeId = "";
  let moved = false;

  listen("mousedown", "", e => {

    document.body.classList.add("no-select");
    if (pathContains(e, ".socket")) {
      state.dataflow.togglePanZoom(true);
      return;
    }

    if (!pathContains(e, ".dataflow")) return;

    nodeClicked = e.composedPath().find(div => div.matches && div.matches(".node"));

    if (pathContains(e, ".node")) {
      state.dataflow.togglePanZoom(true);
      nodeId = nodeClicked.dataset.id;
      const selected = state.selectedNodes.includes(nodeId);
      if (selected && e.detail === 2) { // if selected how to remove
        // state.selectedNodes = state.selectedNodes.filter(id => id !== nodeId);
      } else if (!state.selectedNodes.includes(nodeId) && !e.shiftKey){
        state.selectedNodes = [nodeId];
      } else if (!state.selectedNodes.includes(nodeId) && e.shiftKey) {
        state.selectedNodes.push(nodeId);
      }
    } else if (!e.shiftKey) {
      state.selectedNodes = [];
    }

    // hacky bug fix, for some reason input views intefere with each other
    // const tempSelected = state.selectedNodes;
    // state.selectedNodes = [];
    // renderApp();

    // state.selectedNodes = tempSelected;
    renderApp();
  })

  listen("mousemove", "", e => {
    if (!nodeClicked) return

    moved = true;

    const scale = state.dataflow.scale()
    state.selectedNodes.forEach(id => {
      move_node(id, e.movementX/scale, e.movementY/scale);
    })

    renderApp();

  })

  listen("mouseup", "", e => {
    // TODO: if over toolbox then delete node

    document.body.classList.remove("no-select");

    // if (state.selectedNodes.length === 1 && moved) {
    //   state.selectedNodes = [];
    //   renderApp();
    // }

    nodeClicked = false;
    nodeId = "";
    state.dataflow.togglePanZoom(false);
    moved = false;

  })
}

function fixBrowserZoom() {
  let px_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
  const edges = document.querySelector(".edges");
  window.addEventListener("resize", e => {
    // console.log("resizing", e);
    var newPx_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    if (newPx_ratio != px_ratio) {
        px_ratio = newPx_ratio;
        // console.log("zooming");
        // console.log(px_ratio);
        edges.style.scale = `calc(${px_ratio}/2)`;
        return true;
    } else{
        // console.log("just resizing");
        return false;
    }
  })
}

function preventZoom() {
  document.addEventListener("keydown", e => {
    const keysOfInterest = [61, 107, 173, 109, 187, 189];
    if ((e.ctrlKey || e.metaKey) && keysOfInterest.some(x => e.which === x)) {
      e.preventDefault();
    }
  });

  // TODO: check this
  document.addEventListener("mousewheel", e => {
    if (e.ctrlKey || e.metaKey) e.preventDefault();
  });
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

  preventZoom();
}
