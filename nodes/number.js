export default {
  name: "number",
  inputs: [
    { name: "names-that-are-num", type: "number", input: "box", exposed: false },
  ],
  outputs: [
    { name: "names-that-are-num", type: "number" }
  ],
  onUpdate(node, container) {
    container.innerHTML = `value: ${node.inputs[0]}`
  },
  func(num) {
    return [ num ];
  }
}