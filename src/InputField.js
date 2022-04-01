import React, { useEffect } from "react";

function InputField(props) {
  
  // assign the prop to its original name for better readability
  const userInp = props.userInp
  const setErr = props.setErr
  const doTheMath = props.doTheMath
  const setOut = props.setOut
  
  // Odd bug here. Instead of submitting the user input when a user presses enter the last character of the user input repeatedly gets submitted
  useEffect(() => {
    function pressEnter(e) {
        if (e.key === 'Enter') {
          setErr(false)
            return manageUserInp()
        }
    }
    document.addEventListener("keydown", pressEnter);
    return function cleanup() {
      document.removeEventListener("keydown", pressEnter);
    };
  })
  
  function manageUserInp() {
    
    setOut(() => {
      // if the input string's first character is '+', '^', '÷', '×' return error
      if (userInp.match(/^[+÷×^]/)) {
        setErr(true)
        return 'Strange first character you have there'
      }
      // if there is nothing to retur
      if (userInp.length === 0) {
        setErr(true);
        return "There is nothing to see here. Move along";
      }
      // check if parentheses amount don't match
      const totalOpen = (userInp.match(/\(/g) || []).length;
      const totalClosed = (userInp.match(/\)/g) || []).length;

      if (totalClosed !== totalOpen) {
        setErr(true);
        return "Close your parentheses";
      }

      var compute = userInp;
      
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
                doTheMath(parentheses)
              );
              // set it to undefined so it can be reassigned to compute on the re-loop
              parentheses = undefined;
              break;
            }
          }
        }
      }
      // if compute does not contain any parentheses calculate it and return the value
      return doTheMath(compute);
    });
  }

  function renderedInput(input) {
    input = input.replace(/\^(\d+)?(\(.*\))?/g, "<sup>$1$2</sup>")
    return <div dangerouslySetInnerHTML={{ __html: input}} className='renderinput'/>
  }

  function renderedOutput(output) {
    if (output[0]) {
      output = output.toString()
      if (output.includes('.')) {
        return output
      }
      output = output.replace(/(?<=\d)(?=(?:\d\d\d)+(?!\d))/g, ",")
      return output
    }
  }

  return (
    <div>
      <h1>Calculator</h1>
      <div
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

          &nbsp;&nbsp;{renderedInput(userInp)}
        </div>

        {props.err ? (
          <div className="outputerr"><p>{props.out}</p></div>
        ) : (
          <div className="outputval"><p>{renderedOutput(props.out)}</p></div>
        )}
      </div>
    </div>
  );
}

export default InputField;
