
import FileSaver from "file-saver";
import React , {useState} from "react";
import { useMeasure } from "react-use";
// import {
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   Tooltip,
//   XAxis,
//   YAxis
// } from "recharts";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  Cell
} from 'recharts';
import { useRechartToPng } from "recharts-to-png";
import {
    Document,
    Packer,
    Paragraph, ImageRun,
  } from "docx";
const ChartFunc = () => {
  let api = 'http://elastic.vninfosec.net/alert-khach_hanga/_search?pretty&filter_path=aggregations&source=%7b%22query%22:%20%7b%22range%22:%20%7b%22@timestamp%22:%20%7b%22gte%22:%20%22now-30d/d%22,%22lte%22:%20%22now/d%22%7d%7d%7d,%22aggs%22:%20%7b%22byday%22:%20%7b%22date_histogram%22:%20%7b%22field%22:%20%22@timestamp%22,%22interval%22:%20%22day%22%7d%7d%7d%7d&source_content_type=application/json';

  const [containerRef, { width: containerWidth }] = useMeasure();
  // The chart ref that we want to download the PNG for.
  const [png, ref] = useRechartToPng();
  const [data, setData] = useState();
  const handleDownload = React.useCallback(async () => {
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
            console.log('data fetch', dataTemp);
            setData(dataTemp)
        })
        .catch(function(error) {
          console.log(error);
        });
    console.log('da vao day data',data);
    // console.log('da vao day png',png);
    // Use FileSaver to download the PNG
    const doc = new Document({
      sections: [
          {
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: Uint8Array.from(atob(png.split(',')[1]), c =>
                    c.charCodeAt(0)
                  ),
                  transformation: {
                    width: 600,
                    height: 300
                  }
                })
              ]
            })
          ]
          }
        ]
      });

      Packer.toBlob(doc).then(blob => {
        console.log(blob);
        FileSaver.saveAs(blob, "example.docx");
        console.log("Document created successfully");
      });
      // FileSaver.saveAs(png, "test.png");
  }, [png]);

  
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
          {/* <Legend wrapperStyle={{ bottom: 5 }} /> */}
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
