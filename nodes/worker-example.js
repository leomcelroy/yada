
function workerInternal() {

  self.onmessage = function(e) {
    const inputs = e.data;

    self.postMessage(inputs[0] + inputs[1] + 100);

    self.close();
  };

}

export default {
  name: "web worker example",
  inputs: [
    { name: "x", type: "number", input: "box" },
    { name: "y", type: "number", input: "box" }
  ],
  outputs: [
    { name: "sum", type: "number" }
  ],
  onUpdate(node) { },
  func: async (x, y) => {

    const blob = new Blob(["(" + workerInternal.toString() + "())"]);
    const url = window.URL.createObjectURL(blob);
    const worker = new Worker(url);

    const result = new Promise(resolve => {
      worker.onmessage = e => {
        const message = e.data;
        resolve(message);

        // redundant to call this because I call self.close() in internal function
        // worker.terminate();
      };
    })

    worker.postMessage([x, y]);

    return await Promise.all([result]);
  }
}
