import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import './chart.styles.scss';

let url = 'http://elastic.vninfosec.net/threat-hunting-statistics/_search?pretty=true&q=%2Bcustomer%3A%28%22khach+hang+a%22%29%2Bdisplay_classification%3A%28%22mitre+att%26ck%22%29%2Btime%3A%28%22last+day%22%29';
let base64= require('base-64');
let username='admin';
let password='!@#VNinfosec@123';
let headers_get = new Headers({
  'Authorization': 'Basic '+ base64.encode(username+":"+password), 
  'Content-Type': 'application/x-www-form-urlencoded'
});

class Chart extends React.Component {
  constructor(){
    super();
    this.state = {
     chartdata: [
      { name: 'Initial-access', count: 10, color: '#ffbe00'},
      { name: 'Execution', count: 10, color: '#0099ff' },
      { name: 'Persistence', count:10,color: '#b960a7'},
      { name: 'Privilege-escalation', count: 10, color: '#004d7c' },
      { name: 'Defense-evasion', count: 10, color: '#a7eec9'  },
      { name: 'Credential-access',count: 10, color: '#007bff'},
      {name: 'Discovery', count: 10,color: '#c90866' },
      { name: 'Lateral-movement', count:10, color: '#07b8b4'},
      { name: 'Collection',count: 10,color: '#041dd9' },
      { name: 'Exfiltration',count: 10,color: '#89f022'},
      { name: 'Command&control', count: 10, color: '#e3295a'},
      {name: 'Impact', count: 10,color: '#09eb67' }
      ]
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
        jsonData.hits.hits.map(item =>
          {
            const data =  [
              { name: 'Initial-access', count: item._source.initial_access, color: '#ffbe00'},
              { name: 'Execution', count: item._source.execution, color: '#0099ff' },
              { name: 'Persistence', count: item._source.persistence,color: '#b960a7'},
              { name: 'Privilege-escalation', count: item._source.privilege_escalation, color: '#004d7c' },
              { name: 'Defense-evasion', count: item._source.defense_evasion, color: '#a7eec9'  },
              { name: 'Credential-access',count: item._source.credential_access, color: '#007bff'},
              {name: 'Discovery', count: item._source.discovery,color: '#c90866' },
              { name: 'Lateral-movement', count: item._source.lateral_movement, color: '#07b8b4'},
              { name: 'Collection',count: item._source.collection,color: '#041dd9' },
              { name: 'Exfiltration',count: item._source.command_and_control,color: '#89f022'},
              { name: 'Command&control', count: item._source.exfiltration, color: '#e3295a'},
              {name: 'Impact', count: item._source.impact,color: '#09eb67' }
              ];
            that.setState({ 
              chartdata :data
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
    <div className="chart">
      <div className="title-chart">MITRE ATT&CK</div>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart width={400} height={420} layout="vertical" data={this.state.chartdata} margin={{ top: 0, right: 0, bottom: 0, left: 82 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category"  fontWeight='bold' axisLine={false} dx={-5} tickLine={false} />
          <Tooltip />
          <Bar dataKey="count" minPointSize={2} barSize={15}>
            {this.state.chartdata.map((d, idx) => {
              return <Cell key={d.name} fill={d.color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
}

export default Chart;
