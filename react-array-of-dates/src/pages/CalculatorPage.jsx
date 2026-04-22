import { useState } from 'react'
import { buttons } from '../Data/CalculatorBtns'
import '../css/Calculator.css'

export const CalculatorPage = () => {

  const [display, setDisplay] = useState('0');
  const [firstNumber, setFirstNumber] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondNumber, setWaitingForSecondNumber] = useState(false);


  // Обработка цифр и точки
  const handleNumberClick = (value) => {
    // Если ждём второе число — очищаем дисплей
    if (waitingForSecondNumber) {
      setDisplay(String(value));
      setWaitingForSecondNumber(false);
      return;
    }

    // Запрещаем вторую точку в числе
    if (value === '.' && display.includes('.')) return;

    // Убираем ведущий ноль
    if (display === '0' && value !== '.') {
      setDisplay(String(value));
    } else {
      setDisplay(display + value);
    }
  };

  // Обработка операций (+, -, *, /, ^)
  const handleOperatorClick = (op) => {
    const currentNumber = parseFloat(display);

    // Если уже есть операция и не ждём второе число вычисляем промежуточный результат
    if (firstNumber !== null && !waitingForSecondNumber) {
      const result = calculate(firstNumber, currentNumber, operation);
      setDisplay(String(result));
      setFirstNumber(result);
    } else {
      // Сохраняем текущее число как первое
      setFirstNumber(currentNumber);
    }

    setOperation(op);
    setWaitingForSecondNumber(true);
  };

  // Вычисление результата
  const handleEqual = () => {
    if (operation === null || firstNumber === null) return;

    const currentNumber = parseFloat(display);
    const result = calculate(firstNumber, currentNumber, operation);

    setDisplay(String(result));
    setFirstNumber(null);
    setOperation(null);
    setWaitingForSecondNumber(true);
  };

  // Очистка всего
  const handleClear = () => {
    setDisplay('0');
    setFirstNumber(null);
    setOperation(null);
    setWaitingForSecondNumber(false);
  };

  // Удаление последнего символа
  const handleDelete = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };
  // Округление цифр после запятой до 10
  const roundResult = (value) => {
    return Number(Number(value).toFixed(10));
  };

  const calculate = (a, b, op) => {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);
    let result;

    switch (op) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/':
        if (num2 === 0) return 'Ошибка';
        result = num1 / num2;
        break;
      case '^': result = Math.pow(num1, num2); break;
      default: return num2;
    }

    return roundResult(result);
  };

  // Диспетчер обработчиков (по action)
  const getHandler = (action, value) => {
    switch (action) {
      case 'number': return () => handleNumberClick(value);
      case 'operator': return () => handleOperatorClick(value);
      case 'equal': return handleEqual;
      case 'clear': return handleClear;
      case 'delete': return handleDelete;
      default: return () => { };
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator-display">
        <input type="text" value={display} readOnly />
      </div>
      <div className="calculator-buttons">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            className={`${btn.type === 'operator' ? 'operator' : ''} 
                   ${btn.value === '=' ? 'equal' : ''}
                   ${btn.value === 'C' ? 'clear' : ''}
                   ${btn.value === '←' ? 'delete' : ''}`}
            onClick={getHandler(btn.action, btn.value)}
          >
            {btn.value}
          </button>
        ))}
      </div>
    </div>
  );
};
