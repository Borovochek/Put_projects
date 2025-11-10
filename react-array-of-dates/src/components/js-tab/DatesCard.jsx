import React, { useState } from "react";
import { Card, Button, List, Space } from "antd";
import { dates } from "../../Data/DatesData.jsx";
import "../../css/DatesCard.css"; // подключаем стили

function parseDate(str) {
  const dateArr = str.split(" ");
  const [day, month, year] = dateArr[0].split(".");
  const [hour, minute] = dateArr[1].split(":");

  const offsetPart = dateArr[3].replace(")", "");
  const symbol = offsetPart.slice(0, 1);
  const offset = offsetPart.slice(1);

  const isoString = `${year}-${month}-${day}T${hour}:${minute}:00${symbol}${offset.padStart(
    2,
    "0"
  )}:00`;
  const dateObj = new Date(isoString);

  return {
    raw: str,
    formatted: dateObj.toLocaleString(),
    timestamp: dateObj.getTime(),
  };
}

const parsedDates = dates.map(parseDate);
const sortAsc = (arr) => [...arr].sort((a, b) => a.timestamp - b.timestamp);
const sortDesc = (arr) => [...arr].sort((a, b) => b.timestamp - a.timestamp);

export const DatesCard = () => {
  const [isAsc, setIsAsc] = useState(true);

  const handleSortToggle = () => setIsAsc((prev) => !prev);
  const sorted = isAsc ? sortAsc(parsedDates) : sortDesc(parsedDates);

  return (
    <div className="dates-container">
      <Card title="Список дат" className="dates-card">
        <List
          dataSource={sorted}
          renderItem={(item, index) => (
            <List.Item>
              <Space direction="vertical" size={0}>
                <strong>{index + 1}. {item.formatted}</strong>
                <span className="raw-date">{item.raw}</span>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      <Button
        onClick={handleSortToggle}
        type="primary"
        className="sort-button"
      >
        Сортировать: {isAsc ? "По убыванию" : "По возрастанию"}
      </Button>
    </div>
  );
};