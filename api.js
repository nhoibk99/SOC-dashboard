const express = require("express");
const Chart = require('chart.js');
const ChartDataLabels = require('chartjs-plugin-datalabels');
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
  TextRun,
  ImageRun,
} = docx;

const {monent} = moment;
let app = express();

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
      
        datasets: [
          {
           
            data: [critical_count],
            label: "Critical ("+critical_count.toString()+')' ,
            backgroundColor: "rgba(161, 4, 4, 1)", 
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 1,
            datalabels: {
              align: 'start',
              anchor: 'start'
          }
          },
          {
            data: [high_count],
            label: "High ("+high_count.toString()+')' ,
            backgroundColor: "rgba(255, 25, 25, 1)", 
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 1,
            datalabels: {
              align: 'start',
              anchor: 'start'
          }
          },
          {
            data: [medium_count],
            label: "Medium ("+medium_count.toString()+')' ,
            backgroundColor: "rgba(255, 192, 0, 1)", 
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 1,
            datalabels: {
              align: 'start',
              anchor: 'start'
          }
          },
          {
            data: [low_count],
            label: "Low ("+low_count.toString()+')' ,
            backgroundColor: "rgba(0, 176, 80, 1)", 
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 1,
            datalabels: {
              align: 'start',
              anchor: 'start'
          }
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
      // plugins: {
      //   datalabels: {
      //       backgroundColor: function(context) {
      //           return context.dataset.backgroundColor;
      //       },
      //       borderRadius: 4,
      //       color: 'red',
      //       font: {
      //           weight: 'bold'
      //       },
      //       formatter: Math.round
      //   }
      // }
    }
  const width = 600;
  const height = 400;
  const chartCallback = (ChartJS) => {
    ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
    ChartJS.plugins.register({
        // datalabels
    });
  };
  const canvasRenderService = new CanvasRenderService(width, height, chartCallback);
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
                alignment: AlignmentType.CENTER,
                children: [
                  new docx.TextRun({
                    text: "Thể hiện",
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
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
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new docx.TextRun({
                  text: "Ý nghĩa",
                  font: 'Calibri',
                  size: 22,
                }),
              ],
            })],
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
                children: [
                  new docx.TextRun({
                    text: "Số Lượng",
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
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
              color: "#e00909",
            },
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: "C",
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Nghiêm trọng",
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: critical_count.toString(),
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
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
              color: "#e07109",
            },
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: "H",
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Cao",
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: high_count.toString(),
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
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
              color: "#ebdea5",
            },
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: "M",
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Trung bình",
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: medium_count.toString(),
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
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
              color: "#4de009",
            },
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: "L",
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Thấp",
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new docx.TextRun({
                    text: low_count.toString(),
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
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
                children: [
                  new docx.TextRun({
                    text: item.severity,
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
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
            children: [new Paragraph(
              {
                children: [
                  new docx.TextRun({
                    text: item.message,
                    font: 'Calibri',
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              })],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              children: [
                new docx.TextRun({
                  text: item.attack_chain,
                  font: 'Calibri',
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
            })],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              children: [
                new docx.TextRun({
                  text: item.source,
                  font: 'Calibri',
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
            })],
          }),
          new TableCell({
            width: {
              size: 1500,
              type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              children: [
                new docx.TextRun({
                  text: item.dest,
                  font: 'Calibri',
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
            })],
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
            children: [new Paragraph({
              children: [
                new docx.TextRun({
                  text: "Thời gian",
                  font: 'Calibri',
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
            })],
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
            children: [new Paragraph({
              children: [
                new docx.TextRun({
                  text: "Mức độ",
                  font: 'Calibri',
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
            })],
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
            children: [new Paragraph({
              children: [
                new docx.TextRun({
                  text: "Cảnh báo",
                  font: 'Calibri',
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
            })],
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
            children: [new Paragraph({
              children: [
                new docx.TextRun({
                  text: "Attach chain",
                  font: 'Calibri',
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
            })],
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
            children: [new Paragraph({
              children: [
                new docx.TextRun({
                  text: "Nguồn",
                  font: 'Calibri',
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
            })],
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
            children: [new Paragraph({
              children: [
                new docx.TextRun({
                  text: "Đích",
                  font: 'Calibri',
                  size: 22,
                }),
              ],
              alignment: AlignmentType.CENTER,
            })],
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
              children: [
                new docx.TextRun({
                  text: "1. NỘI DUNG TÓM TẮT",
                  bold: true,
                  font: 'Calibri',
                  size: 26,
                }),
              ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new docx.TextRun({
                text: "       1.1. aaa",
                bold: true,
                font: 'Calibri',
                size: 26,
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new docx.TextRun({
                text: "       1.2. bbb",
                bold: true,
                font: 'Calibri',
                size: 26,
              }),
            ],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new docx.TextRun({
                text: "       1.3. ccc",
                bold: true,
                font: 'Calibri',
                size: 26,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new docx.TextRun({
                text: "CẢNH BÁO ATTT THEO MỨC ĐỘ",
                bold: true,
                font: 'Calibri',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
              children: [image],
          }),
          new Paragraph(" "),
          new Paragraph({
            children: [
              new docx.TextRun({
                text: "5. PHỤ LỤC: CÁC CẢNH BÁO AN TOÀN THÔNG TIN TRÊN HỆ THỐNG",
                bold: true,
                font: 'Calibri',
                size: 26,
              }),
            ],
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
