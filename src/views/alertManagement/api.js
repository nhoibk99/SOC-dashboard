const express = require("express");
const { CanvasRenderService } = require("chartjs-node-canvas");
const moment  = require('moment')
const docx = require("docx");
const fetch = require("node-fetch");
const {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
  VerticalAlign,
  ShadingType,
  convertInchesToTwip,
  ImageRun,
} = docx;

const {monent} = moment;
let app = express();

var configuration = {
  type: "bar",
  data: {
    labels: ["Nghiêm trọng", "Cao", "Trung bình ", "Thấp"],
    datasets: [
      {
        label: "CẢNH BÁO ATTT THEO MỨC ĐÔ",
        data: [0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            precision: 0,
            beginAtZero: true,
          },
        },
      ],
    },
  },
};

const mkChart = async (params) => {
  const canvasRenderService = new CanvasRenderService(400, 400);
  return await canvasRenderService.renderToBuffer(configuration);
};

app.get("/chart", async function (req, res) {
  let url =
    "http://elastic.vninfosec.net/alert-sample-v4*/_search?pretty=true&source=%20{%20%22from%22%20:%200,%20%22size%22%20:%2010000,%20%22query%22:{%20%22bool%22:%20{%20%22must%22:%20[{%20%22range%22:{%20%22timestamp%22:{%20%22gte%22:%222021-05-21T23:45%22,%20%22lt%22:%222021-05-25T23:45%22%20}%20}%20}]%20}%20},%22sort%22:%20[%20{%20%22timestamp%22:%20{%20%22order%22:%20%22desc%22%20}%20}%20]%20}&source_content_type=application/json";
  
  res.type =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  let critical_count = 0,
    high_count = 0,
    medium_count = 0,
    low_count = 0;
  let data_export = [];
  let dataexport_critical = [],
    dataexport_high = [],
    dataexport_medium = [],
    dataexport_low = [];
  let time = "",
    severity = "",
    message = "",
    attack_chain = "",
    source = "",
    dest = "";
  await fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonData) {
      //console.log(dataFetch);
      jsonData.hits.hits.map((item) => {
        time = moment(item._source["timestamp"]).format("DD/MM/YYYY hh:mm:ss");
        severity = item._source.severity;
        message = item._source.message.replace(
          ". With the related object:",
          ":"
        );
        attack_chain = item._source.attack_chain;
        source = item._source.source;
        dest = item._source.dest;
        switch (severity) {
          case "C":
            dataexport_critical.push({
              time: time,
              severity: severity,
              message: message,
              attack_chain: attack_chain,
              source: source,
              dest: dest,
            });
            break;
          case "H":
            dataexport_high.push({
              time: time,
              severity: severity,
              message: message,
              attack_chain: attack_chain,
              source: source,
              dest: dest,
            });
            break;
          case "M":
            dataexport_medium.push({
              time: time,
              severity: severity,
              message: message,
              attack_chain: attack_chain,
              source: source,
              dest: dest,
            });
            break;
          case "L":
            dataexport_low.push({
              time: time,
              severity: severity,
              message: message,
              attack_chain: attack_chain,
              source: source,
              dest: dest,
            });
            break;
          default:
            break;
        }
      });
      critical_count = dataexport_critical.length;
      high_count = dataexport_high.length;
      medium_count = dataexport_medium.length;
      low_count = dataexport_low.length;
      data_export = dataexport_critical.concat(
        dataexport_high.concat(dataexport_medium.concat(dataexport_low))
      );
    })
    .catch((e) => {
      console.log(e);
    });
    console.log('data export C',dataexport_critical.length)
    console.log('data export H',dataexport_high.length)
    console.log('data export M',dataexport_medium.length)
    console.log('data export L',dataexport_low.length)
    let fetchCount = [dataexport_critical.length, dataexport_critical.length, dataexport_critical.length, dataexport_critical.length]
    let config = {
        type: "bar",
        data: {
          labels: ["Nghiêm trọng", "Cao", "Trung bình ", "Thấp"],
          datasets: [
            {
              label: "CẢNH BÁO ATTT THEO MỨC ĐÔ",
              data: [dataexport_critical.length, dataexport_high.length, dataexport_medium.length, dataexport_low.length],
              backgroundColor: [
                "#e00909",
                "#e07109",
                "#ebdea5",
                "#4de009",
              ],
              borderColor: [
                "#e00909",
                "#e07109",
                "#ebdea5",
                "#4de009",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  precision: 0,
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      }
      const canvasRenderService = new CanvasRenderService(600, 300);
      var imagetemp = canvasRenderService.renderToBuffer(config);

  const image = new ImageRun({
    data: imagetemp,
    transformation: {
      width: 600,
      height: 300,
    },
  });
  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 1000,
              type: WidthType.DXA,
            },
            shading: {
              fill: "blue",
              val: ShadingType.SOLID,
              color: "blue",
            },
            children: [
              new Paragraph({
                text: "Thể hiện",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            margins: {
              left: convertInchesToTwip(0.1),
            },

            width: {
              size: 1700,
              type: WidthType.DXA,
            },
            shading: {
              fill: "blue",
              val: ShadingType.SOLID,
              color: "blue",
            },
            children: [new Paragraph("Ý nghĩa")],
          }),
          new TableCell({
            width: {
              size: 1200,
              type: WidthType.DXA,
            },
            shading: {
              fill: "blue",
              val: ShadingType.SOLID,
              color: "blue",
            },
            children: [
              new Paragraph({
                text: "Số Lượng",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            shading: {
              fill: "42c5f4",
              val: ShadingType.SOLID,
              color: "#ffc0cb",
            },
            children: [
              new Paragraph({
                text: "C",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Nghiêm trọng",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: critical_count.toString(),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            shading: {
              fill: "42c5f4",
              val: ShadingType.SOLID,
              color: "#ff0000",
            },
            children: [
              new Paragraph({
                text: "H",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Cao",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: high_count.toString(),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            shading: {
              fill: "42c5f4",
              val: ShadingType.SOLID,
              color: "#ffc000",
            },
            children: [
              new Paragraph({
                text: "M",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Trung bình",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: medium_count.toString(),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            shading: {
              fill: "42c5f4",
              val: ShadingType.SOLID,
              color: "#00b050",
            },
            children: [
              new Paragraph({
                text: "L",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Thấp",
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: low_count.toString(),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
    ],
  });
  let row = [];
  data_export.map((item) => {
    row = [
      ...row,
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph(item.time)],
          }),
          new TableCell({
            width: {
              size: 1200,
              type: WidthType.DXA,
            },
            shading: {
              fill: "42c5f4",
              val: ShadingType.SOLID,
              color:
                item.severity === "C"
                  ? "#e00909"
                  : item.severity === "H"
                  ? "#e07109"
                  : item.severity === "M"
                  ? "#ebdea5"
                  : "#4de009",
            },
            margins: {
              left: convertInchesToTwip(0.22),
              right: convertInchesToTwip(0.22),
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: item.severity,
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            width: {
              size: 7500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph(item.message)],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph(item.attack_chain)],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph(item.source)],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph(item.dest)],
          }),
        ],
      }),
    ];
  });
  const tableData = new Table({
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            shading: {
              fill: "blue",
              val: ShadingType.SOLID,
              color: "blue",
            },
            children: [new Paragraph("Thời gian")],
          }),
          new TableCell({
            width: {
              size: 1200,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            shading: {
              fill: "blue",
              val: ShadingType.SOLID,
              color: "blue",
            },
            children: [new Paragraph("Mức độ")],
          }),
          new TableCell({
            width: {
              size: 7500,
              type: WidthType.b,
            },
            verticalAlign: VerticalAlign.CENTER,
            shading: {
              fill: "blue",
              val: ShadingType.SOLID,
              color: "blue",
            },
            children: [new Paragraph("Cảnh báo")],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            shading: {
              fill: "blue",
              val: ShadingType.SOLID,
              color: "blue",
            },
            children: [new Paragraph("Attack chain")],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            shading: {
              fill: "blue",
              val: ShadingType.SOLID,
              color: "blue",
            },
            children: [new Paragraph("Nguồn")],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            shading: {
              fill: "blue",
              val: ShadingType.SOLID,
              color: "blue",
            },
            children: [new Paragraph("Đích")],
          }),
        ],
      }),
      ...row,
    ],
    width: {
      size: 11000,
      type: WidthType.DXA,
    },
  });

  const document = new Document({
    sections: [
      {
        children: [
        new Paragraph({
            text: "1. NỘI DUNG TÓM TẮT",
            heading: HeadingLevel.HEADING_1
        }),
        new Paragraph(" "),
        new Paragraph({
            text: "       1.1. aaa",
            heading: HeadingLevel.HEADING_2
        }),
        new Paragraph(" "),
        new Paragraph({
            text: "       1.2. bbb",
            heading: HeadingLevel.HEADING_2


        }),
        new Paragraph(" "),
        new Paragraph({
            text: "       1.3. ccc",
            heading: HeadingLevel.HEADING_2
        }),
          new Paragraph({
              children: [image],
          }),
          new Paragraph(" "),
          new Paragraph({
            text: "5. PHỤ LỤC: CÁC CẢNH BÁO AN TOÀN THÔNG TIN TRÊN HỆ THỐNG",
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph(" "),
          table,
          new Paragraph(" "),
          tableData,
        ],
      },
    ],
  });
  const b64string = await Packer.toBase64String(document);

  res.end(Buffer.from(b64string, "base64"));
});

app.listen(3061, () => {});
