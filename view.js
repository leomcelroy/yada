// import { html, svg } from './uhtml.js';
import { html, svg } from 'lit-html';
import {repeat} from 'lit-html/directives/repeat.js';
import { onUpload } from "./uploadHandlers.js";
import { delete_node } from "./actions/delete_node.js";
import { evaluate_node } from "./actions/evaluate_node.js";
import { save_to_file } from "./actions/save_to_file.js";
import { set_name } from "./actions/set_name.js";
import { load_file } from "./actions/load_file.js";
import { renderApp } from "./actions/renderApp.js";

const drawNodeToolbox = node => html`
  <div class="toolbox-node" data-type=${node}>
    ${node}
  </div>
`

const drawNodeInput = (k, index, input) => html`
  <div class="node-input">
    <div
      class=${[
        "node-input-circle", 
        "socket", 
        ["upload"].includes(input.input) ? "hide-socket" : ""
      ].join(" ")}
      data-id=${`${k}:in:${index}`}></div>
    <div class="node-input-name">${input.name}</div>
  </div>
`

const drawNodeOutput = (k, index, output) => html`
  <div class="node-output">
    <div class="node-output-name">${output.name}</div>
    <div
      class="node-output-circle socket"
      data-id=${`${k}:out:${index}`}></div>
  </div>
`

const drawNode = (item, state) => { // TODO: make this a keyed-renderApp
  const [ k, node ] = item;
  const nt = state.nodeTypes[node.type];
  if (! nt) {
    // FIXME: better message/exception-type. catch in load-file
    // FIXME: this also crashes all future renderApping
    throw ["The node type '",node.type,"' isn't a known one (name change?): ",Object.keys(state.nodeTypes)].join("");
  }
  
  const selected = state.selectedNodes.includes(k);

  return html`
    <div
      class=${["node", selected ? "selected-node" : ""].join(" ")}
      data-id=${k}
      style=${`left: ${node.x}px; top: ${node.y}px;`}>
      <div class="node-title">
        <div class="node-name">${nt.name}</div>
        <div class="node-buttons">
          <div class="node-play" @click=${e => evaluate_node(k)}>►</div>
          <div class="node-delete" @click=${e => delete_node(k)}>x</div>
        </div>
      </div>
      ${nt.inputs.map((x, i) => drawNodeInput(k, i, x))}
      ${nt.outputs.map((x, i) => drawNodeOutput(k, i, x))}
      <div class="node-view"></div>
    </div>
  `
}
      // <div class="node-trigger-input" data-id=${k}>▼</div>

      // <div class="node-trigger-output" data-id=${k}>▼</div>


function getRelative(selector0, selector1) {
  // Get the top, left coordinates of two elements
  const el0 = document.querySelector(selector0);
  const el1 = document.querySelector(selector1);
  const eleRect = el0?.getBoundingClientRect() || { top: 0, left: 0 };
  const targetRect = el1?.getBoundingClientRect() || { top: 1, left: 1 };

  // Calculate the top and left positions
  const top = eleRect.top - targetRect.top;
  const left = eleRect.left - targetRect.left;

  return [ left, top ];
}

function drawEdge(edge, state) { // there muse be a better way to do this
  const { nodes } = state;
  const [ outNode, inNode ] = edge.map(x => x.split(":")[0]);
  const [ outIndex, inIndex ] = edge.map(x => Number(x.split(":")[2]));
  
  const { x: outX, y: outY, inputs: ins } = nodes[outNode];
  const { x: inX, y: inY } = nodes[inNode];

  if (state.dataflow === null) return;
  // if (!document.querySelector(".socket") || state.dataflow === null) return "";

  // const offset0 = getRelative(`[data-id="${edge[0]}"]`, `.dataflow`);
  // const offset1 = getRelative(`[data-id="${edge[1]}"]`, `.dataflow`);
  // const rect0 = document.querySelector(`[data-id="${edge[0]}"]`)?.getBoundingClientRect() || { top: 0, left: 0 };
  // const rect1 = document.querySelector(`[data-id="${edge[1]}"]`)?.getBoundingClientRect() || { top: 0, left: 0 };

  // const x0 = offset0[0]+rect0.width/2;
  // const y0 = offset0[1]+rect0.height/2;
  // const x1 = offset1[0]+rect1.width/2;
  // const y1 = offset1[1]+rect1.height/2;

  const x0 = (outX + 190)*(state.dataflow.scale()) + state.dataflow.x();
  const y0 = (outY+37+(18.5*(outIndex + ins.length)))*(state.dataflow.scale()) + state.dataflow.y();
  const x1 = (inX)*(state.dataflow.scale()) + state.dataflow.x();
  const y1 = (inY+37+(18.5*inIndex))*(state.dataflow.scale()) + state.dataflow.y();


  let xDist = Math.abs(x0 - x1);
  xDist = xDist/1.3;

  const data = `M ${x0} ${y0} C ${x0 + xDist} ${y0}, ${x1 - xDist} ${y1}, ${x1} ${y1}`;

  return svg`
    <path class="edge" stroke-width=${`${3*state.dataflow.scale()}px`} vector-effect="non-scaling-stroke" d=${data}/>
  `
}

