const boxes = [["box00", "box01", "box02",  "box03",  "box04",  "box05",  "box06",  "box07"],
             ["box10", "box11", "box12",  "box13",  "box14",  "box15",  "box16",  "box17"],
             ["box20", "box21", "box22",  "box23",  "box24",  "box25",  "box26",  "box27"],
             ["box30", "box31", "box32",  "box33",  "box34",  "box35",  "box36",  "box37"],
             ["box40", "box41", "box42",  "box43",  "box44",  "box45",  "box46",  "box47"],
             ["box50", "box51", "box52",  "box53",  "box54",  "box55",  "box56",  "box57"]];

const options = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "*", "/", "="];

var access = [true, false, false, false, false, false, false];

function undo() {
 
    loop:
    for (let row = 0; row < boxes.length; row++) {
        if (access[row]) {
            for (let element = boxes[row].length - 1; element > -1; element--) {
                if (document.getElementById(boxes[row][element]).textContent != "") {
                    document.getElementById(boxes[row][element]).textContent = "";
                    break loop;
                }
            }
        }
    }

}

function result() {

    var equation = ["", "", "", "", "", "", ""];

    loop:
    for (let row = 0; row < boxes.length; row++) {
        if (access[row]) {
            for (let element = 0; element < boxes[row].length; element++) {
                var text = document.getElementById(boxes[row][element]).textContent;
                if (text != "") {
                    break loop;
                }
            }
        }
    }

}

function display(text) {

    var colour;

    loop:
    for (let row = 0; row < boxes.length; row++) {
        if (access[row]) {
            for (let element = 0; element < boxes[row].length; element++) {
                if (document.getElementById(boxes[row][element]).textContent == "") {
                    document.getElementById(boxes[row][element]).textContent = text;
                    document.getElementById(boxes[row][element]).style.backgroundColor = "#50E5F9";
                    document.getElementById(boxes[row][element]).style.borderColor = "#50E5F9";
                    break loop;
                }
            }
        }
    }

    console.log(colour);

}



function inputAdded(clickedID) {

    var getClicked = document.getElementById(clickedID).textContent.trim();
    
    if (getClicked == "plus") {
        getClicked = "+";
    } else if (getClicked == "minus") {
        getClicked = "-";
    } else if (getClicked == "multiply") {
        getClicked = "*";
    } else if (getClicked == "buttonide") {
        getClicked = "/";
    }

    if (getClicked == "Delete") {
        undo();
    } else if (getClicked == "Enter") {
        result();
    } else {
        display(getClicked);
    }

}

document.addEventListener('keyup', (event) => {

    var getKey = event.key;

    for (let item of options) {
        if (item == getKey) {
            display(getKey);
            break;
        }
    }

    if (getKey == "Delete" || getKey == "Backspace") {
        undo();
    } else if (getKey == "Enter") {
        result();
    }

}, false);
