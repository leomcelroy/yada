export default {
  name: "number",
  inputs: [
    { name: "inputNum", type: "number", input: "box" },
  ],
  outputs: [
    { name: "outputNum", type: "number" }
  ],
  onUpdate(node) {
    return `value: ${node.inputs[0]}`
  },
  func(num) {
    return [ num ];
  }
}