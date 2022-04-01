import React, { useEffect } from "react";

function InputField(props) {
  function renderedInput(input) {
    input = input.replace(/\^(\d+)?(\(.*\))?/g, "<sup>$1$2</sup>");
    return (
      <div
        dangerouslySetInnerHTML={{ __html: input }}
        className="renderinput"
      />
    );
  }

  function renderedOutput(output) {
    if (output[0]) {
      output = output.toString();
      if (output.includes(".")) {
        return output;
      }
      output = output.replace(/(?<=\d)(?=(?:\d\d\d)+(?!\d))/g, ",");
      return output;
    }
  }

  function newInputFromAnswer() {
    if (!props.err && props.out !== "") {
      props.setUserInp(props.out.toString());
      props.setOut("");
      return;
    }
  }

  return (
    <div>
      <h1>Calculator</h1>
      <div title="Type to or click buttons to add to the input">
        <div className="inputval">
          <button
            onClick={() => {
              props.setUserInp((prevVal) => prevVal.slice(0, -1));
            }}
            title="Backspace"
            className="inputareasymbols"
          >
            ←
          </button>
          {renderedInput(props.userInp)}
        </div>

        {props.err ? (
          <div className="outputerr">
            <p id="outputtexterr">{props.out}</p>
          </div>
        ) : (
          <div className="outputval">
            <p id="outputtext">{renderedOutput(props.out)}</p>
            <button
              onClick={() => {
                newInputFromAnswer();
              }}
              title="Calculate again from result"
              className="inputareasymbols"
            >
              ANS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InputField;
