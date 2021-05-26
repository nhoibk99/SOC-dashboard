// import React from 'react';
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Cell
// } from 'recharts';
// import './chart.styles.scss';
// import FileSaver from "file-saver";
// import ChartFunc from './chart.functioncomponent';
// // let url = 'http://elastic.vninfosec.net/threat-hunting-statistics/_search?pretty=true&q=%2Bcustomer%3A%28%22khach+hang+a%22%29%2Bdisplay_classification%3A%28%22mitre+att%26ck%22%29%2Btime%3A%28%22last+day%22%29';
// // let base64= require('base-64');
// // let username='admin';
// // let password='!@#VNinfosec@123';
// // let headers_get = new Headers({
// //   'Authorization': 'Basic '+ base64.encode(username+":"+password), 
// //   'Content-Type': 'application/x-www-form-urlencoded'
// // });
// let api = 'http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty&filter_path=aggregations&source=%7b%22query%22:%20%7b%22range%22:%20%7b%22@timestamp%22:%20%7b%22gte%22:%20%22now-30d/d%22,%22lte%22:%20%22now/d%22%7d%7d%7d,%22aggs%22:%20%7b%22byday%22:%20%7b%22date_histogram%22:%20%7b%22field%22:%20%22@timestamp%22,%22interval%22:%20%22day%22%7d%7d%7d%7d&source_content_type=application/json';

// class Chart extends React.Component {
//   constructor(){
//     super();
//     this.state = {
//      chartdata: [],
//     }
//   }
 
//   componentDidMount() {
//     this.tick();
//     this.interval = setInterval(this.tick, 10000);
//   }
   
//   componentWillUnmount() {
//    clearInterval(this.interval);
//   }

//   tick = () => {
//     const that = this;
//     // fetch(api)
//     //     .then(function(response) {
//     //         return response.json();
//     //     })
//     //     .then(function(jsonData) {
//     //       let data = [];
//     //       jsonData.aggregations.byday.buckets.map((item,index) =>
//     //         {
//     //           let today = new Date(item.key);
//     //           data = [...data,{ name: (today.getDate() + '/' + (today.getMonth() + 1)), count: item.doc_count, color: '#ffbe00'}]
//     //           return data;
//     //         });
//     //         that.setState({ 
//     //           chartdata :data
//     //         }); 
//     //     }).catch(function(error) {
//     //       that.setState({ apiInfo:error });
//     //       console.log(error);
//     //   });
//   }

//   handleDownload =  () => {
//     // Use FileSaver to download the PNG
//     FileSaver.saveAs(this.state.png, "test.png");
//   };

//   render() {
//     return (
//       <div className="chart">
//         <div className="title-chart">Dữ liệu trong 30 ngày gần nhất</div>
//         <ChartFunc />
//       </div>
//     );
//   }
// }

// export default Chart;
