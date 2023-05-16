import "./styles.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Echarts_Sample from "./echarts";
import EchartFunc from "./echartsFunc";
import Button_Area from "./button";
import DatePickerValue from "./calendar";
import MultiXAxis from "./multi_xAxis";
import { CContainer } from "@coreui/react";

export default function App() {
  return (
    <div className="App">
      {
        <CContainer fluid>
          <Button_Area />
          <br />
          <DatePickerValue />
          <EchartFunc />
        </CContainer>
      }
      Bu
      <MultiXAxis />
    </div>
  );
}
