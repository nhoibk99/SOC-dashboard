import React from 'react';

import './alertmanagement.styles.scss';
import BgImage from '../../assets/images/bg.png';
import SearchBar from 'react-js-search';
import { Pagination } from 'antd';

let api = 'http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty&size=300';

class AlertManagement extends React.Component{
    constructor(){
        super();
        this.state = {
            data: [],
            dataSearch: [],
            isSearch: false,
            currentPage: 1,
            pageSize: 23,
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
        fetch(api)
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
    
    render(){
        const {data, dataSearch, currentPage, pageSize} = this.state;
        const indexOfLast = currentPage * pageSize;
        const indexOfFist = indexOfLast - pageSize;
        console.log('log',indexOfFist, indexOfLast);
        let list = [];
        let totalRow = 0;
        this.state.isSearch ? list = dataSearch.slice(indexOfFist, indexOfLast) : list = data.slice(indexOfFist, indexOfLast);
        this.state.isSearch ? totalRow = dataSearch.length : totalRow = data.length;
        console.log('log2', list);

        return(
            <div className="alertManagement" style={{minHeight: '100vh', maxHeight: 'fix-content', background: `url(${BgImage}) 100% `}} >
                <SearchBar 
                    onSearchTextChange={ (term,hits) => {this.onSearchChange(term,hits)}}
                    onSearchButtonClick={this.onSearchClick}
                    placeHolderText={"Search here..."}
                    data={this.state.data}
                    style={{with:'60%'}}
                />
                <div className='filter'>
                    <label htmlFor="killChain">Kill chain</label>
                    <select defaultValue="all">
                        <option value="all">All</option>
                        <option value="Exploitation">Exploitation</option>
                        <option value="LateralMovement">LateralMovement</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Reconnaissance">Reconnaissance</option>
                        <option value="Exfiltration">Exfiltration</option>
                        <option value="Weaponization">Weaponization</option>
                        <option value="Installation">Installation</option>
                        <option value="Command and Control">Command and Control</option>
                    </select>
                    <label htmlFor="killChain">Layer</label>
                    <select defaultValue="grapefruit">
                        <option value="grapefruit">NetWork</option>
                        <option value="lime">Application</option>
                        <option value="coconut">Coconut</option>
                        <option value="mango">Mango</option>
                    </select>
                    <label htmlFor="killChain">Impact level</label>
                    <select  defaultValue="grapefruit">
                        <option value="grapefruit">Attack web</option>
                        <option value="lime">Lime</option>
                        <option value="coconut">Coconut</option>
                        <option value="mango">Mango</option>
                    </select>
                    <label htmlFor="killChain">Severity</label> 
                    <select defaultValue="H">
                        <option value="H">H</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                    </select><br/>
                    <div className="duration">
                        <label htmlFor="src">Source</label>
                        <input type="text"/>
                        <label htmlFor="des">Destination</label>
                        <input type="text"/>
                        <label htmlFor="timeFrom">Time from</label>
                        <input type="text"/>
                        <label htmlFor="timeTo">to</label>
                        <input type="text"/>
                    </div>
                </div>
                <table>
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
                </table>
                <div className='pagination'>
                    <Pagination 
                        total={totalRow}
                        showTotal={total => `Total ${total} items`}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        pageSizeOptions={["10", "20", "50", "100"]} 
                        defaultPageSize={this.state.pageSize}
                        current={this.state.currentPage}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        )
    }
}


export default AlertManagement;
