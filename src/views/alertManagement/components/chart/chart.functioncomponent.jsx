
import FileSaver from "file-saver";
import React , {useState, useEffect} from "react";
import { useMeasure } from "react-use";
import { ResponsiveContainer,  BarChart,  Bar,  XAxis,  YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useRechartToPng } from "recharts-to-png";
import { Document, Packer,  Paragraph, ImageRun } from "docx";

const ChartFunc = () => {
  let api = 'http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty&filter_path=aggregations&source=%7b%22query%22:%20%7b%22range%22:%20%7b%22@timestamp%22:%20%7b%22gte%22:%20%22now-30d/d%22,%22lte%22:%20%22now/d%22%7d%7d%7d,%22aggs%22:%20%7b%22byday%22:%20%7b%22date_histogram%22:%20%7b%22field%22:%20%22@timestamp%22,%22interval%22:%20%22day%22%7d%7d%7d%7d&source_content_type=application/json';

  const [containerRef, { width: containerWidth }] = useMeasure();
  // The chart ref that we want to download the PNG for.
  const [png, ref] = useRechartToPng();
  const [data, setData] = useState();
  useEffect(() => {
    // Update the document title using the browser API
    fetch(api)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonData) {
          let dataTemp = [];
          jsonData.aggregations.byday.buckets.map((item,index) =>
            {
              let today = new Date(item.key);
              dataTemp = [...dataTemp,{ name: (today.getDate() + '/' + (today.getMonth() + 1)), count: item.doc_count, color: '#ffbe00'}]
            });
            // console.log('data fetch', dataTemp);
            setData(dataTemp)
        })
        .catch(function(error) {
          console.log(error);
        });
    // console.log('da vao day data',data);
  });
 

  const handleDownload = React.useCallback(async () => {
    //    console.log('da vao day',png);
      // Use FileSaver to download the PNG
     // FileSaver.saveAs(png, "test.png");
     fetch('http://localhost:3061/chart')
     //                         vvvv
     .then(response => response.blob())
     .then(data => {
         // Then create a local URL for that image and print it 
         FileSaver.saveAs(data, "test.docx");
         let outside = URL.createObjectURL(data)
         window.alert(outside);
     }).catch(function (error) {
      window.alert(error);
     });
  
    });
  return (
    <div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart 
          ref= {ref} 
          width={400} height={420} 
          layout="horizontal" 
          data={data} 
          drawValueAboveBar ={true}
          xAxis= {{
            drawLabels: true,
          }}
          options = {{ plugins: { datalabels: { display: true }}}}
          margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" type="category"  fontWeight='bold' axisLine={false} dx={-5} tickLine={false} />
          <YAxis type="number" />
          <Tooltip />
          <Bar dataKey="count" minPointSize={2} barSize={15}>
            {data?.map((d, idx) => {
              return <Cell fill={d.color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default ChartFunc;
