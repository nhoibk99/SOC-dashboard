import React, { useState, useEffect } from "react";

import DotRadar from './dot-radar.component';
import useClientRect from '../../../../hooks/useClientRect.hook';
import './radar.syles.scss';

//tọa độ tâm radar (-0.02, 0.02)
//khoảng cách từ 2 biên của lớp network đến tâm: (lề ngoài: 0.97, lề trong: 0.77)
//khoảng cách từ 2 biên lớp host đến tâm: (lề ngoài: 0.72, lề trong: 0.52)
//khoảng cách từ 2 biên lớp application đến tâm: (lề ngoài: 0.47, lề trong: 0.27)
//khoảng cách từ 2 biên lớp host đến tâm: (lề ngoài: 0.22, lề trong: 0)
//công thức tính kc 2 điểm A(x1,y1) và B(x2,y2): sqrt( (x1-x2)^2 + (y1-y2)^2 )
var md5 = require('md5');
var radar_data_temp=[];
let critical_color =  '#e00909';
let high_color =  '#e07109';
let medium_color =  '#ebdea5';
let low_color='#4de009';
let R=0.97;
let centerX = -0.02;
let centerY = 0.02;
let url='http://elastic.vninfosec.net/threat-hunting-statistics/_search?pretty=true&q=%2Bcustomer%3A%28%22khach+hang+a%22%29%2Bdisplay_classification%3A%28%22four+layers%22%29%2Btime%3A%28%22last+day%22%29&filter_path=hits.hits._source.**.details.**.information';
const Radar = () => {
  const init_radardata =[ ];
 
  const [rect, parentRadarRef] = useClientRect();
  const [radar_data, setRadarData] = useState(init_radardata);
  const [count, setCountId] = useState(0);
  const [error_info, setError] = useState('');
  function getCoordinates(information, layer, level, point_color) {
    if (information.trim()=='') return;
    var d = new Date();
    var n = d.getTime();
    let arr_event = information.trim().split('\n');
    let theta=0;
    let r=0;
    let x_cor=0;
    let y_cor=0;
    let bcheck=false;
    let d_layer=0;
    let point_id=0;
    let point_label='';
    for(let i=0; i<arr_event.length; i++)
    {
     if(arr_event[i].trim()!='')
     {
        bcheck=false;
        while(bcheck==false)
        {
          theta = Math.random() * 2 * Math.PI;
          r = R * Math.sqrt(Math.random());
          x_cor = centerX + r * Math.cos(theta);
          y_cor = centerY + r * Math.sin(theta);
          d_layer = Math.sqrt(Math.pow(x_cor-centerX,2) + Math.pow(y_cor-centerY,2));
          if (layer=='network' &&  d_layer<0.97 && d_layer>0.77) {
            bcheck=true;
          } 
          else if(layer=='host' &&  d_layer<0.72 && d_layer>0.52) {
            bcheck=true;
                }
                else if(layer=='application' &&  d_layer<0.47 && d_layer>0.27){
                  bcheck=true;
                }
                    else if(layer=='data' &&  d_layer<0.22 ){
                      bcheck=true;
                      setError(error_info=>n+":"+ d_layer.toString()+': ('+x_cor.toString()+','+y_cor.toString()+')');
                    }

        }
      }
     // let x_cor = 0.1;
      //let y_cor= 0.2;
      point_label=layer+'.'+level+'  '+ arr_event[i];
      point_id = md5(point_label);
      setCountId(count_id=>count_id+1);
      let record = {id: point_id, x: x_cor, y: y_cor, label:  point_label, color: point_color};
      //radar_data_temp = radar_data;
      radar_data_temp.push(record);
    }
  };

  // Tương tự như componentDidMount và componentDidUpdate:
  useEffect(() => {
    const interval = setInterval(() => {
      radar_data_temp.length=0;
      
        fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonData) {
          jsonData.hits.hits.slice(0, 1).map(item =>
            {
              setCountId(count=>count+1);
             
            
              //network.details.critical
             // getCoordinates(item._source.network.details.critical.information,'network', 'critical', critical_color );
               //network.details.high
            //   getCoordinates(item._source.network.details.high.information, 'network','high', high_color );
                //network.details.medium
             // getCoordinates(item._source.network.details.medium.information, 'network','medium', medium_color );
               //network.details.low
              // getCoordinates(item._source.network.details.low.information, 'network','low', low_color );
               
                //host.details.critical
             // getCoordinates(item._source.host.details.critical.information, 'host','critical', critical_color );
              //host.details.high
            //  getCoordinates(item._source.host.details.high.information, 'host','high', high_color );
               //host.details.medium
           //  getCoordinates(item._source.host.details.medium.information, 'host','medium', medium_color );
              //host.details.low
            //  getCoordinates(item._source.host.details.low.information, 'host','low', low_color );

               //application.details.critical
             //  getCoordinates(item._source.application.details.critical.information, 'application','critical', critical_color );
               //application.details.high
             //  getCoordinates(item._source.application.details.high.information, 'application','high', high_color );
                //application.details.medium
             // getCoordinates(item._source.application.details.medium.information, 'application','medium', medium_color );
               //application.details.low
               //getCoordinates(item._source.application.details.low.information, 'application','low', low_color );

                //data.details.critical
              getCoordinates(item._source.data.details.critical.information, 'data','critical', critical_color );
              //data.details.high
              getCoordinates(item._source.data.details.high.information, 'data','high', high_color );
               //data.details.medium
             getCoordinates(item._source.data.details.medium.information, 'data','medium', medium_color );
              //data.details.low
              getCoordinates(item._source.data.details.low.information, 'data','low', low_color );
              setRadarData(radar_data=>radar_data_temp);
            }
           
          );
           
        }).catch(function(error) {
      });
    }, 5000);




    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="radar">
      <div
        ref={parentRadarRef}
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
          <div className="circle-text">{radar_data.length}</div>
        </div>
        <div className="cir circle4">
          <div className="circle-text center">{error_info}</div>
        </div>
        <div className="radar"></div>
        <div className="line-x"></div>
        <div className="line-y"></div>
        <div className="dots">
          {radar_data.map((item) => (
            <DotRadar key={item.id} dotData={item} r={rect.width / 2} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Radar;