import { render, html, svg } from './uhtml.js';
import { download } from "./download.js";
import { addEvents } from "./events.js";
import nodeList from "./nodes/nodeList.js"
import view from "./view.js";
import { evaluateNode } from "./evaluateNode.js";
import { saveToFile } from "./saveToFile.js";
import { validateName } from "./validateName.js";

const STATE = {
  nodeTypes: nodeList,
  nodes: {
    "fds": { type: "number", x: 150, y: 0, inputs: [0], outputs: [42], evaluated: [false] },
    "fsa": { type: "number", x: 30, y: 0, inputs: [0], outputs: [43], evaluated: [false] },
    "dsf": { type: "adder", x: 100, y: 100, inputs: [0, 0], outputs: [42], evaluated: [false] },
  },
  connections: [
    ["fsa:out:0", "dsf:in:0"],
    ["fsa:out:0", "fds:in:0"],
    ["fds:out:0", "dsf:in:1"]
  ],
  selectedNodes: [],
  addDrag: "",
  tempEdge: ["", [0 ,0]],
  dataflow: null,
  name: "default-name"
}

const FLAG_TYPED_ARRAY = "FLAG_TYPED_ARRAY";

const encode = obj => JSON.stringify( obj , function( key, value ){
  // the replacer function is looking for some typed arrays.
  // If found, it replaces it by a trio
  if ( value instanceof Int8Array         ||
       value instanceof Uint8Array        ||
       value instanceof Uint8ClampedArray ||
       value instanceof Int16Array        || 
       value instanceof Uint16Array       ||
       value instanceof Int32Array        || 
       value instanceof Uint32Array       || 
       value instanceof Float32Array      ||
       value instanceof Float64Array       )
  {
    var replacement = {
      constructor: value.constructor.name,
      data: Array.apply([], value),
      flag: FLAG_TYPED_ARRAY
    }
    return replacement;
  }
  return value;
});

const context = typeof window === "undefined" ? global : window;

const decode = (jsonStr) => JSON.parse( jsonStr, function( key, value ){
  // the reviver function looks for the typed array flag
  try{
    if( "flag" in value && value.flag === FLAG_TYPED_ARRAY){
      // if found, we convert it back to a typed array
      const rehydrated = new context[ value.constructor ]( value.data );

      console.log(rehydrated);
      return rehydrated;
    }
  }catch(e){}
  
  // if flag not found no conversion is done
  return value;
});


const ACTIONS = {
  RENDER(args, state) {
    render(document.body, view(state));
  },
  SET_NAME({ name }, state) {
    state.name = validateName(name);
    const nameContainer = document.querySelector(".menu-name");

    // unfortunately we break our RENDER pattern here
    nameContainer.innerText = state.name;
  },
  SAVE_TO_FILE(args, state) {
    const { nodes, connections, name } = state;

    // need to serialize and deserialize typed arrays better
    const file = encode({ nodes, connections, name });
    console.log(file);
    saveToFile(`${state.name}.json`, file);
  },
  UPLOAD({ file }, state) {
    const { nodes, connections, name } = decode(file);
    state.nodes = nodes;
    state.connections = connections;
    state.name = name;
    dispatch("RENDER");
  },
  INIT(args, state) {
    dispatch("RENDER");
    addEvents(state);
    dispatch("RENDER");
  },
  EVALUATE_NODE({ id }, state) {
    evaluateNode(id, state.nodes, state.connections, state.nodeTypes).then( () => {
      dispatch("RENDER");
    });
  },
  DELETE_NODE({ id }, state) {
    state.connections =
      state.connections.filter(([o, i]) => !o.includes(id) && !i.includes(id));
    delete state.nodes[id];
    state.selectedNodes = state.selectedNodes.filter(x => x !== id);
    dispatch("RENDER");
  },
  MOVE_NODE({ id, dx, dy }, state) {
    const node = state.nodes[id];
    if (!node) return;
    node.x += dx;
    node.y += dy;
  },
  REMOVE_CONNECTION({ index }, state) {
    state.connections = state.connections.filter((x, i) => i !== index);
    dispatch("RENDER");
  },
  ADD_CONNECTION({ from, to }, state) {
    // TODO: type check here
    state.connections.push([ from, to ]);
    dispatch("RENDER");
  }
}

export function dispatch(action, args = {}) {
  const trigger = ACTIONS[action];
  if (trigger) return trigger(args, STATE);
  else {
    console.log("Action not recongnized:", action);
    return null;
  }
}

window.LOG_STATE = () => console.log(STATE);

dispatch("INIT");





