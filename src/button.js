import React, { useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import PubSub from "pubsub-js";

function Button_Area() {
  const [propertyValue, setPropertyValue] = useState("GM");

  const property = [
    { name: "AAAA Macau", value: "GM", id: 1001 },
    { name: "SAAAA", value: "SW", id: 1002 }
  ];

  changeProperty = (e) => {
    // 接收用户输入数据
    let property = e.currentTarget.value;
    // 调用pubsub提供的方法publish(发布者利用接收到的数据传给订阅者page)（pageNumber为发布的函数名，相当于标识身份用的）
    setPropertyValue(property);
    PubSub.publish("property", property);
    //console.log('success' , property)
  };

  return (
    <ButtonGroup className="">
      {property.map((p, idx) => (
        <ToggleButton
          key={p.id}
          id={`p-${p.id}`}
          type="radio"
          variant={"light"}
          name="property"
          disabled={false}
          value={p.value}
          checked={propertyValue === p.value}
          onChange={(e) => changeProperty(e)}
        >
          {p.name}
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
}

export default Button_Area;
