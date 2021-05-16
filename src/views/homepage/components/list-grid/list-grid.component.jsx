import React from 'react';
// import GridLayout from 'react-grid-layout';
import { Link } from "react-router-dom";
import {Col, Row} from 'antd';
import './list-grid.styles.scss';

let url = 'http://elastic.vninfosec.net/threat-hunting-statistics/_search?pretty=true&q=%2Bcustomer%3A%28%22khach+hang+a%22%29%2Bdisplay_classification%3A%28%22impact+level%22%29%2Btime%3A%28%22last+day%22%29';
// let base64= require('base-64');
// let username='admin';
// let password='!@#VNinfosec@123';
// let headers_get = new Headers({
//   'Authorization': 'Basic '+ base64.encode(username+":"+password), 
//   'Content-Type': 'application/x-www-form-urlencoded'
// });
//headers_get.set('Authorization','Basic ' + base64.encode(username+":"+password));

class Grid extends React.Component {
  constructor(){
    super();
    this.state = {
      threat_vulnerability_data:[0,0,0,0,0,0],
      attack_data:[0,0,0,0,0,0],
      incident_data:[0,0,0,0,0,0]
    }
  }

  componentDidMount() {
  
    this.tick();
    this.interval = setInterval(this.tick, 2000);
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
        jsonData.hits.hits.slice(0, 1).map(item =>
          {
            that.setState({ 
              threat_vulnerability_data:
              [
              item._source.threat_vulnerability.details.website_vulnerability,
              item._source.threat_vulnerability.details.cve,
              item._source.threat_vulnerability.details.sensitive_data_exposure,
              item._source.threat_vulnerability.details.security_misconfiguration,
              item._source.threat_vulnerability.details.abnormal_connection,
              item._source.threat_vulnerability.details.baseline_ioc
              ],
              attack_data:
              [
              item._source.attack.details.dos_attack,
              item._source.attack.details.web_attack,
              item._source.attack.details.bruteforce_attack,
              item._source.attack.details.application_attack,
              item._source.attack.details.phishing_attack,
              item._source.attack.details.malware_attack
              ],
              incident_data:
              [
              item._source.incident.details.leaked_data,
              item._source.incident.details.attacked_website,
              item._source.incident.details.malware_infected_host,
              item._source.incident.details.compromised_server,
              item._source.incident.details.inaccessible_service,
              item._source.incident.details.webshell
              ]
             
             }); 
             return 0;
          }
        );
         
      }).catch(function(error) {
        that.setState({ apiInfo:error });
        console.log(error);
    });
}
  render() {
    return (
      <div className="box-grid-layout-list">
      <Row gutter={[15, 15]} className="grid-layout-list">
        <Col span={8}>
          <Row className="box-noti-list gx-5">
            <Col span={12} className="pd-10">
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Website vulnerability'])} target="_blank">
                  <span className="name">Website vulnerability</span>
                </Link>
                <span className="value">{this.state.threat_vulnerability_data[0]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Sensitive data exposure'])} target="_blank">
                <span className="name">Sensitive data exposure</span>
                </Link>
                <span className="value">{this.state.threat_vulnerability_data[2]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Abnormal connection'])} target="_blank">
                  <span className="name">Abnormal connection</span>
                </Link>
                <span className="value">{this.state.threat_vulnerability_data[4]}</span>
              </div>
            </Col>
            <Col span={12} className="pd-10">
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'CVE'])} target="_blank">
                <span className="name">CVE</span>
                </Link>
                <span className="value">{this.state.threat_vulnerability_data[1]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Security misconfiguration'])} target="_blank">
                  <span className="name">Security misconfiguration</span>
                </Link>
                <span className="value">{this.state.threat_vulnerability_data[3]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Baseline IOC'])} target="_blank">
                  <span className="name">Baseline IOC</span>
                </Link>
                <span className="value">{this.state.threat_vulnerability_data[5]}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row className="box-noti-list gx-5">
            <Col span={12} className="pd-10">
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'DOS attack'])} target="_blank">
                  <span className="name">DOS attack</span>
                </Link>
                <span className="value">{this.state.attack_data[0]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Bruteforce attack'])} target="_blank">
                  <span className="name">Bruteforce attack</span>
                </Link>
                <span className="value">{this.state.attack_data[2]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Phishing attack'])} target="_blank">
                  <span className="name">Phishing attack</span>
                </Link>
                <span className="value">{this.state.attack_data[4]}</span>
              </div>
            </Col>
            <Col span={12} className="pd-10">
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Web attack'])} target="_blank">
                  <span className="name">Web attack</span>
                </Link>
                <span className="value">{this.state.attack_data[1]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Application attack'])} target="_blank">
                  <span className="name">Application attack</span>
                </Link>
                <span className="value">{this.state.attack_data[3]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Malware attack'])} target="_blank">
                  <span className="name">Malware attack</span>
                </Link>
                <span className="value">{this.state.attack_data[5]}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row className="box-noti-list gx-5">
            <Col span={12} className="pd-10">
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Leaked data'])} target="_blank">
                  <span className="name">Leaked data</span>
                </Link>
                <span className="value">{this.state.incident_data[0]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Malware-infected host'])} target="_blank">
                  <span className="name">Malware-infected host</span>
                </Link>
                <span className="value">{this.state.incident_data[2]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Inaccessible Service'])} target="_blank">
                  <span className="name">Inaccessible Service</span>
                </Link>
                <span className="value">{this.state.incident_data[4]}</span>
              </div>
            </Col>
            <Col span={12} className="pd-10">
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Attacked website'])} target="_blank">
                  <span className="name">Attacked website</span>
                </Link>
                <span className="value">{this.state.incident_data[1]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Compromised server'])} target="_blank">
                  <span className="name">Compromised server</span>
                </Link>
                <span className="value">{this.state.incident_data[3]}</span>
              </div>
              <div className="grid-item">
                <Link to={{pathname: "/alert"}} onClick={() => localStorage.setItem('dataFromHome',['', '', 'Webshell'])} target="_blank">
                  <span className="name">Webshell</span>
                </Link>
                <span className="value">{this.state.incident_data[5]}</span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      </div>
    );
  }
}

export default Grid;
