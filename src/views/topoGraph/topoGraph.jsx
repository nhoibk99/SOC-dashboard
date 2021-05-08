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
            currentNode: 1,
        }
    }
    
    componentDidMount() {
    }

    createNode = () => {
        const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const color = '#' + red + green + blue;

        const from = this.state.currentNode;
        let id = this.state.counter + 1,
        {nodes, edges} = this.state.graph;

        this.setState({
            graph: {
                nodes: [...nodes,{ id, label: `Node ${id}`, color }],
                edges: [...edges,{ from, to: id }]
            },
            counter: id,
        });
    }

    addNode = () =>{
        console.log('add node');
        let currentNode = this.state.currentNode;
        let {nodes, edges} =  this.state.graph;

    }
    deleteNode = () =>{
        console.log('delete node');
        let currentNode = this.state.currentNode;
        let {nodes, edges} =  this.state.graph;
        let newNodes = [], newEdges=[];
        nodes.map(item =>{
            if(item.id !== currentNode){
                newNodes = [...newNodes,item]
            }
        })
        edges.map(item =>{
            if(item.from !== currentNode && item.to !== currentNode){
                newEdges = [...newEdges,item]
            }
        })
        // console.log('new node', newNodes);
        // console.log('new edge', newEdges);
        // console.log('graph', this.state.graph);

        this.setState({
            graph:{nodes:newNodes, edges: newEdges},
        })
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
            this.setState({currentNode: nodes && nodes[0]})
            alert("Selected node: " + nodes);
        },
        doubleClick: () => {
            // console.log('double click');
            this.createNode();
        }
        
    };
    return (
        <div className='topoGraph'>
            <h1 style={{color: 'yellow'}}>Topo Graph</h1>
            <p style={{color: 'yellow'}}>currentNode:{this.state.currentNode}</p>
            <button className='addNode' onClick={this.createNode}> Add node</button>
            <button className='deleteNode' onClick={this.deleteNode}> Delete node</button>
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
