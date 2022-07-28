import { html, svg, render } from "lit-html";


//render
const connectingVectors = (arrayOfVectors, width, height) => {
  const reducer = (acc, cur, index) =>
    index === 0
      ? [...acc, [[0, 0], cur[0], cur[cur.length - 1]]]
      : [...acc, [acc[index - 1][2], cur[0], cur[cur.length - 1]]];

  const result = arrayOfVectors
    .reduce(reducer, [])
    .map(x => x.slice(0, 2))
    .map(x => renderPolyline(x, width, height, "red"));

  return result;
};

const renderPolyline = (arrayOfPoints, width, height, color = "black") => {
  const pathData = `M ${arrayOfPoints
    .map(pair => `${pair[0]} ${height - pair[1]}`)
    .join(",")}`;

  return svg`<path d="${pathData}" fill="none" stroke="${color}"></path>`;
};

export const renderVectors = (arrayOfVectors, width, height) => {
  const cuts = arrayOfVectors.map(vec => renderPolyline(vec, width, height));
  const moves = connectingVectors(arrayOfVectors, width, height);

  return [...cuts, ...moves];
};