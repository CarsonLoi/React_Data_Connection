import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";

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
let series = [
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
];

export default class Echart_Sample extends React.Component {

  
  componentDidMount() {
    console.log(xAxisDatas.length);
    var myChart1 = echarts.init(document.getElementById("leftTj")); //init实例化统计图
    var myChart2 = echarts.init(document.getElementById("rightTj"));
    //const divRef1 = useRef(null);
    //const divRef2 = useRef(null);

   // var myChart1 = echarts.init(divRef1.current);
   // var myChart2 = echarts.init(divRef2.current);

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
      series: series
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
      series: series
    };
    myChart1.setOption(option1);
    myChart2.setOption(option2);
    echarts.connect([myChart2, myChart1]);
  }

  render() {
    return (
      <div>
        <div id="leftTj" style={{ width: "100%", height: 300 }}>
          aa
        </div>
        <div id="rightTj"  style={{ width: "100%", height: 300 }}>
          bb
        </div>
        {/* </div> */}
      </div>
    );
  }
}
