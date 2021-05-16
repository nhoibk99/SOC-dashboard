import React from 'react';
import GridLayout from 'react-grid-layout';
import { Row, Col } from 'antd';
import './gird.styles.scss';
import { Link } from "react-router-dom";


let url = 'http://elastic.vninfosec.net/threat-hunting-statistics/_search?pretty=true&q=%2Bcustomer%3A%28%22khach+hang+a%22%29%2Bdisplay_classification%3A%28%22four+layers%22%29%2Btime%3A%28%22last+day%22%29&filter_path=-hits.hits._source.**.details.**.information';
// let base64= require('base-64');
// let username='admin';
// let password='!@#VNinfosec@123';
// let headers_get = new Headers({
//   'Authorization': 'Basic '+ base64.encode(username+":"+password), 
//   'Content-Type': 'application/x-www-form-urlencoded'
// });

class Grid extends React.Component {
  constructor(){
    super();
    this.state = {
      networklayer_data:[0,0,0,0,0],
      hostlayer_data:[0,0,0,0,0],
      applicationlayer_data:[0,0,0,0,0],
      datalayer_data:[0,0,0,0,0]
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
              networklayer_data:
              [
              item._source.network.details.critical.count,
              item._source.network.details.high.count,
              item._source.network.details.medium.count,
              item._source.network.details.low.count,
              item._source.network.count
              ],
              hostlayer_data:
              [
              item._source.host.details.critical.count,
              item._source.host.details.high.count,
              item._source.host.details.medium.count,
              item._source.host.details.low.count,
              item._source.host.count
              ],
              applicationlayer_data:
              [
              item._source.application.details.critical.count,
              item._source.application.details.high.count,
              item._source.application.details.medium.count,
              item._source.application.details.low.count,
              item._source.application.count
              ],
              datalayer_data:
              [
                item._source.data.details.critical.count,
                item._source.data.details.high.count,
                item._source.data.details.medium.count,
                item._source.data.details.low.count,
                item._source.data.count
              ]
            });
            return item;
          }
        );
         
      }).catch(function(error) {
        that.setState({ apiInfo:error });
        console.log(error);
    });
}
  render() {
    // layout is an array of objects, see the demo for more complete usage
    // static
    const layout = [
      {
        id: '0',x: 0,y: 0,w: 6,h: 2.2
      },
      {
        id: '1',x: 0,y: 0,w: 6,h: 2.2
      },
      {
        id: '2',x: 0,y: 0,w: 6,h: 2.2
      },
      {
        id: '3',x: 0,y: 0,w: 6,h: 2.2
      }
    ];
    
    return (
      <GridLayout
        className="grid-layout"
        layout={layout}
        cols={12}
        rowHeight={29}
        width={1000}
        autoSize={true}
        margin={[10, 21]}
      // containerPadding={[30, 30]}
      >
        
          <div className="grid-item" key='0' data-grid={layout[0]} >
            <div className="grid-item-name">Network layer :   
            <Link
              to={{pathname: "/alert"}}
              onClick={() => localStorage.setItem('layer','Network'+ this.state.networklayer_data[4])}
              target="_blank"
            >
            <label className="label_layer">{this.state.networklayer_data[4]}</label>
            </Link>
            </div>
            <div className="grid-item-data">
              <Row className="row-grid">
                <Col span={6}>
                  <div className="item-data"><span className="item-critical-label">Critical</span>: <span className="item-value">{this.state.networklayer_data[0]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-high-label">High</span>: <span className="item-value">{this.state.networklayer_data[1]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-medium-label">Medium</span>: <span className="item-value">{this.state.networklayer_data[2]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-low-label">Low</span>: <span className="item-value">{this.state.networklayer_data[3]}</span></div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="grid-item" key='1'data-grid={layout[1]} >
            <div className="grid-item-name">Host layer  :  <label className="label_layer">{this.state.hostlayer_data[4]}</label></div>
            <div className="grid-item-data">
              <Row className="row-grid">
                <Col span={6}>
                  <div className="item-data"><span className="item-critical-label">Critical</span>: <span className="item-value">{this.state.hostlayer_data[0]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-high-label">High</span>: <span className="item-value">{this.state.hostlayer_data[1]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-medium-label">Medium</span>: <span className="item-value">{this.state.hostlayer_data[2]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-low-label">Low</span>: <span className="item-value">{this.state.hostlayer_data[3]}</span></div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="grid-item" key='2' data-grid={layout[2]} >
            <div className="grid-item-name">Application layer  :  <label className="label_layer">{this.state.applicationlayer_data[4]}</label></div>
            <div className="grid-item-data">
              <Row className="row-grid">
                <Col span={6}>
                  <div className="item-data"><span className="item-critical-label">Critical</span>: <span className="item-value">{this.state.applicationlayer_data[0]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-high-label">High</span>: <span className="item-value">{this.state.applicationlayer_data[1]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-medium-label">Medium</span>: <span className="item-value">{this.state.applicationlayer_data[2]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-low-label">Low</span>: <span className="item-value">{this.state.applicationlayer_data[3]}</span></div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="grid-item" key='3'data-grid={layout[3]} >
            <div className="grid-item-name">Data layer  :  <label className="label_layer">{this.state.datalayer_data[4]}</label></div>
            <div className="grid-item-data">
              <Row className="row-grid">
                <Col span={6}>
                  <div className="item-data"><span className="item-critical-label">Critical</span>: <span className="item-value">{this.state.datalayer_data[0]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-high-label">High</span>: <span className="item-value">{this.state.datalayer_data[1]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-medium-label">Medium</span>: <span className="item-value">{this.state.datalayer_data[2]}</span></div>
                </Col>
                <Col span={6}>
                  <div className="item-data"><span className="item-low-label">Low</span>: <span className="item-value">{this.state.datalayer_data[3]}</span></div>
                </Col>
              </Row>
            </div>
          </div>
      </GridLayout>
    );
  }
}

export default Grid;
