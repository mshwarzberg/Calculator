import { useState } from "react";

function App() {
  const [userInp, setUserInp] = useState('')
  const [out, setOut] = useState('')
  const [err, setErr] = useState(false)

  function addToInp(val) {
    setUserInp(prevVal => prevVal + val)
  }
  
  function calculateStuff() {

    setOut(() => {
  
      let calcInp = userInp
      let arrOfInps = []
      let numStr = ''

      for (let valInInp = 0; valInInp <= userInp.length; valInInp++) {

        while (!isNaN(calcInp[valInInp])) {
          numStr += calcInp[valInInp]
          valInInp++
        } 

        if (isNaN(calcInp[valInInp])) {
          if ((valInInp === 0 && calcInp[valInInp] !== '-') || (isNaN(calcInp[valInInp - 1]))) {
            setErr(true)
            return 'ERROR: VALUE IS NOT VALID'
          }
          arrOfInps.push(numStr)
          arrOfInps.push(calcInp[valInInp])
          numStr = ''
        }

        if (arrOfInps[valInInp] === '') {
          setErr(true)
          return 'ERROR: VALUE IS NOT VALID'
        }
      }
      
      var symbols = {symOne: 'x', symTwo: '÷'}
      const arrLength = arrOfInps.length

      if (!arrOfInps.includes(symbols.symOne) && !arrOfInps.includes(symbols.symTwo)) {
        symbols = {symOne: '+', symTwo: '-'}
      }

      while (arrOfInps.includes(symbols.symOne) || arrOfInps.includes(symbols.symTwo)) {
        
        for (let strInd = 0; strInd + 1 <= arrLength; strInd++) {
          const strChar = arrOfInps[strInd]
          
          if (strChar === symbols.symTwo || strChar === symbols.symOne) {
            if (strChar === 'x') {
              
              let multiply = arrOfInps[strInd-1] * arrOfInps[strInd+1]
              arrOfInps.splice(strInd-1, 3, multiply)
              strInd = 0
            } else if (strChar === '÷') {
              let divide = arrOfInps[strInd-1] / arrOfInps[strInd+1]
              arrOfInps.splice(strInd-1, 3, divide)
              strInd = 0
            } else if (strChar === '+') {
              let add = (arrOfInps[strInd-1]*1) + (arrOfInps[strInd+1]*1)
              arrOfInps.splice(strInd-1,3, add)
              strInd = 0
            } else if (strChar === '-') {
              let subtract = (arrOfInps[strInd-1]*1) - (arrOfInps[strInd+1]*1)
              arrOfInps.splice(strInd-1,3, subtract)
              strInd = 0
            }
          }
        }
        symbols = {symOne: '+', symTwo: '-'}
      }

      
      if (isNaN(arrOfInps[0])) {
        setErr(true)
        return 'ERROR: VALUE IS NOT VALID'
      } 
      if (arrOfInps[0] === Infinity) {
        setErr(true)
        return 'ERROR: CANNOT DIVIDE BY ZERO'
      }

      setErr(false)
      return arrOfInps
      
    })
    }
    
  return (
    <main className="calculator">
      <h1>Calculator</h1>

      <div className={err ? "showvalerr": "showval"}>
        <div className="inputval">=&gt;&nbsp;{userInp}</div>
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
            addToInp('(')
            } 
            className="inputsymbol" 
          >
            (
          </button>
          <button onClick={() => 
            addToInp(')')
            } 
            className="inputsymbol" 
          >
            )
          </button>
        </div>

        <div className="symbolsboard">
            <button onClick={() => 
              calculateStuff()
            } 
              className="inputsymbol"
              id="equalssymbol"
            >
              =
            </button>
            <button 
              onClick={() => {
                setUserInp('')
                setErr(false)
                setOut('')
              }} 
              className="inputsymbol"
            >
              AC
            </button>
            <button 
              onClick={() => 
                setUserInp(
                  prevVal => prevVal.slice(0,-1)
                )} 
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
              addToInp('x')
            } 
              className="inputsymbol" 
            >
              x
            </button>
            <button onClick={() => 
              addToInp('-')
            } 
              className="inputsymbol" 
              id="minussymbol"
            >
              -
            </button>
          </div>
        </div>
    </main>
  );
}

export default App;
