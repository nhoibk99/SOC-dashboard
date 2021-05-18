import React from "react";
import DotRadar from './dot-radar.component';
import './radar.syles.scss';

//tọa độ tâm radar (-0.02, 0.02)
//khoảng cách từ 2 biên của lớp network đến tâm: (lề ngoài: 0,95, lề trong: 0,75)
//khoảng cách từ 2 biên lớp host đến tâm: (lề ngoài: 0,70, lề trong: 0,5)
//khoảng cách từ 2 biên lớp application đến tâm: (lề ngoài: 0,45, lề trong: 0,25)
//khoảng cách từ 2 biên lớp host đến tâm: (lề ngoài: 0,20, lề trong: 0)
//công thức tính kc 2 điểm A(x1,y1) và B(x2,y2): sqrt( (x1-x2)^2 + (y1-y2)^2 )

var md5 = require('md5');
let critical_color =  '#e00909';
let high_color =  '#e07109';
let medium_color =  '#ebdea5';
let low_color='#4de009';
let R=0.97;
let centerX = -0.02;
let centerY = 0.02;
let url='http://elastic.vninfosec.net/threat-hunting-statistics/_search?pretty=true&q=%2Bcustomer%3A%28%22khach+hang+a%22%29%2Bdisplay_classification%3A%28%22four+layers%22%29%2Btime%3A%28%22last+day%22%29&filter_path=hits.hits._source.**.details.**.information';


//sinh tọa độ ngẫu nhiên
function genCoordinates(information, layer, level, point_color)
  {
    //var d = new Date();
  //  var n = d.getTime();
    let arr_event = information.trim().split('\n');
    let theta=0;
    let r=0;
    let x_cor=0;
    let y_cor=0;
    let bcheck=false;
    let d_layer=0;
    let point_id=0;
    let point_label='';
    let records=[];
    for(let i=0; i<arr_event.length; i++)
    {
     if(arr_event[i].trim()!=='')
     {
        bcheck=false;
        while(bcheck===false)
        {
          theta = Math.random() * 2 * Math.PI;
          r = R * Math.sqrt(Math.random());
          x_cor = centerX + r * Math.cos(theta);
          y_cor = centerY + r * Math.sin(theta);
          d_layer = Math.sqrt(Math.pow(x_cor-centerX,2) + Math.pow(y_cor-centerY,2));
          if (layer==='network' &&  d_layer<0.97 && d_layer>0.77) {
            bcheck=true;
          } 
          else if(layer==='host' &&  d_layer<0.72 && d_layer>0.52) {
            bcheck=true;
                }
                else if(layer==='application' &&  d_layer<0.47 && d_layer>0.27){
                  bcheck=true;
                }
                    else if(layer==='data' &&  d_layer<0.22 ){
                      bcheck=true;
                    }

        }
        point_label=layer+'.'+level+'  '+ arr_event[i];
        point_id = md5(point_label);
        records.push({id: point_id, x: x_cor, y: y_cor, label:  point_label, color: point_color});
      }
     
    }
    return records ;
   // return {id: point_id, x: x_cor, y: y_cor, label:  point_label, color: point_color};
  }

class Radar extends React.Component {
  constructor(){
    super();
    this.state = {
      radar_data : [],
      info:''
    }
  }
  
  componentDidMount(){
    
    this.tick();
    this.interval = setInterval(this.tick, 3000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  

  tick = () => {
    const that = this;
    let radar_data_temp = [];
    let radar_data_temp1= this.state.radar_data;
    let radar_data_new=[];

    fetch(url)
      .then(function(response) {
          return response.json();
      })
      .then(function(jsonData) {
        jsonData.hits.hits.slice(0, 1).map(item =>
          {
            //network.details.critical
            if(item._source.network.details.critical.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.network.details.critical.information,'network', 'critical', critical_color ));
           
            //network.details.high
            if(item._source.network.details.high.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.network.details.high.information, 'network','high', high_color ));
           
            //network.details.medium
            if(item._source.network.details.medium.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.network.details.medium.information, 'network','medium', medium_color ));
            
            //network.details.low
            if(item._source.network.details.low.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.network.details.low.information, 'network','low', low_color ));
            
              //host.details.critical
            if(item._source.host.details.critical.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.host.details.critical.information, 'host','critical', critical_color ));
            
            //host.details.high
            if(item._source.host.details.high.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.host.details.high.information, 'host','high', high_color ));
            
            //host.details.medium
            if(item._source.host.details.medium.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.host.details.medium.information, 'host','medium', medium_color ));
            
            //host.details.low
            if(item._source.host.details.low.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.host.details.low.information, 'host','low', low_color ));

            //application.details.critical
            if(item._source.application.details.critical.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.application.details.critical.information, 'application','critical', critical_color ));
            
            //application.details.high
            if(item._source.application.details.high.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp,  genCoordinates(item._source.application.details.high.information, 'application','high', high_color ));
              
            //application.details.medium
            if(item._source.application.details.medium.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp,  genCoordinates(item._source.application.details.medium.information, 'application','medium', medium_color ));
            
            //application.details.low
            if(item._source.application.details.low.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp,  genCoordinates(item._source.application.details.low.information, 'application','low', low_color ));

              //data.details.critical
            if(item._source.data.details.critical.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.data.details.critical.information, 'data','critical', critical_color ));
            
            //data.details.high
            if(item._source.data.details.high.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.data.details.high.information, 'data','high', high_color ));
            
            //data.details.medium
            if(item._source.data.details.medium.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp, genCoordinates(item._source.data.details.medium.information, 'data','medium', medium_color ));
            
            //data.details.low
            if(item._source.data.details.low.information.trim()!=='')
              radar_data_temp.push.apply(radar_data_temp,  genCoordinates(item._source.data.details.low.information, 'data','low', low_color ));
            return 0;
          }
        );

        //giữ lại các điểm đã có, thêm các điểm mới vào
        
        
        let item_choice={};
        radar_data_temp.map(itemx =>
          {
            let bcheck=false;
            
            radar_data_temp1.map(itemy =>
              {
                if(itemx.id===itemy.id)
                {
                  item_choice=itemy;
                  bcheck=true;
                }
                return 0;
              }
            );
            if(bcheck===true)
              radar_data_new.push(item_choice);
            else 
              radar_data_new.push(itemx);
            return bcheck;
          }
        );
       
        //radar_data_temp.length=0;
       
     
        that.setState({
          radar_data : radar_data_new,
        });

      })
      .catch(function(error) { that.setState({info:error});
      });
  }

  render(){
  
    return (
      <div className="radar">
        <div
          className="radar-circle"
          style={{width: '460px', height: '460px'}}
        >
          <div className="cir circle1">
            <div className="circle-text">Network</div>
          </div>
          <div className="cir circle2">
            <div className="circle-text">Host</div>
          </div>
          <div className="cir circle3">
            <div className="circle-text">Application</div>
          </div>
          <div className="cir circle4">
            <div className="circle-text center"></div>
          </div>
          <div className="radar"></div>
          <div className="line-x"></div>
          <div className="line-y"></div>
          <div className="dots">
            {this.state.radar_data.map((item) => (
              <DotRadar key={item.id} dotData={item} r={460 / 2} />
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default Radar;