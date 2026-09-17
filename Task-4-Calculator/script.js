/* =================================
   STYLECALC CALCULATOR
================================= */


/* =================================
   VARIABLES
================================= */

let currentNumber = "0";

let previousNumber = "";

let operator = null;

let shouldResetDisplay = false;


/* =================================
   DISPLAY
================================= */

const currentDisplay =
    document.getElementById(
        "current-display"
    );


const previousDisplay =
    document.getElementById(
        "previous-display"
    );


/* =================================
   UPDATE DISPLAY
================================= */

function updateDisplay() {

    currentDisplay.textContent =
        formatNumber(currentNumber);

    if (
        previousNumber !== "" &&
        operator !== null
    ) {

        previousDisplay.textContent =
            formatNumber(previousNumber)
            + " "
            + getOperatorSymbol(operator);

    } else {

        previousDisplay.textContent =
            "";

    }
}


/* =================================
   FORMAT NUMBER
================================= */

function formatNumber(number) {

    if (number === "Error") {

        return "Error";
    }


    if (number === "") {

        return "0";
    }


    const parts =
        number.split(".");


    let integerPart =
        Number(parts[0])
            .toLocaleString("en-IN");


    if (parts.length > 1) {

        return (
            integerPart +
            "." +
            parts[1]
        );
    }


    return integerPart;
}


/* =================================
   OPERATOR SYMBOL
================================= */

function getOperatorSymbol(op) {

    const symbols = {

        "+": "+",

        "-": "−",

        "*": "×",

        "/": "÷"

    };


    return symbols[op] || op;
}


/* =================================
   ADD NUMBER
================================= */

function appendNumber(number) {

    if (
        currentNumber === "Error" ||
        shouldResetDisplay
    ) {

        currentNumber = number;

        shouldResetDisplay = false;

    } else {

        if (
            currentNumber === "0"
        ) {

            currentNumber = number;

        } else {

            currentNumber += number;

        }
    }


    updateDisplay();
}


/* =================================
   DECIMAL
================================= */

function appendDecimal() {

    if (
        shouldResetDisplay
    ) {

        currentNumber = "0";

        shouldResetDisplay = false;
    }


    if (
        !currentNumber.includes(".")
    ) {

        currentNumber += ".";

    }


    updateDisplay();
}


/* =================================
   CHOOSE OPERATOR
================================= */

function chooseOperator(nextOperator) {

    if (
        currentNumber === "Error"
    ) {

        return;
    }


    if (
        operator !== null &&
        !shouldResetDisplay
    ) {

        calculate();

    }


    previousNumber =
        currentNumber;

    operator =
        nextOperator;

    shouldResetDisplay =
        true;

    updateDisplay();
}


/* =================================
   CALCULATE
================================= */

function calculate() {

    if (
        operator === null ||
        previousNumber === ""
    ) {

        return;
    }


    const first =
        parseFloat(previousNumber);


    const second =
        parseFloat(currentNumber);


    let result;


    switch (operator) {

        case "+":

            result =
                first + second;

            break;


        case "-":

            result =
                first - second;

            break;


        case "*":

            result =
                first * second;

            break;


        case "/":

            if (second === 0) {

                currentNumber =
                    "Error";

                previousNumber =
                    "";

                operator =
                    null;

                updateDisplay();

                return;
            }


            result =
                first / second;

            break;

    }


    result =
        Number(
            result.toFixed(10)
        ).toString();


    const expression =
        formatNumber(previousNumber)
        + " "
        + getOperatorSymbol(operator)
        + " "
        + formatNumber(currentNumber);


    addToHistory(
        expression,
        result
    );


    currentNumber =
        result;

    previousNumber =
        "";

    operator =
        null;

    shouldResetDisplay =
        true;

    updateDisplay();
}


/* =================================
   CLEAR
================================= */

function clearCalculator() {

    currentNumber =
        "0";

    previousNumber =
        "";

    operator =
        null;

    shouldResetDisplay =
        false;

    updateDisplay();
}


/* =================================
   DELETE
================================= */

function deleteNumber() {

    if (
        shouldResetDisplay ||
        currentNumber === "Error"
    ) {

        clearCalculator();

        return;
    }


    if (
        currentNumber.length === 1
    ) {

        currentNumber =
            "0";

    } else {

        currentNumber =
            currentNumber.slice(
                0,
                -1
            );

    }


    updateDisplay();
}


/* =================================
   PERCENTAGE
================================= */

function percentage() {

    if (
        currentNumber === "Error"
    ) {

        return;
    }


    currentNumber =
        (
            parseFloat(currentNumber)
            / 100
        ).toString();


    updateDisplay();
}


/* =================================
   POSITIVE / NEGATIVE
================================= */

function toggleSign() {

    if (
        currentNumber === "0" ||
        currentNumber === "Error"
    ) {

        return;
    }


    if (
        currentNumber.startsWith("-")
    ) {

        currentNumber =
            currentNumber.substring(1);

    } else {

        currentNumber =
            "-" + currentNumber;

    }


    updateDisplay();
}


/* =================================
   HISTORY
================================= */

function addToHistory(
    expression,
    result
) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "styleCalcHistory"
            )
        ) || [];


    history.unshift({

        expression:
            expression,

        result:
            result,

        time:
            new Date().toLocaleTimeString()

    });


    if (
        history.length > 10
    ) {

        history =
            history.slice(0, 10);

    }


    localStorage.setItem(
        "styleCalcHistory",
        JSON.stringify(history)
    );


    displayHistory();
}


/* =================================
   DISPLAY HISTORY
================================= */

function displayHistory() {

    const historyList =
        document.getElementById(
            "history-list"
        );


    let history =
        JSON.parse(
            localStorage.getItem(
                "styleCalcHistory"
            )
        ) || [];


    if (
        history.length === 0
    ) {

        historyList.innerHTML = `

            <p class="empty-history">

                No calculations yet.

            </p>

        `;

        return;
    }


    historyList.innerHTML = "";


    history.forEach(
        item => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "history-item";


            div.innerHTML = `

                <div>

                    <div class="history-expression">

                        ${item.expression}

                    </div>

                    <small>

                        ${item.time}

                    </small>

                </div>


                <div class="history-result">

                    = ${formatNumber(item.result)}

                </div>

            `;


            historyList.appendChild(
                div
            );

        }
    );
}


/* =================================
   CLEAR HISTORY
================================= */

function clearHistory() {

    localStorage.removeItem(
        "styleCalcHistory"
    );

    displayHistory();
}


/* =================================
   KEYBOARD SUPPORT
================================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key;


        /* NUMBERS */

        if (
            key >= "0" &&
            key <= "9"
        ) {

            appendNumber(key);

            return;
        }


        /* DECIMAL */

        if (
            key === "."
        ) {

            appendDecimal();

            return;
        }


        /* OPERATORS */

        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            chooseOperator(key);

            return;
        }


        /* ENTER */

        if (
            key === "Enter" ||
            key === "="
        ) {

            calculate();

            return;
        }


        /* BACKSPACE */

        if (
            key === "Backspace"
        ) {

            deleteNumber();

            return;
        }


        /* ESCAPE */

        if (
            key === "Escape"
        ) {

            clearCalculator();

            return;
        }


        /* PERCENT */

        if (
            key === "%"
        ) {

            percentage();

        }

    }
);


/* =================================
   START
================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateDisplay();

        displayHistory();

    }
);