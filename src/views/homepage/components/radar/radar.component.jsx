import React, { useState, useEffect } from "react";

import DotRadar from './dot-radar.component';
import useClientRect from '../../../../hooks/useClientRect.hook';
import './radar.syles.scss';

//tọa độ tâm radar (-0.02, 0.02)
//khoảng cách từ 2 biên của lớp network đến tâm: (lề ngoài: 0,95, lề trong: 0,75)
//khoảng cách từ 2 biên lớp host đến tâm: (lề ngoài: 0,70, lề trong: 0,5)
//khoảng cách từ 2 biên lớp application đến tâm: (lề ngoài: 0,45, lề trong: 0,25)
//khoảng cách từ 2 biên lớp host đến tâm: (lề ngoài: 0,20, lề trong: 0)
//công thức tính kc 2 điểm A(x1,y1) và B(x2,y2): sqrt( (x1-x2)^2 + (y1-y2)^2 )

let critical_color =  '#e00909';
let high_color =  '#e07109';
let medium_color =  '#e0b809';

const Radar = () => {
  const data = [
    {id: 1, x: 0.1, y: 0.02, label: '10.0.0.20: Initial Access - Exploit Public-Facing Application - Exploit SQL Injection; Collection - Data from local system - Abnormal IP: 159.25.26.27 access to MySQL Database', color: critical_color},
    {id: 2, x: 0.4, y: 0.2, label: '172.26.17.103: Execution - Exploitation for Client Execution - CVE-2021-22192 - Gitlab RCE', color: critical_color},
    {id: 3, x: -0.3, y: 0.2, label: '172.26.17.104: Execution - Exploitation for Client Execution - Server side template injection - Twig RCE', color: critical_color},
    {id: 4, x: 0.13, y: 0.27, label: '172.26.17.100: Baseline-Apache - Checksum root folder was changed', color: medium_color},
    {id: 5, x: 0.25, y: -0.25, label: '172.26.17.101: Initial Access - External Remote Service - CVE-2020-0708 - Exploit Windows RDP Service', color: medium_color},
    {id: 6, x: -0.25, y: -0.25, label: '172.26.17.102: Initial Access - Exploit Public-Facing Application - CVE-2020-17519 - Apache Flink', color: medium_color},
    {id: 7, x: -0.55, y: -0.2, label: '10.0.12.14: Privilege Escalation - CVE-2020-14386 - Linux Kernel Privilege Escalation Vulnerability', color: critical_color},
    {id: 8, x: 0.35, y: 0.5, label: '10.0.11.11: Baseline-Linux - Firewall is OFF', color: high_color},
    {id: 9, x: -0.35, y: 0.5, label: '10.0.11.12: Baseline-Windows - Abnormal Schedule Task', color: high_color},
    {id: 10, x: -0.55, y: -0.4, label: '10.0.12.16: Baseline-Windows - Endpoint Cyclance is OFF', color: high_color},
    {id: 11, x: -0.8, y: 0.2, label: '10.0.11.11: Baseline-Linux - Connection Outbount via Port 443; Baseline-Linux - DNS: TXT record exceed legth', color: critical_color},
    {id: 12, x: 0.7, y: -0.4, label: '10.12.13.14:Baseline-Linux - DNS: TXT record exceed legth', color: critical_color},
    {id: 13, x: 0.6, y: 0.6, label: '172.26.17.188: Suspect DDoS - Bandwidth increase abnormally', color: medium_color},
    {id: 14, x: 0.6, y: -0.7, label: '10.10.10.11: Baseline-SSL - SSL Expried', color: medium_color},
    {id: 15, x: -0.55, y: 0.65, label: 'FW_OFFICE_AREA: ARP-Posioning - Detect Client 10.0.0.5 performed bad behavior', color: medium_color},
    {id: 16, x: -0.65, y: -0.65, label: 'FW_PaloAlto: Malware - Dropped traffic from Client 10.0.0.5 connect to malware domain', color: medium_color},
     ];


 // const [data, setData] = useState(initialdata);
 // const [x_cor, setCor]= useState({x_cor:0.1});
 // const [count, setCount]= useState({count:3});
  const [rect, parentRadarRef] = useClientRect();
  useEffect(() => {
    console.log("mounted");

   /* const interval = setInterval(() => {
      let x_cortemp =x_cor + 0.1;
      let count_temp=count+1;
      let data_temp=data;
      data_temp.push({id: 4, x: x_cortemp, y: x_cortemp, label: '4', color: '#e00909'});
      setCor(x_cortemp);
      setCount(count_temp);
      setData(data_temp);
    }, 2000);
    return () => clearInterval(interval);*/

   

  }, []);

  useEffect(() => {
    console.log("updated");
  });

  
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
          <div className="circle-text">Application</div>
        </div>
        <div className="cir circle4">
          <div className="circle-text center">Data</div>
        </div>
        <div className="radar"></div>
        <div className="line-x"></div>
        <div className="line-y"></div>
        <div className="dots">
          {data.map((item) => (
            <DotRadar key={item.id} dotData={item} r={rect.width / 2} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Radar;