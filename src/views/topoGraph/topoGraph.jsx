import React from 'react';
import Graph from "react-graph-vis";
import './topoGraph.styles.scss';
import {AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem  } from '@material-ui/core';
import {
     Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
     FormControl, Select} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

class TopoGraph extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            graph: {
                nodes: [
                  { id: 1, label: "Node 1", color: "#e04141" ,shape: 'circularImage', 
                  image: {
                      selected:'https://image.flaticon.com/icons/png/512/1204/1204102.png',
                      unselected: 'https://i.pinimg.com/originals/3a/69/ae/3a69ae3942d4a9da6c3cbc93b1c8f051.jpg'
                    }},
                  { id: 2, label: "Node 2", color: "#e09c41",shape: 'circularImage',
                  image: {
                      selected:'https://image.flaticon.com/icons/png/512/1204/1204102.png',
                      unselected:'C:/Users/nhoib/OneDrive/Desktop/SOC/soc-dashboard/src/views/topoGraph/icon/Webserver.jpg',
                    }},
                  { id: 3, label: "Node 3", color: "#e0df41" ,shape: 'circularImage', 
                  image: {
                    selected:'https://image.flaticon.com/icons/png/512/1204/1204102.png',
                    unselected: 'https://pdp.edu.vn/wp-content/uploads/2021/02/anh-icon-facebook-cute-dep.jpg',
                  }},
                  { id: 4, label: "Node 4", color: "#7be041" ,shape: 'circularImage', 
                  image: 'https://pbs.twimg.com/profile_images/1211194693767163904/wsPZidB9_400x400.png'},
                  { id: 5, label: "Node 5", color: "#41e0c9" ,shape: 'circularImage', 
                  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpfZRk6RpaqB0p0T8BPFPtjxI0axBPL40h0GtGW1vRkRrfnimPpnCWr2QcXBs55Mzjs7k&usqp=CAU'}
                ],
                edges: [
                  { from: 1, to: 2 },
                  { from: 1, to: 3 },
                  { from: 2, to: 4 },
                  { from: 2, to: 5 }
                ]
            },
            type: [
                "Attacker-icon",
                "Botnet",
                "Bugs",
                "Computer",
                "CyberSec icons",
                "Database",
                "DNS",
                "Download File",
                "ERP",
                "Firewall",
                "Icon malware file",
                "MailServer",
                "Oracle-DB",
                "Phishing",
                "Trojan",
                "Webicons",
                "WebServer",
            ],
            counter: 5,
            currentNode: 1,
            typeOfNode: "Attacker-icon",
            anchorEl: null,
            open: false,
            openDialogCreate: false,
            openDialogDelete: false,
            openDialogEdge: false,
        }
    }
    
    componentDidMount() {
        window.oncontextmenu = function () {
            alert('Right Click')
          }
    }

    handleMenu = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            open: true,
        })
    }

    handleClose = () => {
        this.setState({
            anchorEl: null,
            open: false,
            openDialogCreate: false,
            openDialogDelete: false,
            openDialogEdge: false,
        })
    }
     
    openDialogCreate = () => {
        this.setState({
            openDialogCreate: true,
        })
    }
    
    handleNodeFrom = (event) => {
        this.setState({
            currentNode: event.target.value,
        })
    }

    handleTypeOfNode = (event) => {
        this.setState({
            typeOfNode: event.target.value,
        })
    }

    createNode = () => {
        const id = this.state.counter + 1;
        
        const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const color = '#' + red + green + blue;

        const imageNode = './icon/' + this.state.typeOfNode + '.jpg';
        
        const from = this.state.currentNode;
        let {nodes, edges} = this.state.graph;

        this.setState({
            graph: {
                nodes: [...nodes,{ id, label: `Node ${id}`, color,shape: 'image', image: imageNode}],
                edges: [...edges,{ from, to: id }]
            },
            counter: id,
        }, ()=> this.handleClose())
    }
     
    openDialogDelete = () => {
        this.setState({
            openDialogDelete: true,
        })
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
            return newNodes;
        })
        edges.map(item =>{
            if(item.from !== currentNode && item.to !== currentNode){
                newEdges = [...newEdges,item]
            }
            return newEdges;
        })
        // console.log('new node', newNodes);
        // console.log('new edge', newEdges);
        // console.log('graph', this.state.graph);

        this.setState({
            graph:{nodes:newNodes, edges: newEdges},
        }, ()=> this.handleClose())
    }

    render() {
    
        const options = {
            layout: {
                hierarchical: false
            },
            edges: {
                color: "#000000"
            },
            height: "400px"
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
            },
            contextmenu:() =>{
                alert("context menu");
                return false;
            }
            
        };
        // const classes = useStyles();
        
        return (
            <div>
                <AppBar position="static" style={{ backgroundColor: "gray"}} >
                    <Toolbar>
                        <IconButton  aria-label="menu"
                        onClick={this.handleMenu}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                                id="menu-appbar"
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={this.state.open}
                                onClose={this.handleClose}
                            >
                                {/* <MenuItem onClick={this.createNode}>Create node</MenuItem> */}
                                <MenuItem onClick={this.openDialogCreate}>Create node</MenuItem>
                                <MenuItem onClick={this.openDialogDelete}>Delete node</MenuItem>
                                <MenuItem onClick={this.handleClose}>Change edge</MenuItem>
                            </Menu>
                        <Typography variant="h6" noWrap>
                            Topo Graph
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className='topoGraph'>
                    <Graph
                        graph={this.state.graph}
                        options={options}
                        events={events}
                    />
                </div>
                <div className='infoNode'>
                   <h4  className="text-center">DIV for nodes info </h4>
                   <label className="text-center" htmlFor="">currentNode: Node {this.state.currentNode} </label>
                </div>
                <Dialog className="dialogCreate" maxWidth='xs' fullWidth={true} open={this.state.openDialogCreate}>
                    <DialogTitle id="max-width-dialog-title">
                        Create Node
                    </DialogTitle>
                    <DialogContent>
                        <div className="row">
                            <DialogContentText style={{margin: "10px"}}>
                                Create from node: 
                            </DialogContentText>
                            <form  noValidate>
                                <FormControl>
                                    <Select autoFocus value={this.state.currentNode} onChange={this.handleNodeFrom}>
                                        {this.state.graph.nodes.map((item) =>{
                                            return <MenuItem value={item.id}>{item.label}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </form>
                        </div>
                        <div className="row">
                            <DialogContentText style={{margin: "10px"}}>
                                Type of node: 
                            </DialogContentText>
                            <form  noValidate>
                                <FormControl>
                                    <Select autoFocus value={this.state.typeOfNode} onChange={this.handleTypeOfNode}>
                                        {this.state.type.map((item) =>{
                                                return <MenuItem value={item}>{item}</MenuItem>
                                            })}
                                    </Select>
                                </FormControl>
                            </form>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.createNode} color="primary">Create</Button>
                        <Button onClick={this.handleClose} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog className="dialogDelete" maxWidth='xs' fullWidth={true} open={this.state.openDialogDelete}>
                    <DialogTitle id="max-width-dialog-title">
                        Delete Node
                    </DialogTitle>
                    <DialogContent>
                        <div className="row">
                            <DialogContentText style={{margin: "10px"}}>
                               Are you want to delete Node {" "+ this.state.currentNode + " "}?
                            </DialogContentText>
                            {/* <form  noValidate>
                                <FormControl>
                                    <Select autoFocus value={this.state.currentNode} onChange={this.handleNodeFrom}>
                                        {this.state.graph.nodes.map((item) =>{
                                            return <MenuItem value={item.id}>{item.label}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </form> */}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.deleteNode} color="primary">Delete</Button>
                        <Button onClick={this.handleClose} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}


export default TopoGraph;
