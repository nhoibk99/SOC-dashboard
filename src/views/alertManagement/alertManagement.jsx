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
            pageSize: 5,
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

    onChange = page => {
        this.setState({
            currentPage: page,
        });
        // console.log(this.state.current)

    };
    onSearchChange = (term, hits) =>{
        // console.log("term", term);
        // console.log("hits",  hits);
        term == '' ? 
        this.setState({
            isSearch: false
        }):
        this.setState({
            isSearch: true,
            dataSearch: hits,
        })
    }
    
    render(){
        return(
            <div className="alertManagement" style={{minHeight: '100vh', background: `url(${BgImage}) 100% `}} >
                {/* <div className='search'>
                    <input type="text" placeholder='nhập tìm kiếm' style={{width: '90%'}}/>
                    <button style={{width: '10%'}}>Search</button>
                </div> */}
                <SearchBar 
                    onSearchTextChange={ (term,hits) => {this.onSearchChange(term,hits)}}
                    onSearchButtonClick={this.onSearchClick}
                    placeHolderText={"Search here..."}
                    data={this.state.data}
                />
                <div className='filter'>
                    <label htmlFor="killChain">Kill chain</label>
                    <select defaultValue="all">
                        <option value="all">All</option>
                        <option value="lime">Lime</option>
                        <option value="coconut">Coconut</option>
                        <option value="mango">Mango</option>
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
                    <select defaultValue="grapefruit">
                        <option value="grapefruit">H</option>
                        <option value="lime">Lime</option>
                        <option value="coconut">Coconut</option>
                        <option value="mango">Mango</option>
                    </select><br/>
                    <div className="duration">
                        <label htmlFor="timeFrom">Time from</label>
                        <input type="text"/>
                        <label htmlFor="timeto">to</label>
                        <input type="text"/>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style={{width:'5%'}}>#</th>
                            <th style={{width:'20%'}}>Customer</th>
                            <th style={{width:'30%'}}>Kill_chain</th>
                            {/* <th style={{width:'20%'}}>Severity</th> */}
                            <th style={{width:'auto'}}>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.isSearch?
                            this.state.dataSearch.map((item, index) =>{
                                return <tr key={index}>
                                    <td>{index}</td>
                                    <td>{item.customer}</td>
                                    <td>{item.kill_chain}</td>
                                    {/* <td>{item.severity}</td> */}
                                    <td>{item.message}</td>
                                </tr>
                            })
                            :this.state.data.map((item, index) =>{
                                return <tr key={index}>
                                    <td>{index}</td>
                                    <td>{item.customer}</td>
                                    <td>{item.kill_chain}</td>
                                    {/* <td>{item.severity}</td> */}
                                    <td>{item.message}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <div className='pagination'>
                    {
                        console.log("lenght", this.state.data.length)
                    }
                    <Pagination
                        total={ this.state.data.length}
                        showTotal={total => `Total ${total} items`}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        pageSizeOptions={["5", "10", "20"]} 
                        defaultPageSize={this.state.pageSize}
                        current={this.state.currentPage}
                        onChange={this.onChange}
                    />
                </div>
                {/* {console.log(this.state.currentPage)} */}
            </div>
        )
    }
}


export default AlertManagement;
