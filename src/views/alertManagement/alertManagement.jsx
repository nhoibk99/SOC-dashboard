import React from 'react';
import Chart from './components/chart/chart.component';
import moment from 'moment';
import './alertmanagement.styles.scss';
import SearchBar from 'react-js-search';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';

class AlertManagement extends React.Component{
    timeNow = React.createRef();
    timeDayAgo = React.createRef();
    constructor(){
        super();
        this.state = {
            api : 'http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty',
            data: [],
            isSearch: false,
            searchText:'',
            dataSearch: [],
            currentPage: 1,
            sizeOfPage: 10,
            totalPage: 0,
            totalRow: 0,
            autoRefresh: false,
            // killChain: this.props.data,
        }
    }  
    componentDidMount() {
        this.getData();
        this.state.autoRefresh && (this.interval = setInterval(this.tick, 10000));
    }
    
    componentWillUnmount() {
        this.state.autoRefresh && clearInterval(this.interval);
    }

    getData = () => {
        // console.log("data from home", this.props);
        const that = this;
        const {api, currentPage, sizeOfPage} = this.state;
        const indexOfLast = currentPage * sizeOfPage;
        const indexOfFist = indexOfLast - sizeOfPage;

        // console.log(indexOfFist,indexOfLast);
        // console.log(apiTotal);
        // console.log('auto', this.state.autoRefresh);
        
        let apiTotal= api + '&filter_path=hits.total.value';
        fetch(apiTotal)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonData) {
                const fetchTotal = jsonData.hits.total.value;
                // console.log(fetchTotal);
                that.setState({ 
                   totalPage: parseInt(fetchTotal / that.state.sizeOfPage +1),
                   totalRow: fetchTotal,
                }); 
                
            })
            .catch(function(error) {
            that.setState({ apiInfo:error });
            console.log(error);
            });
            
        let apiFetchData= api + '&from='+indexOfFist+'&size='+sizeOfPage;
        fetch(apiFetchData)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonData) {
                const dataFetch = jsonData.hits.hits;
                let fetch = [];
                dataFetch.map((item,index) => {
                    fetch = [...fetch, {...item._source,stt: index + indexOfFist + 1 ,time: item._source["@timestamp"]}]
                });
                that.setState({ 
                    data : fetch,
                    dataSearch : fetch,
                }); 
                
            })
            .catch(function(error) {
            that.setState({ apiInfo:error });
            console.log(error);
            });
        
            let timeNow = new Date();
            this.timeNow = moment(timeNow).format('YYYY-MM-DDTHH:mm');
            this.timeDayAgo = moment(timeNow).subtract(1,'d').format('YYYY-MM-DDTHH:mm');
            // console.log("time now", this.timeNow);
            // console.log("time day ago", this.timeDayAgo);
            this.setState({

            })
    }

    onSearchChange = (term, hits) =>{
        console.log("term", term);
        console.log("hits",  hits);
        term == '' ? 
        this.setState({
            currentPage: 1,
            isSearch: false
        }):
        this.setState({
            isSearch: true,
            searchText: term,
            currentPage: 1,
            // dataSearch: hits,
        })
    }

    onPageSizeChange = (pageSize, pageIndex) => {
        console.log("page size change", pageSize);
        console.log("page change", pageIndex);
        this.setState({
            currentPage: 1,
            sizeOfPage: pageSize,
        },()=>this.getData())
    }

    onPageChange = (pageIndex) => {
        console.log("page change", pageIndex + 1);
        this.setState({
            currentPage: pageIndex + 1,
        },()=>this.getData())
    }
    
    autoRefresh = () => {
        // console.log("auto refresh");
        this.setState({
            autoRefresh: !(this.autoRefresh),
        },()=>this.getData())
    }
    
    filter = () => {
        let killChain = document.getElementById('killChain').value;
        let layer = document.getElementById('layer').value;
        let impact = document.getElementById('impact').value;
        let severity = document.getElementById('severity').value;
        let sourceIP = document.getElementById('srcIP')?document.getElementById('srcIP').value:'';
        let destinationIP = document.getElementById('desIP')?document.getElementById('desIP').value:'';
        let apiFilter = "http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty";
        if(killChain != 'all' || layer != 'all' || impact != 'all' || severity != 'all' || sourceIP != '' || destinationIP != ''){
            apiFilter += "&q=";

            if(killChain != 'all'){
                apiFilter += "+kill_chain:(\"" + killChain + "\")";
            }
            if(layer != 'all'){
                apiFilter += "+layer:(\"" + layer + "\")";
            }
            if(impact != 'all'){
                apiFilter += "+sub_impact_level:(\"" + impact + "\")";
            }
            if(severity != 'all'){
                apiFilter += "+severity:(\"" + severity + "\")";
            }
            if(sourceIP != ''){
                apiFilter += "+internal_ip:(\"" + sourceIP + "\")";
            }
            if(destinationIP != ''){
                apiFilter += "+dest:(\"" + destinationIP + "\")";
            }
        }
        console.log("aip filter", apiFilter);
        this.setState({
            api: apiFilter,
        },()=>{
            this.getData();
        })
    };

    render(){
        return(
            <div className="alertManagement">
                 <Chart />
                <div className='filter'>    
                    <div className='row'>
                        <div className='col-9'>
                            <SearchBar 
                                onSearchTextChange={ (term,hits) => {this.onSearchChange(term,hits)}}
                                onSearchButtonClick={this.onSearchClick}
                                placeHolderText={"Search here..."}
                                data={this.state.data}
                                />
                        </div>
                        <div className='col-3'>
                            <label className="container">Auto refresh
                                <input id='autoRefresh' type="checkbox" onChange={this.autoRefresh}/>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-3'>
                            <label htmlFor="layer">Layer</label>
                            <select id='layer'  defaultValue="all" onChange={this.filter}>
                                <option value="all">All</option>
                                <option value="NetWork">NetWork</option>
                                <option value="Host">Host</option>
                                <option value="Application">Application</option>
                                <option value="Data">Data</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="killChain">Kill chain</label>
                            <select id='killChain' defaultValue="all" onChange={this.filter}>
                                <option value="all">All</option>
                                <option value="Initial-Access">Initial-Access</option>
                                <option value="Execution">Execution</option>
                                <option value="Persistence">Persistence</option>
                                <option value="Privilege-Escalation">Privilege-Escalation</option>
                                <option value="Defense-Evasion">Defense-Evasion</option>
                                <option value="Credential-Access">Credential-Access</option>
                                <option value="Discovery">Discovery</option>
                                <option value="LateralMovement">LateralMovement</option>
                                <option value="Collection">Collection</option>
                                <option value="Exfiltration">Exfiltration</option>
                                <option value="Command and Control">Command and Control</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="impact">Impact level</label>
                            <select id='impact' defaultValue="all" onChange={this.filter}>
                                <option value="all">All</option>
                                <option value="Website vulnerability">Website vulnerability</option>
                                <option value="Sensitive data exposure">Sensitive data exposure</option>
                                <option value="Abnormal connection">Abnormal connection</option>
                                <option value="CVE">CVE</option>
                                <option value="Security misconfiguration">Security misconfiguration</option>
                                <option value="Baseline IOC">Baseline IOC</option>
                                <option value="DOS attack">DOS attack</option>
                                <option value="Bruteforce attack">Bruteforce attack</option>
                                <option value="Phishing attack">Phishing attack</option>
                                <option value="Web attack">Web attack</option>
                                <option value="Application attack">Application attack</option>
                                <option value="Malware attack">Malware attack</option>
                                <option value="Leaked data">Leaked data</option>
                                <option value="Malware-infected host">Malware-infected host</option>
                                <option value="Inaccessible Service">Inaccessible Service</option>
                                <option value="Attacked website">Attacked website</option>
                                <option value="Compromised server">Compromised server</option>
                                <option value="Webshell">Webshell</option>
                            </select>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="severity">Severity</label> 
                            <select id='severity' defaultValue="all" onChange={this.filter}>
                                <option value="all">All</option>
                                <option value="C">C</option>
                                <option value="H">H</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                            </select>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="srcIP">Source: </label>
                            <input id='srcIP' type="text" onChange={this.filter}/>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="desIP">Destination: </label>
                            <input id='desIP' type="text" onChange={this.filter}/>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="timeFrom">Time from: </label>
                            <input type="datetime-local" value={this.timeDayAgo} onChange={this.filter}/>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="timeTo" >to: </label>
                            <input type="datetime-local" value={this.timeNow} onChange={this.filter} />
                        </div>
                    </div>
                </div>
                <ReactTable
                    data={this.state.data}
                    columns={[
                        {
                            Header: "STT",
                            accessor: "stt",
                            width: 50
                        },
                        {
                            Header: "Time",
                            accessor: "time",
                            width: 190
                        },
                        {
                            Header: "Severity",
                            accessor: "severity",
                            width: 70
                        },
                        {
                            Header: "Message",
                            accessor: "message",
                            width: 150
                        },
                        {
                            Header: "Soucre",
                            accessor: "source",
                            width: 100
                        },
                        {
                            Header: "Destination",
                            accessor: "dest",
                            width: 120
                        },
                        {
                            Header: "Layer",
                            accessor: "layer",
                            width: 120
                        },
                        {
                            Header: "Internal ip",
                            accessor: "internal_ip",
                            width: 120
                        },
                        {
                            Header: "Object",
                            accessor: "object",
                            width: 200
                            
                        },
                        {
                            Header: "Kill chain",
                            accessor: "kill_chain",
                            width: 200
                        },
                        {
                            Header: "Host name",
                            accessor: "hostname",
                            width: 150
                        },
                        {
                            Header: "File name",
                            accessor: "filename",
                            width: 100
                        },
                        {
                            Header: "Source",
                            accessor: "source",
                            width: 100
                        },
                        {
                            Header: "Impact level",
                            accessor: "impact_level",
                            width: 150
                        },
                        {
                            Header: "Sub impact",
                            accessor: "sub_impact_level",
                            width: 200
                        }
                        
                    ]}
                    pages={this.state.totalPage}
                    pageIndex={this.state.currentPage}
                    defaultPageSize={10}
                    style={{
                        height: "55vh" // This will force the table body to overflow and scroll, since there is not enough room
                    }}
                    className="-striped -highlight"
                    onPageChange={(pageIndex) => {
                        this.onPageChange(pageIndex)
                    }}
                    onPageSizeChange={(pageSize, pageIndex) => {
                        this.onPageSizeChange(pageSize, pageIndex)
                    }}
                    manual
                    onFetchData={(state, instance) => {
                        // show the loading overlay
                        this.setState({loading: true})
                    }}
                />
            </div>
        )
    }
}


export default AlertManagement;
