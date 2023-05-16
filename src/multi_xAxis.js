import React, { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";

const baseData = [
  {
    value: "2019 CNY",
    children: [
      { value: "D1", num: 0.9 },
      { value: "D2", num: 0.15 },
      { value: "D3", num: 0.18 }
    ]
  },
  {
    value: "2019 MGW",
    children: [
      { value: "D1", num: 0.25 },
      { value: "D2", num: 0.23 }
    ]
  },
  {
    value: "2023 CNY",
    children: [
      { value: "D1", num: 0.32 },
      { value: "D2", num: 0.33 },
      { value: "D3", num: 0.36 }
    ]
  },
  {
    value: "2023 MGW",
    children: [
      { value: "D1", num: 0.57 },
      { value: "D2", num: 0.72 }
    ]
  }
];

function MultiXAxis() {
  const chartRef = useRef(null);

  const Average = (array) => {
    return array.reduce((x, y) => x + y) / array.length;
  };

  useEffect(() => {
    let chartInstance = echarts.init(chartRef.current);
    const dLength = baseData
      .map((item) => item.children.length)
      .reduce((n, m) => n + m);

    let xData = [];
    let yData = [];
    let colorBar = [];
    let avgSeries = [];
    let showLabel = {};

    const ColorBG = (index) => {
      const colors = [
        "#C5E99B",
        "#8FBC94",
        "#D2BE5D",
        "#548687",
        "#f9cf36",
        "#4a5bdc",
        "#4cd698",
        "#f4914e",
        "#fcb75b",
        "#ffe180",
        "#b6c2ff",
        "#96edc1"
      ];
      return colors[index];
    };

    let series = [
      {
        name: "daily",
        data: yData,
        type: "bar",
        label: {
          show: true,
          position: "insideBottom",
          textStyle: {
            color: "#555"
          }
        },
        itemStyle: {
          color: (params) => colorBar[params.dataIndex]
        },
        xAxisIndex: 0,
        yAxisIndex: 0
      }
      /*{
        name: '2019 CNY Avg',
        data: [0.2, 0.2, 0.2],
        type: "line",
        symbolSize: 0.01, 
        itemStyle:{
          normal:{
              lineStyle:{
                  width:2,
                  type:'dotted'  //'dotted'点型虚线 'solid'实线 'dashed'线性虚线
              }
          }
      },

        label: {
          show: true,
          formatter: (params) => {
            if (params.dataIndex === showLabel[params.seriesName]) {
              return params.data;
            }
            return "";
          },
          position: "top",
          textStyle: { 
            color: "#555"
          }
        },
        xAxisIndex: 0,
        yAxisIndex: 0
      },
      {
        name: "average2",
        data: [null, null, null, 0.2, 0.2],
        type: "line",
        label: {
          show: false,
          formatter: '',
          position: "top",
          textStyle: {
            color: "#555"
          }
        },
        xAxisIndex: 0,
        yAxisIndex: 0
      }*/
    ];

    let baseObj = {
      data: [
        {
          name: "",
          value: 1
        }
      ],
      label: {
        show: true,
        position: "inside",
        formatter: "{b}",
        offset: [0, 10],
        textStyle: {
          color: "black"
        }
      },
      type: "bar",
      barGap: 0,
      barWidth: "",
      itemStyle: {
        color: "",
        opacity: 0.5
      },
      animationEasing: "bounceOut",
      xAxisIndex: 1,
      yAxisIndex: 1
    };

    let baseAvg = {
      name: "",
      data: [],
      type: "line",
      symbolSize: 0.01,
      itemStyle: {
        normal: {
          lineStyle: {
            width: 2,
            type: "dotted",
            color: "#d5ceeb" //'dotted'点型虚线 'solid'实线 'dashed'线性虚线
          }
        }
      },

      label: {
        show: true,
        formatter: (params) => FormatterFunc(params),
        position: "top",
        textStyle: {
          color: "#555"
        }
      },
      xAxisIndex: 0,
      yAxisIndex: 0
    };

    baseData.forEach((item, index) => {
      let pObj = JSON.parse(JSON.stringify(baseObj));
      let colorCurrent = ColorBG(index);
      //let avgObj = baseAvg;
      let avgObj = JSON.parse(JSON.stringify(baseAvg));
      let startIndex = colorBar.length;
      let endIndex = item.children.length + colorBar.length;

      pObj.data[0].name = item.value;
      pObj.barWidth = (item.children.length / dLength) * 100 + "%";

      pObj.itemStyle.color = colorCurrent;
      series.push(pObj);
      item.children.forEach((cItem) => {
        xData.push({
          value: cItem.value,
          pName: item.value
        });
        yData.push(cItem.num);

        colorBar.push(colorCurrent);
      });

      let avgSeriesDate = yData.slice(startIndex, endIndex);
      let avgSeriesFigure = Average(avgSeriesDate);

      avgObj.name = `${item.value} Avg`;
      showLabel[`${item.value} Avg`] = endIndex - 1;

      for (let stepNull = 0; stepNull < startIndex; stepNull++) {
        avgObj.data.push(null);
      }

      for (let step = 0; step < endIndex - startIndex; step++) {
        // Runs 5 times, with values of step 0 through 4.
        avgObj.data.push(avgSeriesFigure);
      }
      avgObj.label.formatter = (params) => {
        if (params.dataIndex === showLabel[params.seriesName]) {
          //console.log('run') ;
          return params.data.toFixed(2);
        }
        return "";
      };
      avgObj.itemStyle.normal.lineStyle.color = colorCurrent;
      //console.log(avgSeries)
      avgSeries.push(avgObj);
    });

    console.log(...avgSeries);

    avgSeries.forEach((cItem) => {
      //console.log(cItem)
      series.push(cItem);
    });

    chartInstance.setOption({
      tooltip: {
        show: false,
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: [
        {
          top: 20,
          bottom: 60
        },
        {
          height: 60,
          bottom: 0,
          tooltip: { show: false }
        }
      ],
      xAxis: [
        {
          type: "category",
          data: xData,
          gridIndex: 0,
          axisLabel: {
            color: "#333"
          },
          axisLine: {
            lineStyle: {
              color: "#e7e7e7"
            }
          },
          axisTick: {
            lineStyle: {
              color: "#e7e7e7"
            }
          },
          zlevel: 2
        },
        {
          type: "category",
          gridIndex: 1,
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          zlevel: 1
        }
      ],
      yAxis: [
        {
          type: "value",
          gridIndex: 0,
          axisLabel: {
            color: "#333"
          },
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ccc"
            }
          },
          axisTick: {
            lineStyle: {
              color: "#ccc"
            }
          }
        },
        {
          type: "value",
          gridIndex: 1,
          axisLabel: { show: false },
          axisLine: { show: false },
          splitLine: { show: false },
          axisTick: { show: false }
        }
      ],
      series
    });
  });

  return (
    <div>
      <div ref={chartRef} style={{ height: "500px" }}></div>
    </div>
  );
}

export default MultiXAxis;
