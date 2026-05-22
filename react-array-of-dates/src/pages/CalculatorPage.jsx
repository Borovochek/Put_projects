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
    console.log(value);
    // Если ждём второе число — очищаем дисплей
    if (waitingForSecondNumber) {
      // setDisplay(String(value)); Не нужно, т.к. данные в data уже строки
      setDisplay(value);
      setWaitingForSecondNumber(false);
      return;
    }

    // Запрещаем вторую точку в числе
    if (value === '.' && display.includes('.')) return;

    // Убираем ведущий ноль
    if (display === '0' && value !== '.') {
      // setDisplay(String(value));  Не нужно, т.к. данные в data уже строки
      setDisplay(value);
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
      case 'number': return () => handleNumberClick(value); //для вызова нужна стрелочная функция, т.к. функция вызывается с аргументами(value)
      case 'operator': return () => handleOperatorClick(value);
      case 'equal': return handleEqual; //для вызова не нужна стрелочная функция, т.к. функция вызывается без аргументами(value)
      case 'clear': return handleClear;
      case 'delete': return handleDelete;
      default: return () => { };
    }
  };

  return (
    <div className="calculator">
      <div className="calculator__display">
        <input className="calculator__input" type="text" value={display} readOnly />
      </div>
      <div className="calculator__buttons">
        {buttons.map((btn) => {
          // let modifier = '';
          // if (btn.type === 'operator') modifier = 'operator';
          // else if (btn.value === '=') modifier = 'equal';
          // else if (btn.value === 'C') modifier = 'clear';
          // else if (btn.value === '←') modifier = 'delete';

          // const buttonClass = `calculator__button${modifier ? ` calculator__button--${modifier}` : ''}`; 
          // Не нужно, т.к. в data уже есть action и можно присвоить всем эл-м доп.классы
          const buttonClass = `calculator__button calculator__button--${btn.action}`;
          return (
            <button
              key={btn.value}
              className={buttonClass}
              // onClick={() => getHandler(btn.action, btn.value)} Передавать в обработчик стрелочную функцию не верно! При клике стрелка вызывает getHandler, 
              //который внутри вызывает handleNumberClick(value) (побочный эффект). Сама функция не возвращается, но вызов происходит.
              onClick={getHandler(btn.action, btn.value)} //при рендере компонента функция вызывается сразу и возвращает либо стрелочную функцию (для number и op) 
              //либо ссылку на обычную для остальных значений они сохраняются в onClick и вызываются по клику
            >                                                    
              {btn.value}
            </button>
          );
        })}
      </div>
    </div>
  );
};