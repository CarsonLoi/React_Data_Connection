import React, { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import PubSub from "pubsub-js";

let xAxisDatas = [
  "Jan 01",
  "Jan 02",
  "Jan 02",
  "Jan 03",
  "Jan 04",
  "Jan 05",
  "Jan 06",
  "Jan 07",
  "Jan 08",
  "Jan 09",
  "Jan 10",
  "Jan 11",
  "Jan 12",
  "Jan 13",
  "Jan 14",
  "Jan 15",
  "Jan 16",
  "Jan 17",
  "Jan 18",
  "Jan 19",
  "Jan 20",
  "Jan 21",
  "Jan 22",
  "Jan 23",
  "Jan 24",
  "Jan 25",
  "Jan 26",
  "Jan 27",
  "Jan 28",
  "Jan 29",
  "Jan 30",
  "Jan 31"
];
let series = {
  GM: [
    {
      name: "A",
      type: "line",
      data: [
        1,
        5,
        9,
        3,
        9,
        3,
        4,
        8,
        9,
        4,
        9,
        4,
        0,
        3,
        5,
        7,
        1,
        2,
        8,
        9,
        8,
        5,
        7,
        2,
        6,
        8,
        4,
        4,
        7,
        5,
        1,
        3
      ]
    },
    {
      name: "B",
      type: "bar",
      data: [
        1,
        5,
        9,
        3,
        9,
        3,
        4,
        8,
        9,
        4,
        9,
        4,
        0,
        3,
        5,
        7,
        1,
        2,
        8,
        9,
        8,
        5,
        7,
        2,
        6,
        8,
        4,
        4,
        7,
        5,
        1,
        3
      ]
    }
  ],
  SW: [
    {
      name: "A",
      type: "line",
      data: [
        6,
        5,
        5,
        10,
        8,
        8,
        8,
        6,
        3,
        3,
        3,
        3,
        0,
        7,
        2,
        6,
        3,
        8,
        2,
        8,
        5,
        6,
        1,
        8,
        8,
        5,
        9,
        6,
        6,
        9,
        3,
        2
      ]
    },
    {
      name: "B",
      type: "bar",
      data: [
        6,
        5,
        5,
        10,
        8,
        8,
        8,
        6,
        3,
        3,
        3,
        3,
        0,
        7,
        2,
        6,
        3,
        8,
        2,
        8,
        5,
        6,
        1,
        8,
        8,
        5,
        9,
        6,
        6,
        9,
        3,
        2
      ]
    }
  ]
};

function EchartFunc() {
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);

  const [propertyValue, setPropertyValue] = useState("GM");

  PubSub.subscribe("property", (msg, data) => {
    //console.log(data);
    setPropertyValue(data);
  });

  useEffect(() => {
    let chartInstance = echarts.init(chartRef.current);
    let chartInstance2 = echarts.init(chartRef2.current);
    var option1 = {
      textStyle: {
        color: "#545454",
        fontFamily: "Source Han Sans",
        fontWeight: "lighter"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999"
          }
        }
      },
      legend: {
        data: ["A", "B"],
        left: "80%",
        top: "2%",
        itemWidth: 10,
        itemHeight: 5
      },
      xAxis: {
        type: "category",
        data: xAxisDatas,
        axisLabel: {
          margin: "10"
        },
        name: "xAxisName",
        nameLocation: "center",
        axisTick: {
          alignWithLabel: true,
          inside: true
        }
      },
      yAxis: {
        name: "yAxis_Name",
        type: "value",
        splitLine: {
          show: false
        }
      },
      dataZoom: [
        {
          show: false,
          realtime: true,
          start: 50,
          end: 100
        },
        {
          type: "inside",
          realtime: true,
          start: 50,
          end: 100
        }
      ],
      series: series[propertyValue]
    };
    var option2 = {
      textStyle: {
        color: "#545454",
        fontFamily: "Source Han Sans",
        fontWeight: "lighter"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999"
          }
        }
      },
      legend: {
        data: ["A", "B"],
        left: "80%",
        top: "2%",
        itemWidth: 10,
        itemHeight: 5
      },
      xAxis: {
        type: "category",
        data: xAxisDatas,
        axisLabel: {
          margin: "10"
        },
        name: "xAxis_Name",
        nameLocation: "start",
        axisTick: {
          alignWithLabel: true,
          inside: true
        }
      },
      yAxis: {
        name: "yAxis_Name",
        type: "value",
        splitLine: {
          show: false
        }
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 50,
          end: 100
        },
        {
          type: "inside",
          realtime: true,
          start: 50,
          end: 100
        }
      ],
      series: series[propertyValue]
    };

    chartInstance.setOption(option1);
    chartInstance2.setOption(option2);

    echarts.connect([chartInstance, chartInstance2]);
  }, [propertyValue]);

  return (
    <div>
      <div ref={chartRef} style={{ height: "300px" }}></div>
      <div ref={chartRef2} style={{ height: "300px" }}></div>
    </div>
  );
}

export default EchartFunc;
