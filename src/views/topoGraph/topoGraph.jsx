import React from 'react';
import Graph from "react-graph-vis";
import './topoGraph.styles.scss';

class TopoGraph extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            graph: {
                nodes: [
                  { id: 1, label: "Node 1", color: "#e04141" },
                  { id: 2, label: "Node 2", color: "#e09c41" },
                  { id: 3, label: "Node 3", color: "#e0df41" },
                  { id: 4, label: "Node 4", color: "#7be041" },
                  { id: 5, label: "Node 5", color: "#41e0c9" }
                ],
                edges: [
                  { from: 1, to: 2 },
                  { from: 1, to: 3 },
                  { from: 2, to: 4 },
                  { from: 2, to: 5 }
                ]
              },
              counter: 5,

        }
    }
    
    componentDidMount() {
    }

    createNode = (x, y, node) => {
        const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const color = '#' + red + green + blue;

        const from = node[0];
        let id = this.state.counter + 1,
        {nodes, edges} = this.state.graph;

        this.setState({
            graph: {
                nodes: [...nodes,{ id, label: `Node ${id}`, color, x, y }],
                edges: [...edges,{ from, to: id }]
            },
            counter: id,
        });
    }
    render() {
    
    const options = {
        layout: {
            hierarchical: false
        },
        edges: {
            color: "#FFFFFF"
        },
        height: "900px"
    };

    const events = {
        select: ({ nodes, edges }) => {
            // console.log("Selected nodes:",nodes);
            // console.log("Selected edges:",edges);
            alert("Selected node: " + nodes);
        },
        doubleClick: ({ pointer: { canvas }, nodes }) => {
            // console.log('double click');
            this.createNode(canvas.x, canvas.y, nodes);
        }
        
    };
    return (
        <div className='topoGraph'>
            <h1 style={{color: 'yellow'}}>Topo Graph</h1>
            <Graph
                graph={this.state.graph}
                options={options}
                events={events}
                // getNetwork={network => {
                // //  if you want access to vis.js network api you can set the state in a parent component using this property
                // }}
            />
        </div>
        );
    }
}


export default TopoGraph;
