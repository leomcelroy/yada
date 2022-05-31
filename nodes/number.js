export default {
  name: "number",
  inputs: [
    { name: "num", type: "number", input: "box", exposed: false },
  ],
  outputs: [
    { name: "num", type: "number" }
  ],
  func(num) {
    return [ num ];
  }
}