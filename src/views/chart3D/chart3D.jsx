import React, { Component } from 'react'

import Graph3D from 'react-graph3d-vis'

class Chart3D extends Component {

  custom(x, y) {
    return (Math.sin(x/50) * Math.cos(y/50) * 50 + 50)
  }

  generateData() {
    let data = []
    var steps = 50;  // number of datapoints will be steps*steps
    var axisMax = 314;
    var axisStep = axisMax / steps;
    for (var x = 0; x < axisMax; x+=axisStep) {
      for (var y = 0; y < axisMax; y+=axisStep) {
        var value = this.custom(x, y);
        data.push({
          x: x,
          y: y,
          z: value,
          style: value
        })
      }
    }
    return data
  }
  render () {
    let data = this.generateData()
    return (
      <Graph3D data={data} />
    )
  }
}
export default Chart3D;