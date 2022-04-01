import React, { useEffect } from "react";

function Board(props) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Enter") {
        props.setErr(false);
        return manageUserInp();
      }
      // if user clicks backspace
      if (e.keyCode === 8) {
        props.setUserInp((prevVal) => prevVal.slice(0, -1));
      }
      // if user types number
      if (
        // number row
        ((e.keyCode >= 48 && e.keyCode <= 57) ||
          // number pad
          (e.keyCode >= 96 && e.keyCode <= 105)) &&
        // special chars won't be added
        e.shiftKey === false
      ) {
        props.addToInp(e.key);
      }
      // add '+', '-', '.', '^', '(', or ')'
      if (
        e.key === "+" ||
        e.key === "-" ||
        e.key === "." ||
        e.key === "^" ||
        e.key === "(" ||
        e.key === ")"
      ) {
        props.addToInp(e.key);
      }
      // add '×'
      if (e.key === "*" || e.key === "x") {
        props.addToInp("×");
      }
      if (e.key === "/") {
        props.addToInp("÷");
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  // reset all settings to their default states
  function allClear() {
    props.setUserInp("");
    props.setErr(false);
    props.setOut("");
  }

  function manageUserInp() {
    props.setOut(() => {
      // if the input string's first character is '+', '^', '÷', '×' return error
      if (props.userInp.match(/^[+÷×^]/)) {
        props.setErr(true);
        return "Strange first character you have there";
      }
      // if there is nothing to retur
      if (props.userInp.length === 0) {
        props.setErr(true);
        return "There is nothing to see here. Move along";
      }
      // check if parentheses amount don't match
      const totalOpen = (props.userInp.match(/\(/g) || []).length;
      const totalClosed = (props.userInp.match(/\)/g) || []).length;

      if (totalClosed !== totalOpen) {
        props.setErr(true);
        return "Close your parentheses";
      }

      var compute = props.userInp;
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
            return props.doTheMath(parentheses);
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
                props.doTheMath(parentheses)
              );
              // set it to undefined so it can be reassigned to compute on the re-loop
              parentheses = undefined;
              break;
            }
          }
        }
      }
      // if compute does not contain any parentheses calculate it and return the value
      return props.doTheMath(compute);
    });
  }

  return (
    <main className="calculator">
      <div className="boards">
        <div className="numberboard">
          <button onClick={() => props.addToInp("7")} className="inputnumber">
            7
          </button>
          <button onClick={() => props.addToInp("8")} className="inputnumber">
            8
          </button>
          <button onClick={() => props.addToInp("9")} className="inputnumber">
            9
          </button>
          <button onClick={() => props.addToInp("4")} className="inputnumber">
            4
          </button>
          <button onClick={() => props.addToInp("5")} className="inputnumber">
            5
          </button>
          <button onClick={() => props.addToInp("6")} className="inputnumber">
            6
          </button>
          <button onClick={() => props.addToInp("1")} className="inputnumber">
            1
          </button>
          <button onClick={() => props.addToInp("2")} className="inputnumber">
            2
          </button>
          <button onClick={() => props.addToInp("3")} className="inputnumber">
            3
          </button>
          <button onClick={() => props.addToInp("0")} className="inputnumber">
            0
          </button>
          <button
            onClick={() => props.addToInp(".")}
            className="inputsymbol"
            id="periodsymbol"
          >
            .
          </button>
          <button
            onClick={props.addParenthesis}
            className="inputsymbol"
            id="parenthesessymbol"
          >
            ( )
          </button>
        </div>

        <div className="symbolboard">
          <button
            onClick={() => {
              props.setErr(false);
              manageUserInp();
            }}
            className="inputsymbol"
            id="equalssymbol"
            title="Get Result"
          >
            =
          </button>
          <button
            onClick={allClear}
            className="inputsymbol"
            id="allclearsymbol"
            title="All Clear"
          >
            Clear
          </button>

          <button onClick={() => props.addToInp("+")} className="inputsymbol">
            +
          </button>
          <button onClick={() => props.addToInp("÷")} className="inputsymbol">
            ÷
          </button>
          <button onClick={() => props.addToInp("×")} className="inputsymbol">
            &#215;
          </button>
          <button
            onClick={() => props.addToInp("-")}
            className="inputsymbol"
            id="minussymbol"
          >
            -
          </button>
          <button
            onClick={() => {
              props.addToInp("^");
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

export default Board;
