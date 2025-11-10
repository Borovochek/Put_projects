import { Tabs, Card } from "antd";
import { DatesCard } from "./components/js-tab/DatesCard.jsx";
import { ArrayCard } from "./components/js-tab/ArrayCard.jsx";
import "./App.css"; // подключаем глобальные стили

function App() {
  const items = [
    {
      key: "1",
      label: "JS",
      children: (
        <div className="tab-content">
          <DatesCard />

          <ArrayCard />
        </div>
      ),
    },
    {
      key: "2",
      label: "Конвертер",
      children: "Здесь будет конвертер",
    },
    {
      key: "3",
      label: "Остальное",
      children: "Другие функции",
    },
  ];

  return (
    <div className="app-container">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

export default App;
