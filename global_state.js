import nodeList from "./nodeList.js"

export const global_state = {
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