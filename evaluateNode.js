export function evaluateNode(node, nodes, connections, nodeTypes) {
  // topologically sort the nodes
  // evaluate asynchronously
  // resolve on return or when output is called in node
  const keys = Object.keys(nodes);
  const depths = {};
  keys.forEach(k => depths[k] = -1);

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  const traverse = (n, count) => {
    depths[n] = count++;

    const inputs = connections.filter(([ o, i ]) => {
      return i.includes(n);
    })
      .map( x => x[0].split(":")[0])
      .filter(onlyUnique);

    inputs.forEach(k => traverse(k, count));
  }

  traverse(node, 0);

  const evalOrder = Object.entries(depths)
    .filter(x => x[1] > -1)
    .sort( (a, b) => b[1] - a[1])
    .map(x => x[0])



  evalOrder.forEach(n => {

    const node = nodes[n];
    const type = node.type;
    const nodeType = nodeTypes[type];
    const func = nodeType.func;

    const inputKeys = node.inputs.map((x, i) => {
      return `${n}:in:${i}`;
    })

    const edgeDict = {};
    connections.forEach(c => {
      edgeDict[c[1]] = c[0];
    })

    inputKeys.forEach(k => {
      if (k in edgeDict) {
        const inputIndex = k.split(":")[2];
        const o = edgeDict[k];
        const [outNode, _, index] = o.split(":");
        const val = nodes[outNode].outputs[index];
        node.inputs[inputIndex] = val;
      }
    })

    const outputs = func(...node.inputs);

    node.outputs = outputs;
  })
}