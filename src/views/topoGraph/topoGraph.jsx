import React from 'react';
import Graph from "react-graph-vis";
import './topoGraph.styles.scss';
import {AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem  } from '@material-ui/core';
import {makeStyles, 
     Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
     FormControl, FormControlLabel, InputLabel, Select, Switch} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
    form: {
      display: 'flex',
      flexDirection: 'column',
      margin: 'auto',
      width: 'fit-content',
    },
    formControl: {
      marginTop: theme.spacing(2),
      minWidth: 120,
    },
    formControlLabel: {
      marginTop: theme.spacing(1),
    },
  }));
class TopoGraph extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            graph: {
                nodes: [
                  { id: 1, label: "Node 1", color: "#e04141" ,shape: 'image', 
                  image: 'https://i.pinimg.com/originals/3a/69/ae/3a69ae3942d4a9da6c3cbc93b1c8f051.jpg'},
                  { id: 2, label: "Node 2", color: "#e09c41",shape: 'icon',
                  icon: {
                    face: '"FontAwesome"',
                    code: '\uf0c0',
                    size: 50,
                    color: 'orange'
                  }},
                  { id: 3, label: "Node 3", color: "#e0df41" ,shape: 'image', 
                  image: 'https://pdp.edu.vn/wp-content/uploads/2021/02/anh-icon-facebook-cute-dep.jpg'},
                  { id: 4, label: "Node 4", color: "#7be041" ,shape: 'image', 
                  image: 'https://pbs.twimg.com/profile_images/1211194693767163904/wsPZidB9_400x400.png'},
                  { id: 5, label: "Node 5", color: "#41e0c9" ,shape: 'image', 
                  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpfZRk6RpaqB0p0T8BPFPtjxI0axBPL40h0GtGW1vRkRrfnimPpnCWr2QcXBs55Mzjs7k&usqp=CAU'}
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
            auth: true,
            anchorEl: null,
            open: false,
            openDialog: false,
            fullWidth: true,
            maxWidth: 'xs',
        }
    }
    
    componentDidMount() {
        window.oncontextmenu = function () {
            alert('Right Click')
          }
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
            openDialog: false,
            open: false,
        });
    }

    addNode = () =>{
        console.log('add node');
        // let currentNode = this.state.currentNode;
        // let {nodes, edges} =  this.state.graph;

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
        })
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
            openDialog: false,
        })
    }
    openDialogCreate = () => {
        this.setState({
            openDialog: true,
        })
    }
    
    handleNodeFrom = (event) => {
        this.setState({
            currentNode: event.target.value,
        })
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
                                <MenuItem onClick={this.deleteNode}>Delete node</MenuItem>
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
                   <label type="text" value="asflhksjbajand"/>
                   <label htmlFor="">info nodes</label>
                </div>
                <Dialog
                    fullWidth={this.state.fullWidth}
                    maxWidth={this.state.maxWidth}
                    // currentNode={this.state.currentNode}
                    open={this.state.openDialog}
                    onClose={this.handleClose}
                    aria-labelledby="max-width-dialog-title"
                >
                    <DialogTitle id="max-width-dialog-title">Create Node</DialogTitle>
                    <DialogContent>
                        <div className="row">
                            <DialogContentText style={{margin: "10px"}}>
                                Create from node: 
                            </DialogContentText>
                            <form  noValidate>
                                <FormControl>
                                <Select
                                    autoFocus
                                    value={this.state.currentNode}
                                    onChange={this.handleNodeFrom}
                                 >
                                    <MenuItem value={false}>false</MenuItem>
                                    <MenuItem value="xs">xs</MenuItem>
                                    <MenuItem value="1">smáukgfhb</MenuItem>
                                    <MenuItem value="md">md</MenuItem>
                                    <MenuItem value="lg">lg</MenuItem>
                                    <MenuItem value="xl">xl</MenuItem>
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
                                    <Select
                                        autoFocus
                                        value={"Node "+ this.state.currentNode}
                                        onChange={this.handleNodeFrom}
                                    >
                                        {/* <MenuItem value={false}>false</MenuItem> */}
                                        <MenuItem value="Attacker-icons">Attacker-icons</MenuItem>
                                        <MenuItem value="Botnet">Botnet</MenuItem>
                                        <MenuItem value="Bugs">Bugs</MenuItem>
                                        <MenuItem value="Computer">Computer</MenuItem>
                                        <MenuItem value="DNS">DNS</MenuItem>
                                        <MenuItem value="Firewall">Firewall</MenuItem>
                                        <MenuItem value="Database">Database</MenuItem>
                                        <MenuItem value="Trojan">Trojan</MenuItem>
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
            </div>
        );
    }
}


export default TopoGraph;
