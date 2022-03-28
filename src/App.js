import { useState, useEffect } from "react";

function App() {
  const [userInp, setUserInp] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      // if user clicks backspace
      if (e.keyCode === 8) {
        setUserInp((prevVal) => prevVal.slice(0, -1));
      }
      // if user clicks enter
      if (e.keyCode === 13) {
        manageUserInp();
      }
      // if user clicks number
      if (
        // number row
        ((e.keyCode >= 48 && e.keyCode <= 57) ||
          // number pad
          (e.keyCode >= 96 && e.keyCode <= 105)) &&
        // special chars won't be added
        e.shiftKey === false
      ) {
        addToInp(e.key);
      }
      // add '+', '-', '.', '^', '(', ')'
      if (
        e.key === "+" ||
        e.key === "-" ||
        e.key === "." ||
        e.key === "^" ||
        e.key === "(" ||
        e.key === ")"
      ) {
        addToInp(e.key);
      }
      // add '×'
      if (e.key === "*" || e.key === "x") {
        addToInp("×");
      }
      if (e.key === "/") {
        addToInp("÷");
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [addToInp, manageUserInp]);
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

  // reset all settings to their default states
  function allClear() {
    setUserInp("");
    setErr(false);
    setOut("");
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
    let tempStr = "";
    let mathArr = [];

    // add the items from the string to an array
    for (let indexInStr = 0; indexInStr < str.length; indexInStr++) {
      // if the first character in the string is '-' or '(' add it instead of returning an error
      if (
        isNaN(str[indexInStr]) &&
        (str[indexInStr] === "-" || str[indexInStr] === "(") &&
        indexInStr === 0
      ) {
        mathArr.push(str[indexInStr]);
        indexInStr++;
      }

      // as long the char in the string is a number or a period add it to tempStr
      while (!isNaN(str[indexInStr]) || str[indexInStr] === ".") {
        tempStr += str[indexInStr];
        indexInStr++;
      }

      // if the character isn't a number put it at its own index in the array
      if (isNaN(str[indexInStr])) {
        mathArr.push(tempStr);
        mathArr.push(str[indexInStr]);
        tempStr = "";
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
            var division =
              (mathArr[mathArrInd - 1] * 1) / (mathArr[mathArrInd + 1] * 1);
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
    return mathArr;
  }

  function manageUserInp() {

    
    setOut(() => {
      if (userInp.length === 0) {
        return 'Nothing to see here. Move along'
      }
      // check if parentheses amount don't match
      const totalOpen = (userInp.match(/\(/g) || []).length;
      const totalClosed = (userInp.match(/\)/g) || []).length;

      if (totalClosed !== totalOpen) {
        return "Close yo goddamn parentheses";
      }

      let compute = userInp;
      var parentheses;
      while (!Number(compute)) {
        // only assign compute to parentheses if current is undefined because if the value is reset it will loop forever since it will constantly be reassigned to its original value.
        if (parentheses === undefined) {
          parentheses = compute;
        }

        // these will count up the amount of '(' and ')' in parentheses
        let amountOfOpen = 0;
        let amountOfClosed = 0;

        // Loop through parentheses to see if there are other sets of parentheses inside.
        for (let strInd = 0; strInd < parentheses.length; strInd++) {
          // if it doesn't include other sets calculate the value of the arithmetic set and return it
          if (!parentheses.includes("(") && !parentheses.includes(")")) {
            return calculateString(parentheses);
          }
          if (parentheses[strInd] === "(") {
            amountOfOpen++;
          }
          if (parentheses[strInd] === ")") {
            amountOfClosed++;
          }
          // if '(' and ')' equal the same amount and ')' does not equal zero it means that there is a valid set of parentheses inside, so that will be considered the new parentheses.
          if (amountOfClosed === amountOfOpen && amountOfClosed !== 0) {
            const a = parentheses.indexOf("(");
            const b = strInd;
            parentheses = parentheses.slice(a + 1, b);
            // if the new sliced and diced string does not include subsets of parentheses
            if (!parentheses.includes("(") && !parentheses.includes(")")) {
              const insertVal = "(" + parentheses + ")";
              // swap out the parentheses value for a new shiny parentheses-less value and assign it to compute so it can be checked again.
              compute = compute.replace(
                // the old parentheses value
                insertVal,
                // the new shiny parentheses-less value
                calculateString(parentheses)
              );
              // set it to undefined so it can be reassigned to compute on the re-loop
              parentheses = undefined;
              break;
            }
          }
        }
      }
      // if compute does not contain any parentheses calculate it and return the value
      return calculateString(compute);
    });
  }

  return (
    <main className="calculator">
      <h1>Calculator</h1>

      <div className={err ? "showvalerr" : "showval"} title='type to add to the input'>
        <div className="inputval">
          <button
            onClick={() => {
              manageUserInp();
            }}
            id="equalssymbol"
            title="Get Result"
          >
            =
          </button>
          {<p>&nbsp;&nbsp;{userInp}</p>}
        </div>

        {err && (
          <div className="outputerr">
            <h4>{out}</h4>
          </div>
        )}
        {!err && <div className="outputval">Result:&nbsp;{out}</div>}
      </div>

      <div className="boards">
        <div className="numberboard">
          <button onClick={() => addToInp("7")} className="inputnumber">
            7
          </button>
          <button onClick={() => addToInp("8")} className="inputnumber">
            8
          </button>
          <button onClick={() => addToInp("9")} className="inputnumber">
            9
          </button>
          <button onClick={() => addToInp("4")} className="inputnumber">
            4
          </button>
          <button onClick={() => addToInp("5")} className="inputnumber">
            5
          </button>
          <button onClick={() => addToInp("6")} className="inputnumber">
            6
          </button>
          <button onClick={() => addToInp("1")} className="inputnumber">
            1
          </button>
          <button onClick={() => addToInp("2")} className="inputnumber">
            2
          </button>
          <button onClick={() => addToInp("3")} className="inputnumber">
            3
          </button>
          <button onClick={() => addToInp("0")} className="inputnumber">
            0
          </button>
          <button onClick={() => addToInp(".")} className="inputsymbol">
            .
          </button>
          <button onClick={addParenthesis} className="inputsymbol">
            ( )
          </button>
        </div>

        <div className="symbolboard">
          <button
            onClick={allClear}
            className="inputsymbol"
            id="allclearsymbol"
          >
            AC
          </button>
          <button
            onClick={() => {
              setUserInp((prevVal) => prevVal.slice(0, -1));
            }}
            className="inputsymbol"
          >
            &lt;=
          </button>
          <button onClick={() => addToInp("+")} className="inputsymbol">
            +
          </button>
          <button onClick={() => addToInp("÷")} className="inputsymbol">
            ÷
          </button>
          <button onClick={() => addToInp("×")} className="inputsymbol">
            &#215;
          </button>
          <button
            onClick={() => addToInp("-")}
            className="inputsymbol"
            id="minussymbol"
          >
            -
          </button>
          <button
            onClick={() => {
              addToInp("^");
            }}
            className="inputsymbol"
            id="exponentsymbol"
          >
            &#119909;
            <sup>x</sup>
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
