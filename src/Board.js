import React, { useEffect } from 'react'

function Board(props) {
    useEffect(() => {
        function handleKeyDown(e) {
          // if user clicks backspace
          if (e.keyCode === 8) {
            props.setUserInp((prevVal) => prevVal.slice(0, -1));
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
            props.addToInp(e.key);
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
          <button onClick={() => props.addToInp(".")} className="inputsymbol">
            .
          </button>
          <button onClick={props.addParenthesis} className="inputsymbol">
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
                props.setUserInp((prevVal) => prevVal.slice(0, -1));
            }}
            className="inputsymbol"
          >
            &lt;=
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
  )
}

export default Board