export default {
  name: "adder",
  inputs: [
    { name: "x", type: "number" },
    { name: "y", type: "number" }
    // z: { type: "number", input: "box" }
  ],
  outputs: [
    { name: "sum", type: "number" }
  ],
  // view({ x, y }) {
  //   return "Hello HTML"
  // },
  func(x, y) {
    return [ x+y ];
  }
}