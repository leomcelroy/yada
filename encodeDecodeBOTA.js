import nodeList from "./nodeList.js";
import { defaultValues, encodeType, decodeType } from "./types.js";

export function encode({ nodes, connections, name }) {
  const result = {
    nodes: {},
    connections, 
    name
  };

  for (const id in nodes) {
    const tempNode = {};
    const node = nodes[id];

    tempNode.x = node.x;
    tempNode.y = node.y;
    tempNode.type = node.type;
    tempNode.inputs = [];
    tempNode.outputs = [];
    tempNode.evaluated = [];

    const nodeType = node.type;
    const inputTypes = nodeList[nodeType].inputs.map(x => x.type);
    const outputTypes = nodeList[nodeType].outputs.map(x => x.type);

    inputTypes.forEach((type, i) => {
      const val = node.inputs[i];
      tempNode.inputs[i] = encodeType(type, val);
    })

    outputTypes.forEach((type, i) => {
      const val = defaultValues[type];
      tempNode.outputs[i] = encodeType(type, val);
      tempNode.evaluated[i] = false;
    })

    result.nodes[id] = tempNode;
  }

  return JSON.stringify(result);
}

export function decode(string) {
  const result = JSON.parse(string);
  const nodes = result.nodes;

  for (const id in nodes) {
    const tempNode = {};
    const node = nodes[id];

    tempNode.x = node.x;
    tempNode.y = node.y;
    tempNode.type = node.type;
    tempNode.inputs = [];
    tempNode.outputs = [];
    tempNode.evaluated = [];

    const nodeType = node.type;
    const inputTypes = nodeList[nodeType].inputs.map(x => x.type);
    const outputTypes = nodeList[nodeType].outputs.map(x => x.type);

    inputTypes.forEach((type, i) => {
      const val = node.inputs[i];
      tempNode.inputs[i] = decodeType(type, val);
    })

    outputTypes.forEach((type, i) => {
      const val = node.outputs[i];
      tempNode.outputs[i] = decodeType(type, val);
      tempNode.evaluated[i] = false;
    })


    nodes[id] = tempNode;
  }

  return result;
}
