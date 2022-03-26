import { useState } from "react";

function App() {
  const [userInp, setUserInp] = useState('')
  const [out, setOut] = useState('')
  const [err, setErr] = useState(false)
  const [parenthesis, setParenthesis] = useState(true)
  
  function addToInp(val) {
    if (isNaN(userInp[userInp.length - 1]) && isNaN(val)) {
      deleteOneItem()
      console.log('test')
    }
    setUserInp(prevVal => prevVal + val)
  }
  
  function allClear() {
      setUserInp('')
      setErr(false)
      setOut('')
      setParenthesis(true)
  }

  function deleteOneItem() {
    setUserInp(prevVal => prevVal.slice(0, -1))
  }

  function addParenthesis() {
    if (!userInp.includes('(')) {
      setUserInp(prevVal => prevVal + '(')
      setParenthesis(false)
    }
    if (userInp.includes('(')) {
      setUserInp(prevVal => prevVal + ')')
      setParenthesis(true)
    }
  }

  function calculateString(str) {
    
    // remove the parentheses from the string
    if (str[0] === '(' && str[str.length - 1] === ')'){
      str = str.slice(1, str.indexOf(')'))
    }

    let tempStr = ''
    let mathArr = []
    
    // add the items from the string to an array
    for (let indexInStr = 0; indexInStr < str.length; indexInStr++) {
      
      // if the first character in the string is '-' or '(' add it instead of returning an error
      if (isNaN(str[indexInStr]) && (str[indexInStr] === '-' || str[indexInStr] === '(') && indexInStr === 0) {
        mathArr.push(str[indexInStr])
        indexInStr++
      }

      // as long the char in the string is a number or a period add it to tempStr
      while (!isNaN(str[indexInStr]) || str[indexInStr] === '.') {
        tempStr += str[indexInStr]
        indexInStr++
      }
      
      // if the character isn't a number put it at its own index in the array
      if (isNaN(str[indexInStr])) {
        mathArr.push(tempStr)
        mathArr.push(str[indexInStr])
        tempStr = ''
      }
    }
    
    // remove the final undefined from the array to clean it up
    mathArr = mathArr.slice(0, -1)

    // first complete all the divsion and multiplication
    var symbols = {symOne: '×', symTwo: '÷'}

    // if the symbols do not exist in the array, change the values to addition and subtraction
    if (!mathArr.includes(symbols.symOne) && !mathArr.includes(symbols.symTwo)) {
      symbols = {symOne: '+', symTwo: '-'}
    }
    
    // the length of the array will change so keeping a constant will prevent the for loop from breaking
    const mathArrLength = mathArr.length

    // while mathArr includes exponents calculate it before calculating other stuff
    while (mathArr.includes('^')) {
      const exponentInd = mathArr.indexOf('^')
      var exponent = (mathArr[exponentInd-1]*1) ** (mathArr[exponentInd+1]*1)
      mathArr.splice(exponentInd-1, 3, exponent)
    }
    
    // as long as mathArray contains mathematical symbols calculate stuff
    while (mathArr.includes(symbols.symOne) || mathArr.includes(symbols.symTwo)) {

      for (let mathArrInd = 0; mathArrInd < mathArrLength; mathArrInd++) {

        let mathArrVal = mathArr[mathArrInd]

        // this will check if the symbol matches the one that should be calculating first
        if (mathArrVal === symbols.symOne || mathArrVal === symbols.symTwo) {

          // do multiplication
          if (mathArrVal === '×') {
          var multiplication = (mathArr[mathArrInd-1]*1) * (mathArr[mathArrInd+1]*1)
          mathArr.splice(mathArrInd-1, 3, multiplication)
          mathArrInd = 0
          }
          // do division
          if (mathArrVal === '÷') {
            var division = (mathArr[mathArrInd-1]*1) / (mathArr[mathArrInd+1]*1)
            mathArr.splice(mathArrInd-1, 3, division)
            mathArrInd = 0
          }
          // do addition
          if (mathArrVal === '+') {
            var addition = (mathArr[mathArrInd-1]*1) + (mathArr[mathArrInd+1]*1)
            mathArr.splice(mathArrInd-1, 3, addition)
            mathArrInd = 0
          }
          // do subtraction
          if (mathArrVal === '-') {
            var subtraction = (mathArr[mathArrInd-1]*1) - (mathArr[mathArrInd+1]*1)
            mathArr.splice(mathArrInd-1, 3, subtraction)
            mathArrInd = 0
          }
        }
      }

      // once the for loop is completed all the chars switch to addition and subtraction
      symbols = {symOne: '+', symTwo: '-'}

    }
    return mathArr
  }

  function calculateStuff() {

    setOut(() => {
      let finalEval = userInp
      while (finalEval.includes('(') && finalEval.includes(')')) {
        let computeParentheses = userInp.slice(userInp.indexOf('('), userInp.indexOf(')') + 1)
        const something = calculateString(computeParentheses)
        finalEval = userInp.replace(computeParentheses, something)
      }
      return calculateString(finalEval)
    })
  }

  return (
    <main className="calculator">
      <h1>Calculator</h1>

      <div className={err ? "showvalerr": "showval"}>

        <div className="inputval"><button onClick={() => {
          calculateStuff()
        }} 
              id="equalssymbol"
              title='Get Result'
            >
              =
            </button> 
            <p>
              &nbsp;&nbsp;{userInp}
            </p> 
        </div>

        {err && <div className="outputerr"><h4>{out}</h4></div>}
        {!err && <div className="outputval">Result:&nbsp;{out}</div>}
      </div>

      <div className="boards">
        <div className="numberboard">

          <button 
            onClick={() => 
              addToInp('7')
            } 
            className="inputnumber"
          >
            7
          </button>
          <button onClick={() => 
              addToInp('8')
            } 
            className="inputnumber"
          >
            8
          </button>
          <button onClick={() => 
              addToInp('9')
            }
            className="inputnumber"
          >
            9
          </button>
          <button onClick={() => 
              addToInp('4')
            } 
            className="inputnumber"
          >
            4
          </button>
          <button onClick={() => 
              addToInp('5')
            }  
            className="inputnumber"
          >
            5
          </button>
          <button onClick={() => 
              addToInp('6')
            } 
            className="inputnumber"
          >
            6
          </button>
          <button onClick={() => 
              addToInp('1')
            }
            className="inputnumber"
          >
            1
          </button>
          <button onClick={() => 
              addToInp('2')
            }
            className="inputnumber"
          >
            2
          </button>
          <button onClick={() => 
              addToInp('3')
            } 
            className="inputnumber"
          >
            3
          </button>
          <button onClick={() => 
              addToInp('0')
            } 
            className="inputnumber"
          >
            0
          </button>
          <button onClick={() => 
            addToInp('.')
            } 
            className="inputsymbol" 
          >
            .
          </button>
          <button onClick={addParenthesis} 
            className="inputsymbol" 
          >
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
              onClick={deleteOneItem} 
              className="inputsymbol"
            >
              &lt;=
            </button>
            <button 
              onClick={() => 
                addToInp('+')
              } 
              className="inputsymbol"
            >
              +
            </button>
            <button onClick={() => 
                addToInp('÷')
              } 
              className="inputsymbol" 
            >
              ÷
            </button>
            <button onClick={() => 
              addToInp('×')
            } 
              className="inputsymbol" 
            >
              &#215;
            </button>
            <button onClick={() => 
              addToInp('-')
            } 
              className="inputsymbol" 
              id="minussymbol"
            >
              -
            </button>
            <button onClick={() => {
              addToInp('^')
            }} 
              className="inputsymbol" 
              id='exponentsymbol'
            >
              &#119909;
              <sup>
                x
              </sup>
            </button>
          </div>
        </div>
    </main>
  );
}

export default App;
