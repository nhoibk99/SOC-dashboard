import React from 'react';
import Chart from './components/chart/chart.component';
import moment from 'moment';
import './alertmanagement.styles.scss';
import SearchBar from 'react-js-search';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';

class AlertManagement extends React.Component{
    constructor(){
        super();
        this.state = {
            api : 'http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty',
            apiStart : 'http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty&source= {',
            apiEnd : ']}}}&source_content_type=application/json',
            query:[],
            data: [],
            isSearch: false,
            searchText:'',
            currentPage: 1,
            sizeOfPage: 10,
            totalPage: 0,
            totalRow: 0,
            autoRefresh: false,
            timeFrom:'',
            timeTo:'',
        }
    }  
    componentDidMount() {
        console.log("reload");
        if(this.state.autoRefresh) {
            this.interval = setInterval(this.tick, 10000);
        }
        let now = new Date();
        let To = moment(now).format('YYYY-MM-DDTHH:mm');
        let From = moment(now).subtract(1,'d').format('YYYY-MM-DDTHH:mm');
        this.setState({
            timeFrom: From,
            timeTo: To,
        },() => this.getData())
    }
    
    componentWillUnmount() {
        if(this.state.autoRefresh) {
            clearInterval(this.interval);
        }
        // this.state.autoRefresh && clearInterval(this.interval);
    }

    getData = () => {
        // console.log("data from home", this.props);
        const that = this;
        let {api, apiStart, apiEnd, query, isSearch, searchText, currentPage, sizeOfPage, timeFrom, timeTo} = this.state;
        const indexOfLast = currentPage * sizeOfPage;
        const indexOfFist = indexOfLast - sizeOfPage;
        
        //get data trong 1 ngày tính tới thời điểm hiện tại
        if((timeFrom !== '') && (timeTo !== '')){
            let queryTime = '{ "range":{ "@timestamp":{ "gte":"'+ timeFrom +'", "lt":"'+ timeTo +'" } } }';
            query = [...query, queryTime]
        }
        
        //get data theo search
        if(isSearch){
            let querySearch = '{ "query_string": { "analyze_wildcard": true, "query": "*' + searchText + '*" } }';
            query = [...query, querySearch]
        }
        
        //get data theo page, pageSize
        let apiFetchData= apiStart + '"from" :' + indexOfFist + ', "size" :' + sizeOfPage +',"query":{"bool": { "must":['+ query.toString() + apiEnd;
        fetch(apiFetchData)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonData) {
                const fetchTotal = jsonData.hits.total.value;
                that.setState({ 
                   totalPage: parseInt(fetchTotal / that.state.sizeOfPage +1),
                   totalRow: fetchTotal,
                }); 
                const dataFetch = jsonData.hits.hits;
                let fetch = [];
                dataFetch.map((item,index) => {
                    fetch = [...fetch, {
                            ...item._source,
                            stt: index + indexOfFist + 1 ,
                            time: moment(item._source["@timestamp"]).format("DD/MM/YYYY hh:mm:ss")
                        }
                    ]
                });
                that.setState({ 
                    data : fetch,
                }); 
                
            })
            .catch(function(error) {
            that.setState({ apiInfo:error });
            console.log(error);
            });
    }

    onSearchChange = (term, hits) =>{
        console.log("term", term);
        console.log("hits",  hits);
        term === '' ? 
        this.setState({
            currentPage: 1,
            isSearch: false
        },()=>this.getData()):
        this.setState({
            isSearch: true,
            searchText: term,
            currentPage: 1,
        },()=>this.getData())
    }

    onPageSizeChange = (pageSize, pageIndex) => {
        // console.log("page size change", pageSize);
        // console.log("page change", pageIndex);
        this.setState({
            currentPage: 1,
            sizeOfPage: pageSize,
        },()=>this.getData())
    }

    onPageChange = (pageIndex) => {
        // console.log("page change", pageIndex + 1);
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
        let timeFrom = document.getElementById('timeFrom')?document.getElementById('timeFrom').value:'';
        let timeTo = document.getElementById('timeTo')?document.getElementById('timeTo').value:'';
        let queryFilter = [];
        if(killChain !== 'all'){
            let queryKillChain = '{ "query_string": { "analyze_wildcard": true, "query": "*' + killChain + '*", "fields": ["kill_chain"] } }';
            queryFilter = [...queryFilter, queryKillChain]
        }
        if(layer !== 'all'){
            let queryLayer = '{ "query_string": { "analyze_wildcard": true, "query": "*' + layer + '*", "fields": ["layer"] } }';
            queryFilter = [...queryFilter, queryLayer]
        }
        if(impact !== 'all'){
            let queryImpact = '{ "query_string": { "analyze_wildcard": true, "query": "*' + impact + '*", "fields": ["sub_impact_level"] } }';
            queryFilter = [...queryFilter, queryImpact]
        }
        if(severity !== 'all'){
            let querySecurity = '{ "query_string": { "analyze_wildcard": true, "query": "*' + severity + '*", "fields": ["severity"] } }';
            queryFilter = [...queryFilter, querySecurity]
        }
        if(sourceIP !== ''){
            let querySource = '{ "query_string": { "analyze_wildcard": true, "query": "*' + sourceIP + '*", "fields": ["internal_ip"] } }';
            queryFilter = [...queryFilter, querySource]
        }
        if(destinationIP !== ''){
            let queryDestination = '{ "query_string": { "analyze_wildcard": true, "query": "*' + destinationIP + '*", "fields": ["dest"] } }';
            queryFilter = [...queryFilter, queryDestination]
        }
        this.setState({
            query: queryFilter,
            timeFrom:timeFrom,
            timeTo: timeTo,
        },() => this.getData())
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
                            <input id='timeFrom' type="datetime-local" defaultValue={this.state.timeFrom} onChange={this.filter}/>
                        </div>
                        <div className='col-3'>
                            <label htmlFor="timeTo" >to: </label>
                            <input id='timeTo' type="datetime-local" defaultValue={this.state.timeTo} onChange={this.filter} />
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
