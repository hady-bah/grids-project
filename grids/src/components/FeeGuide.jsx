import React, { useState } from "react";
import { InputNumber, Typography } from "antd";

function FeeGuide({ initialAmount }) {
  const [result, setResult] = useState(initialAmount); // Initialize result with the initial amount
  const { Text } = Typography;

  // Function to handle the input change
const handleInputChange = (value) => {
  let fee = 0;

  if (value <= 0) {
    fee = 0;
  } else if (value <= 50) {
    fee = 5;
  } else if (value <= 100) {
    fee = 10;
  } else if (value <= 150) {
    fee = 15;
  } else if (value <= 200) {
    fee = 20;
  } else if (value <= 250) {
    fee = 25;
  } else if (value <= 300) {
    fee = 30;
  } else if (value <= 550) {
    fee = 35;
  } else if (value <= 650) {
    fee = 45;
  } else if (value <= 900) {
    fee = 50;
  } else if (value <= 1000) {
    fee = 60;
  } else {
    const remainder = value % 1000;
    const thousands = Math.floor(value / 1000);
    fee = thousands * 60;
    fee +=
       remainder <= 0
        ? 0
        : remainder <= 50
        ? 5
        : remainder <= 100
        ? 10
        : remainder <= 150
        ? 15
        : remainder <= 200
        ? 20
        : remainder <= 250
        ? 25
        : remainder <= 300
        ? 30
        : remainder <= 550
        ? 35
        : remainder <= 650
        ? 45
        : remainder <= 900
        ? 50
        : 60;
  }

  setResult(fee);
};


  return (
    <>
      <div style={{ fontSize: "20px" }}>
        <p>
          <Text strong>Enter an amount below</Text>
        </p>
        <div>
          <InputNumber
            defaultValue={initialAmount}
            onChange={handleInputChange}
          />
        </div>
        <p>
          <Text strong>Fee = {result} </Text>
        </p>
      </div>
    </>
  );
}

export default FeeGuide;
