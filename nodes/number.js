import { render, html, svg } from '../uhtml.js';

export default {
  name: "number",
  inputs: [
    { name: "num", type: "number", input: "box", exposed: false },
  ],
  outputs: [
    { name: "num", type: "number" }
  ],
  onUpdate(node, container) {
    container.innerHTML = `value: ${node.inputs[0]}`
  },
  func(num) {
    return [ num ];
  }
}