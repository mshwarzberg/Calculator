import React, { useEffect } from "react";

function InputField(props) {
  
  // assign the prop to its original name for better readability
  const userInp = props.userInp
  const setErr = props.setErr
  const calculateString = props.calculateString
  const setOut = props.setOut
  
  useEffect(() => {
    function pressEnter(e) {
        if (e.keyCode === 13) {
            manageUserInp()
        }
    }
    document.addEventListener("keydown", pressEnter);
    return function cleanup() {
      document.removeEventListener("keydown", pressEnter);
    };
  })
  
  function manageUserInp() {
    setOut(() => {
      if (userInp.length === 0) {
        setErr(true);
        return "There is nothing to see here. Move along";
      }
      // check if parentheses amount don't match
      const totalOpen = (userInp.match(/\(/g) || []).length;
      const totalClosed = (userInp.match(/\)/g) || []).length;

      if (totalClosed !== totalOpen) {
        setErr(true);
        return "You should close yo goddamn parentheses";
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
            return props.calculateString(parentheses);
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
    <div>
      <h1>Calculator</h1>
      <div
        className="showval"
        title="Type to or click buttons to add to the input"
      >
        <div className="inputval">
          <button
            onClick={() => {
              setErr(false);
              manageUserInp();
            }}
            id="equalssymbol"
            title="Get Result"
          >
            =
          </button>

          {<p>&nbsp;&nbsp;{props.userInp}</p>}
        </div>

        {props.err ? (
          <div className="outputerr">{props.out}</div>
        ) : (
          <div className="outputval">Result:&nbsp;{props.out}</div>
        )}
      </div>
    </div>
  );
}

export default InputField;
