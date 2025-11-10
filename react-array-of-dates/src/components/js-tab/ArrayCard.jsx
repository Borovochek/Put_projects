import React, { useState } from "react";
import { Card, Select, Button, Space } from "antd";
import { arr } from "../../Data/ArrayData.jsx";
import "../../css/ArrayCard.css";

const { Option } = Select;

function arrayIteration(array, method) {
  if (method === "forEach") {
    let newArr = [];
    for (let i = 0; i < array.length; i++) {
      newArr.push(array[i] * 2);
    }
    return newArr;
  }
  if (method === "some") {
    for (let i = 0; i < array.length; i++) {
      if (array[i] < 0) {
        return false;
      }
    }
    return true;
  }
};

export const ArrayCard = () => {
  const [method, setMethod] = useState("forEach");
  const [result, setResult] = useState(null);

  const handleChange = (value) => setMethod(value);

  const handleRun = () => {
    const output = arrayIteration(arr, method);
    setResult(output);
  };

  return (
    <Card title="Массив" className="array-card">
      <Space direction="vertical" size="middle" className="array-space">
        <div className="array-display">
          <strong>Массив:</strong> [{arr.join(", ")}]
        </div>

        <Select value={method} onChange={handleChange} className="array-select">
          <Option value="forEach">forEach</Option>
          <Option value="some">some</Option>
        </Select>

        <Button type="primary" onClick={handleRun} className="array-button">
          Применить
        </Button>

        {result !== null && (
          <div className="array-result">
            <strong>Результат:</strong>{" "}
            {Array.isArray(result) ? `[${result.join(", ")}]` : result.toString()}
          </div>
        )}
      </Space>
    </Card>
  );
};