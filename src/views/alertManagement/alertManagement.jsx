import React from 'react';
import Chart from './components/chart/chart.component';
import './alertmanagement.styles.scss';
import SearchBar from 'react-js-search';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import moment from 'moment';
import { CSVLink } from 'react-csv'
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TabStopPosition,
    TabStopType,
    TextRun
  } from "docx";
  const PHONE_NUMBER = "07534563401";
  const PROFILE_URL = "https://www.linkedin.com/in/dolan1";
  const EMAIL = "docx@docx.com";
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
            allRow: 0,
        }
    }  
    componentDidMount() {
        console.log("reload");
        const dataFromHome = localStorage.getItem('dataFromHome')?.split(',')|| null;
        console.log(dataFromHome);
        dataFromHome && this.setData(dataFromHome);
        if(this.state.autoRefresh) {
            this.interval = setInterval(this.tick, 10000);
        }
        const that = this
        fetch(that.state.api)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonData) {
                const all = jsonData.hits.total.value;
                that.setState({ 
                   allRow: all,
                }); 
                
            })
            .catch(function(error) {
                console.log(error);
            });

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

    setData = (dataFromHome) => {
        if(dataFromHome[0]){
            document.getElementById('layer').value = dataFromHome[0];
        }
        if(dataFromHome[1]){
            document.getElementById('severity').value = dataFromHome[1];
        }
        if(dataFromHome[2]){
            document.getElementById('impact').value = dataFromHome[2];
        }
        localStorage.clear();
    }

    getData = () => {
        
        
        // console.log("data from home", this.props);
        const that = this;
        let { apiStart, apiEnd, query, isSearch, searchText, currentPage, sizeOfPage, timeFrom, timeTo} = this.state;
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
                const total = jsonData.hits.total.value;
                that.setState({ 
                   totalPage: parseInt(total / that.state.sizeOfPage +1),
                   totalRow: total,
                }); 
                const dataFetch = jsonData.hits.hits;
                let fetch = [];
                dataFetch.map((item,index) => {
                    return fetch = [...fetch, {
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
        const queryStart = '{ "query_string": { "analyze_wildcard": true, "query": "*';
        if(killChain !== 'all'){
            let queryKillChain = queryStart + killChain + '*", "fields": ["kill_chain"] } }';
            queryFilter = [...queryFilter, queryKillChain]
        }
        if(layer !== 'all'){
            let queryLayer = queryStart + layer + '*", "fields": ["layer"] } }';
            queryFilter = [...queryFilter, queryLayer]
        }
        if(impact !== 'all'){
            let queryImpact = queryStart + impact + '*", "fields": ["sub_impact_level"] } }';
            queryFilter = [...queryFilter, queryImpact]
        }
        if(severity !== 'all'){
            let querySecurity = queryStart + severity + '*", "fields": ["severity"] } }';
            queryFilter = [...queryFilter, querySecurity]
        }
        if(sourceIP !== ''){
            let querySource = queryStart + sourceIP + '*", "fields": ["internal_ip"] } }';
            queryFilter = [...queryFilter, querySource]
        }
        if(destinationIP !== ''){
            let queryDestination = queryStart + destinationIP + '*", "fields": ["dest"] } }';
            queryFilter = [...queryFilter, queryDestination]
        }
        this.setState({
            // currentPage: 0,
            query: queryFilter,
            timeFrom: timeFrom,
            timeTo: timeTo,
        },() => this.getData())
    };

    exportPDF = () => {
        const that = this;
        let api= 'http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty&from=0&size=' + that.state.allRow;
        fetch(api)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonData) {
                const dataFetch = jsonData.hits.hits;
                let fetch = [];
                console.log(dataFetch);
                dataFetch.map((item,index) => {
                    return fetch = [...fetch, {
                            ...item._source,
                            stt: index + 1 ,
                            time: moment(item._source["@timestamp"]).format("DD/MM/YYYY hh:mm:ss")
                        }
                    ]
                });
                that.setState({ 
                    allData : fetch,
                },() => {
                    const unit = "px";
                    const size = "A4"; // Use A1, A2, A3 or A4
                    const orientation = "landscape"; // portrait or landscape
                    const doc = new jsPDF(orientation, unit, size);
                    doc.setFontSize(15);
                    // const title = "My Awesome Report";
                    // doc.text(title, marginLeft, 40);
                    doc.autoTable({
                        theme: 'grid',
                        body: that.state.allData,
                        margin: {top: 10, right: 10, bottom: 10, left: 10},
                        columns: [
                            {
                                header: "STT",
                                dataKey: "stt",
                            },
                            {
                                header: "Time",
                                dataKey: "time",
                            },
                            {
                                header: "Severity",
                                dataKey: "severity",
                            },
                            {
                                header: "Message",
                                dataKey: "message",
                            },
                            {
                                header: "Soucre",
                                dataKey: "source",
                            },
                            {
                                header: "Destination",
                                dataKey: "dest",
                                width: 150,
                            },
                            {
                                header: "Layer",
                                dataKey: "layer",
                            },
                            {
                                header: "Kill chain",
                                dataKey: "kill_chain",
                            },
                            {
                                header: "Impact level",
                                dataKey: "sub_impact_level",
                            }
                        ],
                        rowPageBreak: 'avoid',
                    });
                    doc.save("data.pdf")
                }); 
                
            })
            .catch(e => {
                console.log(e);
                return e;
              });
        
    }

    generate = ()=> {
        const document = new Document({
            sections: [
              {
                children: [
                  new Paragraph({
                    text: "Test export file .docx",
                    heading: HeadingLevel.TITLE
                  }),
                  new Paragraph(
                    "Dr. Dean Mohamedally Director of Postgraduate Studies Department of Computer Science, University College London Malet Place, Bloomsbury, London WC1E d.mohamedally@ucl.ac.uk"
                  ),
                  new Paragraph("More references upon request"),
                  new Paragraph({
                    text:
                      "This CV was generated in real-time based on my Linked-In profile from my personal website www.dolan.bio.",
                    alignment: AlignmentType.CENTER
                  })
                ]
              }
            ]
          });
    
        Packer.toBlob(document).then(blob => {
          console.log(blob);
          saveAs(blob, "example.docx");
          console.log("Document created successfully");
        });
      }

    render(){
        return(
            <div className="alertManagement">
                <Chart />
                <div className='table'>
                    <div className='filter'>    
                        <div className='row'>
                            <div className='col-7'>
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
                            <div className='col-2'>
                                <button onClick={this.generate}>Generate CV with docx!</button>
                                <button id='exportPDF' onClick={() => this.exportPDF()}>Generate Report</button>
                                <button ><CSVLink id='exportCSV' data={this.state.data?this.state.data:[]} filename={'reportData.csv'}>Export CSV</CSVLink></button>
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
                                    <option value="Unknown">Unknown</option>
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
                                Cell: row => (
                                    <div
                                        style={{
                                        width: `${row.value}%`,
                                        height: '100%',
                                        color: 'black',
                                        backgroundColor:
                                            row.value === 'C' ? '#e00909'
                                            : row.value === 'H' ? '#e07109'
                                            : row.value === 'M' ? '#ebdea5'
                                            : '#4de009',
                                        borderRadius: '2px',
                                        transition: 'all .2s ease-out'
                                        }}
                                    >
                                        {row.value}
                                    </div>
                                )
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
                            height: "50vh" // This will force the table body to overflow and scroll, since there is not enough room
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
                 
            </div>
        )
    }
}


export default AlertManagement;
