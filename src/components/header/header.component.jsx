import React from 'react';
import Clock from 'react-live-clock';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import logoImage from '../../assets/images/logo.png';
import './header.styles.scss';
let url = 'http://elastic.vninfosec.net/threat-hunting-statistics/_search?pretty=true&q=%2Bcustomer%3A%28%22khach+hang+a%22%29%2Bdisplay_classification%3A%28%22cybersecurity+news%22%29';
class Header extends React.Component{
  constructor(){
    super();
    this.state = {
      dropdownOpen: false,  
      data: [],
    }
  }  
  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick, 5000);
  }
   
  componentWillUnmount() {
   clearInterval(this.interval);
  }

  tick = () => {
    const that = this;
    fetch(url)
      .then(function(response) {
          return response.json();
      })
      .then(function(jsonData) {
        const dataFetch = jsonData.hits.hits;
        that.setState({ 
          data :dataFetch,
        }); 
      })
      .catch(function(error) {
        that.setState({ apiInfo:error });
        console.log(error);
      });
  }
  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }
  render(){
    return (
      <div className="header">
        <div className="row row-align-center">
          <div className="col-sm-1">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle caret>Menu</DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Header</DropdownItem>
                <DropdownItem>Some Action</DropdownItem>
                <DropdownItem text>Dropdown Item Text</DropdownItem>
                <DropdownItem disabled>Action (disabled)</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Foo Action</DropdownItem>
                <DropdownItem>Bar Action</DropdownItem>
                <DropdownItem>Quo Action</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="col-sm-9" style={{overflow:'hidden'}}>
            <div className="marquee">
              {this.state.data.map((item, index) =>{
                return <div className="noti" key={index}><a href={item._source.url}>{item._source.title}</a></div>  
              })
              }
            </div>
          </div>
          <div className="col-sm-2">
            <div className="container-logo">
             <label className="label-timer"><Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Bangkok'} /></label>
              <img className="logo" src={logoImage} alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Header;
