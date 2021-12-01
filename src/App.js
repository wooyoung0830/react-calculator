import { useReducer } from 'react';
import DigitButton from './DigitButton.js';
import OperationButton from './OperationButton.js';
import './App.css';

export const ACTIONS = {
  ADD_DIGIT : 'add-digit', 
  CHOOSE_OPERATION : 'choose-operation',
  CLEAR : 'clear',
  DELETE_DIGIT : 'delete-digit',
  RESULT :'result'
}

function reducer(state, { type, payload }) {
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          currentOperand : payload.digit,
          overwrite : false,
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null){
        return state
      }
      if(state.currentOperand == null){
        return{ // 연산자가 이미 선택되었지만 다시 클릭해 수정하려고 할 때
          ...state,
          operation : payload.operation,
        }
      }
      if(state.previousOperand == null){
        return { // 연산자 처음 선택
          ...state,
          operation : payload.operation,
          previousOperand :state.currentOperand,
          currentOperand : null,
        }
      }
      return { // currentOperand에 숫자를 입력했고 연산자를 또 선택할 경우
        ...state,
        previousOperand : evaluate(state),
        operation : payload.operation,
        currentOperand: null,
      }

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand : null,
        }
      }
      if(state. currentOperand == null) return state
      if(state.currentOperand.length == 1) {
        return{
          ...state,
          currentOperand:null,
        }
      }
      return {
        ...state,
        currentOperand : state.currentOperand.slice(0, -1)
      }

    case ACTIONS.CLEAR :
      return{ } //clear the output
      
    case ACTIONS.RESULT :
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null){
        return state // 하나라도 만족하지 않으면 상태 그대로 출력( 아무런 화면 변화 X)
      }
      return { 
        ...state,
        overwrite: true,
        previousOperand : null,
        operation : null, 
        currentOperand : evaluate(state),
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation },){
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if(isNaN(prev) || isNaN(current)) return ""
  let computation =""
  switch(operation){
    case "+" :
      computation = prev + current;
      break;
    case "-" :
      computation = prev - current;
      break;
    case "x" :
      computation = prev * current;
      break;
    case "÷" :
      computation = prev / current;
      break;
  }
  return computation.toString()
}

// 숫자 천자리 끊기
const INTEGER_FORMATTER = new Intl.NumberFormat( "en-us",{
  maximumFractionDigits : 0,
})
function formatOperand(operand) {
  if(operand == null ) return
  const [interger, decimal] = operand.split('.')
  if(decimal == null ) return INTEGER_FORMATTER.format(interger)
  return `${INTEGER_FORMATTER.format(interger)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer,{})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="x" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.RESULT})}>=</button>
    </div>
  );
}

export default App;
