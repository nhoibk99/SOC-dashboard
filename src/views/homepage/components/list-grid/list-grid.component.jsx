import React from 'react';
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
        jsonData.hits.hits.map(item =>
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
                <span className="name">Website vulnerability</span>
                <span className="value">{this.state.threat_vulnerability_data[0]}</span>
              </div>
              <div className="grid-item">
              <span className="name">Sensitive data exposure</span>
                <span className="value">{this.state.threat_vulnerability_data[2]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Abnormal connection</span>
                <span className="value">{this.state.threat_vulnerability_data[4]}</span>
              </div>
            </Col>
            <Col span={12} className="pd-10">
              <div className="grid-item">
              <span className="name">CVE</span>
                <span className="value">{this.state.threat_vulnerability_data[1]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Security misconfiguration</span>
                <span className="value">{this.state.threat_vulnerability_data[3]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Baseline IOC</span>
                <span className="value">{this.state.threat_vulnerability_data[5]}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row className="box-noti-list gx-5">
            <Col span={12} className="pd-10">
              <div className="grid-item">
                <span className="name">DOS attack</span>
                <span className="value">{this.state.attack_data[0]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Bruteforce attack</span>
                <span className="value">{this.state.attack_data[2]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Phishing attack</span>
                <span className="value">{this.state.attack_data[4]}</span>
              </div>
            </Col>
            <Col span={12} className="pd-10">
              <div className="grid-item">
                <span className="name">Web attack</span>
                <span className="value">{this.state.attack_data[1]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Application attack</span>
                <span className="value">{this.state.attack_data[3]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Malware attack</span>
                <span className="value">{this.state.attack_data[5]}</span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row className="box-noti-list gx-5">
            <Col span={12} className="pd-10">
              <div className="grid-item">
                <span className="name">Leaked data</span>
                <span className="value">{this.state.incident_data[0]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Malware-infected host</span>
                <span className="value">{this.state.incident_data[2]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Inaccessible Service</span>
                <span className="value">{this.state.incident_data[4]}</span>
              </div>
            </Col>
            <Col span={12} className="pd-10">
              <div className="grid-item">
                <span className="name">Attacked website</span>
                <span className="value">{this.state.incident_data[1]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Compromised server</span>
                <span className="value">{this.state.incident_data[3]}</span>
              </div>
              <div className="grid-item">
                <span className="name">Webshell</span>
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
