import React, { useEffect } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

const data = {
  "2023-01-01": [1, 2, 3, 4, 5],
  "2023-01-02": [3, 2, 3, 4, 5],
  "2023-01-03": [3, 2, 3, 4, 5],
  "2023-01-04": [10, 2, 3, 4, 5]
};

export default function DatePickerValue() {
  const [value, setValue] = React.useState(dayjs("2022-04-17"));
  const [valueEnd, setValueEnd] = React.useState(dayjs("2022-04-17"));
  const avgDate = [];
  //const currentDate = Date().format("YYYY-MM-DD")

  //console.log(currentDate)

  const changeDate = (date) => {
    var newDate = date;
    var dataNew = [];
    var finaldate = newDate.format("YYYY-MM-DD");

    setValue(newDate);
    setValueEnd(newDate);

    //console.log(newDate, finaldate);
    try {
      dataNew = data[finaldate].length > 0 ? data[finaldate] : [];
    } catch (e) {
      dataNew = [];
      console.log("error", dataNew);
    }
  };

  const changeDateEnd = (dateEnd) => {
    var newDateEnd = dateEnd;
    var dataNew = [];
    var finalDateEnd = newDateEnd.format("YYYY-MM-DD");

    // console.log(newDateEnd , finalDateEnd);

    if (newDateEnd >= value) {
      setValueEnd(newDateEnd);
      console.log(finalDateEnd);
    } else {
      console.log("cant");
      setValueEnd(value);
    }
  };

  console.log(Object.keys(data).length);

  useEffect(() => {
    for (const property in data) {
      console.log(
        property >= value.format("YYYY-MM-DD") &&
          property <= valueEnd.format("YYYY-MM-DD")
      );
    }
  }, [value, valueEnd]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label="Start Date"
          value={value}
          onChange={(newValue) => changeDate(newValue)}
        />
        <DatePicker
          label="End Date"
          value={valueEnd}
          minDate={value}
          onChange={(newValueEnd) => changeDateEnd(newValueEnd)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
