import React from 'react';
import Chart from './components/chart/chart.component';

import './alertmanagement.styles.scss';
import SearchBar from 'react-js-search';
import { Pagination } from 'antd';
// Import React Table
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
let api = 'http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty&size=300';

class AlertManagement extends React.Component{
    constructor(){
        super();
        this.state = {
            data: [],
            dataSearch: [],
            isSearch: false,
            currentPage: 1,
            pageSize: 20,
            api : 'http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty',
        }
    }  
    componentDidMount() {
        this.getData();
        // this.interval = setInterval(this.tick, 5000);
    }
    
    componentWillUnmount() {
    //    clearInterval(this.interval);
    }

    getData = () => {
        const that = this;
        console.log("api state",that.state.api);
        fetch(that.state.api)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonData) {
                const dataFetch = jsonData.hits.hits;
                let search = [];
                dataFetch.map((item) => {
                    search = [...search, item._source]
                });
                that.setState({ 
                    data : search,
                    dataSearch : search,
                }); 
                
            })
            .catch(function(error) {
            that.setState({ apiInfo:error });
            console.log(error);
            });
    }

    onChange = (page, pageSize) => {
        this.setState({
            currentPage: page,
            pageSize: pageSize,
        });
        // console.log(this.state.current)
    };
    onSearchChange = (term, hits) =>{
        // console.log("term", term);
        // console.log("hits",  hits);
        term == '' ? 
        this.setState({
            currentPage: 1,
            isSearch: false
        }):
        this.setState({
            currentPage: 1,
            isSearch: true,
            dataSearch: hits,
        })
    }
    filter = () => {
        let killChain = document.getElementById('killChain').value;
        let layer = document.getElementById('layer').value;
        let impact = document.getElementById('impact').value;
        let severity = document.getElementById('severity').value;
        if(killChain != 'all'){
            this.setState({
                api: api +"&q=+kill_chain:(\""+killChain+"\")",
            },()=>{
                this.getData();
            })
            console.log("api1:", this.state.api);
        }
        // this.getData();
    };
    render(){
        const {data, dataSearch, currentPage, pageSize} = this.state;
        const indexOfLast = currentPage * pageSize;
        const indexOfFist = indexOfLast - pageSize;
        let list = [];
        let totalRow = 0;
        this.state.isSearch ? list = dataSearch.slice(indexOfFist, indexOfLast) : list = data.slice(indexOfFist, indexOfLast);
        this.state.isSearch ? totalRow = dataSearch.length : totalRow = data.length;

        return(
            <div className="alertManagement">
                 <Chart />
                <div className='filter'>    
                    <SearchBar 
                        onSearchTextChange={ (term,hits) => {this.onSearchChange(term,hits)}}
                        onSearchButtonClick={this.onSearchClick}
                        placeHolderText={"Search here..."}
                        data={this.state.data}
                        />
                    <div className="row">
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
                    </div>
                    <div className="row">
                        <div className='col-3'>
                            <label htmlFor="src">Source: </label>
                            <input type="text"/>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="des">Destination: </label>
                            <input type="text"/>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="timeFrom">Time from: </label>
                            <input type="datetime-local"/>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="timeTo">to: </label>
                            <input type="datetime-local"/>
                        </div>
                    </div>
                </div>
                <ReactTable
                    data={list}
                    columns={[
                        {
                            Header: "Customer",
                            accessor: "customer"
                        },
                        {
                            Header: "Kill_chain",
                            accessor: "kill_chain"
                        },
                        {
                            Header: "Host",
                            accessor: "host"
                        },
                        {
                            Header: "Internal ip",
                            accessor: "internal_ip"
                        },
                        {
                            Header: "Severity",
                            accessor: "severity"
                        },
                        {
                            Header: "Message",
                            accessor: "message"
                        }
                        
                    ]}
                    defaultPageSize={10}
                    style={{
                        height: "55vh" // This will force the table body to overflow and scroll, since there is not enough room
                    }}
                    className="-striped -highlight"
                />
                {/* <table>
                    <thead>
                        <tr>
                            <th style={{width:'auto'}}>#</th>
                            <th style={{width:'20%'}}>Customer</th>
                            <th style={{width:'auto'}}>Kill_chain</th>
                            <th style={{width:'10%'}}>Host</th>
                            <th style={{width:'10%'}}>Internal ip</th>
                            <th style={{width:'5%'}}>Severity</th>
                            <th style={{width:'30%'}}>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            console.log(list)}{
                            list.map((item, index) =>{
                                return <tr key={index+1}>
                                    <td>{index+1+indexOfFist}</td>
                                    <td>{item.customer}</td>
                                    <td>{item.kill_chain}</td>
                                    <td>{item.host}</td>
                                    <td>{item.internal_ip}</td>
                                    <td>{item.severity}</td>
                                    <td>{item.message}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table> */}
                {/* <div className='pagination'>    
                    <Pagination 
                        total={totalRow}
                        showTotal={total => `Total ${total} items`}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        pageSizeOptions={["10", "20", "50", "100"]} 
                        defaultPageSize={this.state.pageSize}
                        current={this.state.currentPage}
                        onChange={this.onChange}
                    />
                </div> */}
            </div>
        )
    }
}


export default AlertManagement;
