
import FileSaver from "file-saver";
import React from "react";
import { useMeasure } from "react-use";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useRechartToPng } from "recharts-to-png";

const ChartFunc = () => {
    const [containerRef, { width: containerWidth }] = useMeasure();
  // The chart ref that we want to download the PNG for.
  const [png, ref] = useRechartToPng();

  const handleDownload = React.useCallback(async () => {
      console.log('da vao day',png);
    // Use FileSaver to download the PNG
    FileSaver.saveAs(png, "test.png");
  }, [png]);

  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 }
  ];
  return (
    <div>
       ----------- Liem ---------------
      <br />
            <button onClick={handleDownload}>Download</button>
      <LineChart
        ref={ref} // Save the ref of the chart
        data={data}
        height={300}
        width={600}
        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend wrapperStyle={{ bottom: 5 }} />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
};

export default ChartFunc;
