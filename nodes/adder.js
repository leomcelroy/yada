export default {
  name: "adder",
  inputs: [
    { name: "x", type: "number", input: "box" },
    { name: "y", type: "number", input: "box" }
  ],
  outputs: [
    { name: "sum", type: "number" }
  ],
  onUpdate(node) {
    // const el = document.createElement("div");
    // el.innerHTML = node.outputs[0];
    // return el;
    
    return `
      <div>hello world</div>
      <div>the answer is ${node.outputs[0]}</div>
    `
  },
  func: (x, y) => {

    return [x + y];
  }
}

