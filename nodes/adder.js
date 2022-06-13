import { render, html, svg } from '../uhtml.js';

export default {
  name: "adder",
  inputs: [
    { name: "x", type: "number", input: "box" },
    { name: "y", type: "number", input: "box" }
  ],
  outputs: [
    { name: "sum", type: "number" }
  ],
  onUpdate(node, container) {
    render(
      container, 
      html`
        <div>hello world</div>
        <div>the answer is ${node.outputs[0]}</div>
      `
    )
  },
  func: (x, y) => {

    return [x + y];
  }
}