function drawTempEdge(edge, state) {
  if (!document.querySelector(".socket")) return;

  const [ from, [x1, y1] ] = edge;

  if (from === "" || state.dataflow === null) return svg``;

  // const offset0 = getRelative(`[data-id="${from}"]`, `.dataflow`);
  // const x0 = offset0[0]+document.querySelector(`[data-id="${from}"]`).getBoundingClientRect().width/2;
  // const y0 = offset0[1]+document.querySelector(`[data-id="${from}"]`).getBoundingClientRect().height/2;
  
  const { x: outX, y: outY, inputs: ins } = state.nodes[from.split(":")[0]];
  const outIndex = Number(from.split(":")[2]);
  const x0 = (outX + 190)*state.dataflow.scale() + state.dataflow.x();
  const y0 = (outY+37+(18.5*(outIndex + ins.length)))*state.dataflow.scale() + state.dataflow.y();

  let xDist = Math.abs(x0 - x1);
  xDist = xDist/1.3;

  const data = `M ${x0} ${y0} C ${x0 + xDist} ${y0}, ${x1 - xDist} ${y1}, ${x1} ${y1}`;

  return svg`
    <path class="edge" stroke-width=${`${3*state.dataflow.scale()}px`} vector-effect="non-scaling-stroke" d=${data}>
  `
}

const drawSelectBox = box => {
  if (!box || !box.start || !box.end) return "";

  return html`
    <div
      class="select-box"
      style=${`
        background: blue;
        opacity: 0.1;
        z-index: 100;
        position: absolute;
        left: ${box.start[0]}px;
        top:${box.start[1]}px;
        width: ${Math.abs(box.end[0] - box.start[0])}px;
        height:${Math.abs(box.end[1] - box.start[1])}px;
      `}>
    </div>
  `
}

function drawNodeInputs(state) {
  const id = state.selectedNodes[0];
  const node = state.nodes[id];
  const nodeType = state.nodeTypes[node.type];

  const onInput = (v, index) => {
    node.inputs[index] = v;
  }

  const inputTypes = {
    "box": (name, value, wired, index) => html`
      <div class="node-editor-input">
        <span>${name}:</span>
        <input
          .value=${value}
          .disabled=${wired}
          @blur=${renderApp}
          @input=${e => onInput(e.target.value, index)}/>
      </div>
    `,
    "check": (name, value, wired, index) => html`
      <div class="node-editor-input">
        <span>${name}:</span>
        <input
          type=checkbox
          .checked=${value ? 'checked' : ''}
          .disabled=${wired}
          @blur=${renderApp}
          @input=${e => onInput(!!e.target.checked, index)}/>
      </div>
    `,
    "upload": (name, value, wired, index) => html`
      <div class="node-editor-input">
        <input type="file" @change=${(e) => onUpload(e, node, name, value, wired, index)}/>
      </div>
    `
  }

  const drawInput = (i, index) => {

    const wired = state.connections.some(([o, i]) => i === `${id}:in:${index}`);

    const result = i.input && i.input in inputTypes
      ? inputTypes[i.input](i.name, node.inputs[index], wired, index)
      : html``;

    return result;
  }

  return html`
    <div class="node-editor-name">${node.type}</div>
    ${nodeType.inputs.map(drawInput)}
  `
}

export function view(state) {
  let searchQuery = document.querySelector(".toolbox-search")?.value || "";
  searchQuery = searchQuery.toLowerCase();
  const filteredNodes = Object.keys(state.nodeTypes).filter(x => x.toLowerCase().includes(searchQuery));

  return html`
    <div class="root">
      <div class="menu">
        <div 
          class="menu-item menu-name" 
          contenteditable 
          spellcheck="false"
          @blur=${e => set_name(e.target.innerText)}>${state.name}</div>
        <div class="menu-item" @click=${() => save_to_file()}>save</div>
        <div class="menu-item" @click=${() => document.getElementById("load_file").click()}>load</div>
        <!-- hidden -->
        <input type="file" accept=".json" style="display:none;" id="load_file" name="file" @input=${e => {
          const file = e.target.files[0];
          readFile(file).then( json => load_file(json) ); 
        }}>

        <div class="menu-item dropdown-container">
          list menu
          <div class="dropdown-list">
            <span>
              option 1
            </span>
            <span>
              option 2
            </span>
          </div>
        </div>
        <a class="menu-item" href="https://github.com/leomcelroy/yada" target="_blank">github</a>
      </div>
      <div class="bottom-container">
        <div class="toolbox">
          <div class="toolbox-search-container">
            <input class="toolbox-search" @input=${renderApp}></input>
            <div class="toolbox-search-results">
              ${filteredNodes.map(drawNodeToolbox)}
            </div>
          </div>
          ${state.selectedNodes.length === 1
              ? html`<div class="node-input-editor">
                  ${drawNodeInputs(state)}
                  <div>state: ${JSON.stringify(state.nodes[state.selectedNodes[0]].state)}</div>
                </div>`
              : ""
          }
        </div>
        <div class="dataflow">
          <svg class="edges">
            <g>
              ${state.connections.map(x => drawEdge(x, state))}
              ${drawTempEdge(state.tempEdge, state)}
            </g>
          </svg>
          <div class="nodes">
            <div class="transform-group">
              ${repeat(
                Object.entries(state.nodes), 
                node => node[0], 
                (x) => drawNode(x, state)
              )}
              
              ${drawSelectBox(state.selectBox)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// ${Object.entries(state.nodes).map(e => drawNode(e, state))}



function readFile(file) {
  // file is an event.target.files[0], from change event of a <input type="file")
  return new Promise((resolve, reject) => {
    let fr = new FileReader();
    fr.onload = x=> resolve(fr.result);
    fr.readAsText(file);
})}
