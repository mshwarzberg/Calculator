import { useState } from "react";
import Board from "./Board";
import InputField from "./InputField";

function App() {
  const [userInp, setUserInp] = useState("6÷(0-1)");
  const [out, setOut] = useState("");
  const [err, setErr] = useState(false);

  
  function addToInp(val) {
    var lastItem = userInp[userInp.length - 1];
    // if the previous character in the input is a non number or one of the three chars mentioned replace the character with the new input
    if (
      isNaN(lastItem) &&
      isNaN(val) &&
      lastItem !== "." &&
      lastItem !== "(" &&
      lastItem !== ")"
    ) {
      //
      setUserInp((prevVal) => prevVal.slice(0, -1));
    }
    setUserInp((prevVal) => prevVal + val);
  }

  function addParenthesis() {
    // count the amount of times the opening and closing parentheses appear in userInp
    var openParent = (userInp.match(/\(/g) || []).length;
    var closeParent = (userInp.match(/\)/g) || []).length;
    const prevItem = userInp[userInp.length - 1];

    // example: '32+423/(342-'
    // if the user presses the parentheses button it should close.

    // if they match open a new parentheses
    if (openParent === closeParent || (isNaN(prevItem) && prevItem !== ")")) {
      return setUserInp((prevVal) => prevVal + "(");
    }

    if (openParent > closeParent) {
      return setUserInp((prevVal) => prevVal + ")");
    }
  }

  function calculateString(str) {
    // this matches all the floats, negatives and integers in the string
    let mathArr = str.match(/([-]\d+)?(\d+[.]\d+)?(\d+)?/g)
    // this matches all the arithmetic symbols
    const symbolsInStr = str.match(/[+^÷×]/g)

    // this will be the index in the array of symbols
    let symbolsInStrInd = 0

    // insert the symbols from the array of symbols into the array of numbers at the index where regex didn't match anything (it returns an empty string)
    for (let arrInd = 0; arrInd < mathArr.length;arrInd++) {

      // if the index is empty (meaning it didn't match in regex), pull the value from the symbols array
      if (mathArr[arrInd] === '' && symbolsInStr) {
        mathArr[arrInd] = symbolsInStr[symbolsInStrInd]
        symbolsInStrInd++
      }
    }
    // add a '+' before every negative number to make sure it
    for (let arrInd = 0; arrInd+1 < mathArr.length; arrInd++) {
      if (mathArr[arrInd][0] === '-' && arrInd !== 0 && (mathArr[arrInd-1].match(/[^+÷×]/g))) {
        mathArr.splice(arrInd, 0, '+')
        arrInd++
      }
    }
    // remove the final undefined from the array to clean it up
    mathArr = mathArr.slice(0, -1);
    console.log(mathArr);
    // first complete all the divsion and multiplication
    var symbols = { symOne: "×", symTwo: "÷" };

    // if the symbols do not exist in the array, change the values to addition and subtraction
    if (
      !mathArr.includes(symbols.symOne) &&
      !mathArr.includes(symbols.symTwo)
    ) {
      
      symbols = { symOne: "+", symTwo: "-" };
    }

    // the length of the array will change so keeping a constant will prevent the for loop from breaking
    const mathArrLength = mathArr.length;

    // while mathArr includes exponents calculate it before calculating other stuff
    while (mathArr.includes("^")) {
      const exponentInd = mathArr.indexOf("^");
      var exponent =
        (mathArr[exponentInd - 1] * 1) ** (mathArr[exponentInd + 1] * 1);
      mathArr.splice(exponentInd - 1, 3, exponent);
    }
    // as long as mathArray contains mathematical symbols calculate stuff
    while (
      mathArr.includes(symbols.symOne) ||
      mathArr.includes(symbols.symTwo)
    ) {
      for (let mathArrInd = 0; mathArrInd < mathArrLength; mathArrInd++) {
        let mathArrVal = mathArr[mathArrInd];
        
        // this will check if the symbol matches the one that should be calculating first
        if (mathArrVal === symbols.symOne || mathArrVal === symbols.symTwo) {
          
          // do multiplication
          if (mathArrVal === "×") {
            var multiplication =
              mathArr[mathArrInd - 1] * 1 * (mathArr[mathArrInd + 1] * 1);
            mathArr.splice(mathArrInd - 1, 3, multiplication);
            mathArrInd = 0;
          }
          // do division
          if (mathArrVal === "÷") {
            var division = (mathArr[mathArrInd - 1]*1) / (mathArr[mathArrInd + 1]*1)
            mathArr.splice(mathArrInd - 1, 3, division);
            mathArrInd = 0;
          }
          // do addition
          if (mathArrVal === "+") {
            var addition =
              mathArr[mathArrInd - 1] * 1 + mathArr[mathArrInd + 1] * 1;
            mathArr.splice(mathArrInd - 1, 3, addition);
            mathArrInd = 0;
          }
          // do subtraction
          if (mathArrVal === "-") {
            var subtraction =
              mathArr[mathArrInd - 1] * 1 - mathArr[mathArrInd + 1] * 1;
            mathArr.splice(mathArrInd - 1, 3, subtraction);
            mathArrInd = 0;
          }
        }
      }
      // once the for loop is completed all the chars switch to addition and subtraction
      symbols = { symOne: "+", symTwo: "-" };
    }
    if (mathArr[0] === Infinity) {
      setErr(true);
      setOut("You tryna break the universe? You can't divide by zero");
      return;
    }
    return mathArr;
  }

  return (
    <div>
      <InputField
        setErr={setErr}
        userInp={userInp}
        setOut={setOut}
        err={err}
        out={out}
        calculateString={calculateString}
      />
      <Board
        addToInp={addToInp}
        setErr={setErr}
        setOut={setOut}
        setUserInp={setUserInp}
        addParenthesis={addParenthesis}
      />
    </div>
  );
}

export default App;
