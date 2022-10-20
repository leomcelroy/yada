import { render, html, svg } from '../uhtml.js';

export default {
  name: "async_adder",
  inputs: [
    { name: "x", type: "number", input: "box" },
    { name: "y", type: "number", input: "box" }
  ],
  outputs: [
    { name: "sum", type: "number" }
  ],
  onUpdate(node) {

    return html.node`
      <div>hello world</div>
      <div>the answer is ${node.outputs[0]}</div>
    `
  },
  func: async (x, y) => {

    const result = new Promise(resolve => {
      setTimeout(() => {
        resolve(x+y);
      }, 1000);
    })


    return await Promise.all([result]);
  }
}

