import React, { useState } from "react";
import Board from "./Components/Board";
import InputField from "./Components/InputField";

function App() {
  // these should be self explanatory
  const [userInp, setUserInp] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState(false);
  // handle user input
  function addToInp(val) {
    const lastItem = userInp[userInp.length - 1];
    // if there is a period in the current 'number set' (meaning it's already a float) don't allow another period
    if (val === ".") {
      for (let ind = userInp.length - 1; ind >= 0; ind--) {
        if (userInp[ind] === ".") {
          return;
        }
        // if the character next up in the string is a special char it means the number 'checked' is not already a float
        if (isNaN(userInp[ind])) {
          break;
        }
      }
    }
    // prevent user from adding multiple arithemitc symbols in a row. If the previous char in the input is already a symbol the current character will replace the previous one.
    if (
      isNaN(lastItem) &&
      isNaN(val) &&
      lastItem !== "." &&
      lastItem !== "(" &&
      lastItem !== ")" &&
      val !== "("
    ) {
      setUserInp((prevVal) => prevVal.slice(0, -1));
    }
    // if a user adds a number after closing parentheses, or if a user adds opening parentheses and the previous character is a number, automatically add a multiplication symbol beforehand
    if (
      (lastItem === ")" && (Number(val) || val === "(")) ||
      (val === "(" && Number(lastItem))
    ) {
      setUserInp((prevVal) => prevVal + "×");
    }

    setUserInp((prevVal) => prevVal + val);
  }

  // handle adding parentheses
  function addParenthesis() {
    // count the amount of times the opening and closing parentheses appear in userInp
    var openParent = (userInp.match(/\(/g) || []).length;
    var closeParent = (userInp.match(/\)/g) || []).length;
    const prevItem = userInp[userInp.length - 1];

    // if the amount of times '(' and ')' show up are equivalent or if the last item is an arithmetic symbol open new parentheses
    if (openParent === closeParent || (isNaN(prevItem) && prevItem !== ")")) {
      return addToInp("(");
    }
    // if there are more '(' than ')' and the previous statements are false close the previous parentheses
    if (openParent > closeParent) {
      return addToInp(")");
    }
  }
  // handle the math. This function will run multiple times if there are parentheses involved.
  function doTheMath(str) {
    // this matches all the floats, negatives and integers in the string
    let mathArr = str.match(/([-]\d+[.]\d+)?([-]\d+)?(\d+[.]\d+)?(\d+)?/g);
    // this matches all the arithmetic symbols
    const symbolsInStr = str.match(/[+^÷×]/g);

    // this will be the index in the array of symbols
    let symbolsInStrInd = 0;
    // insert the symbols from the array of symbols into the array of numbers at the index where regex didn't match anything (it returns an empty string)
    for (let arrInd = 0; arrInd < mathArr.length; arrInd++) {
      // if the index is empty (meaning it didn't match in regex), pull the value from the symbols array
      if (mathArr[arrInd] === "" && symbolsInStr) {
        mathArr[arrInd] = symbolsInStr[symbolsInStrInd];
        symbolsInStrInd++;
      }
    }
    // add a '+' before every negative number. Pretty specific example: 6÷(0-1) would return a 'divided by zero error' because the 0 won't go away, and the program would read it as 6÷0-1
    for (let arrInd = 0; arrInd + 1 < mathArr.length; arrInd++) {
      // check if the first character in each string is a '-', and that it's not the first item in the array, and that the previous item in array isn't an arithmetic symbol.
      if (
        mathArr[arrInd][0] === "-" &&
        arrInd !== 0 &&
        mathArr[arrInd - 1].match(/[^+÷×]/g)
        ) {
          // insert '+' into the previous slot in the array
          mathArr.splice(arrInd, 0, "+");
          arrInd++;
        }
      }
      // remove the final undefined from the array to clean it up
      mathArr = mathArr.slice(0, -1);
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
    
    // calculate exponents before other arithmetics.
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
        // this will check if the symbol matches the one that should be calculating first. Without this, as its looping it'll ignore the symbols and do calculations in the wrong order.
        if (mathArrVal === symbols.symOne || mathArrVal === symbols.symTwo) {
          // do multiplication
          if (mathArrVal === "×") {
            var multiplication =
              // the x*1 is to make sure that the numbers are treated as such, rather than strings
              mathArr[mathArrInd - 1] * 1 * (mathArr[mathArrInd + 1] * 1);
            // remove the three items in the array that the calculation was completed on and replace it with the result
            mathArr.splice(mathArrInd - 1, 3, multiplication);
            mathArrInd = 0;
          }
          // do division
          if (mathArrVal === "÷") {
            // ↑↑↑
            var division =
              (mathArr[mathArrInd - 1] * 1) / (mathArr[mathArrInd + 1] * 1);
            mathArr.splice(mathArrInd - 1, 3, division);
            mathArrInd = 0;
          }
          // do addition
          if (mathArrVal === "+") {
            // ↑↑↑
            var addition =
              mathArr[mathArrInd - 1] * 1 + mathArr[mathArrInd + 1] * 1;
            mathArr.splice(mathArrInd - 1, 3, addition);
            mathArrInd = 0;
          }
          // do subtraction
          if (mathArrVal === "-") {
            // ↑↑↑
            var subtraction =
              mathArr[mathArrInd - 1] * 1 - mathArr[mathArrInd + 1] * 1;
            mathArr.splice(mathArrInd - 1, 3, subtraction);
            mathArrInd = 0;
          }
        }
      }
      // once multiplication and division are completed, do addition and subtraction
      symbols = { symOne: "+", symTwo: "-" };
    }
    if (mathArr[0] === 0) {
      return '0'
    }
    // if a user tries to divide by zero, or give a calculation that returns a value that is too high.
    if (mathArr[0] === Infinity || isNaN(mathArr[0])) {
      setErr(true);
      return setOut("Can't divide by zero");
    }
    return mathArr;
  }

  return (
    <div className="block">
      <InputField
        userInp={userInp}
        setUserInp={setUserInp}
        out={out}
        setOut={setOut}
        err={err}
      />
      <Board
        userInp={userInp}
        setUserInp={setUserInp}
        err={err}
        setErr={setErr}
        setOut={setOut}
        addToInp={addToInp}
        addParenthesis={addParenthesis}
        doTheMath={doTheMath}
      />
    </div>
  );
}

export default App;
