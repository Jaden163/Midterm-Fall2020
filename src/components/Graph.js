import React from "react";
import Plot from "react-plotly.js";

function Graph({ tickerData, colorChange }) {
  let data;
  let layout;
  let config;
  if (tickerData) {
    const x = tickerData.map((object) => object.date);
    const y = tickerData.map((object) => object.close);
    data = [
      {
        type: "scatter",
        mode: "lines",
        x: x,
        y: y,
        line: { color: colorChange },
      },
    ];

    layout = {
      autosize: false,
      height: 250,
      margin: { l: 0, t: 0, r: 0, b: 0 },
      xaxis: {
        // set range for visual clarity using start and end time
        range: [data[0].x.slice(-1)[0], data[0].x[0]],
        automargin: true,
        dtick: 60 * 1000 * 30,
      },
      yaxis: {
        automargin: true,
      },
    };
    config = { displayModeBar: false, responsive: true };

    return (
      <div className="Graph">
        <Plot data={data} layout={layout} config={config} />
      </div>
    );
  } else {
    return <></>;
  }
}
export default Graph;
