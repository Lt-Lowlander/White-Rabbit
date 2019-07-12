//  assorted utf-8 characters
const unicode = ["ｦ", "ｧ", "ｨ", "ｩ", "ｪ", "ｫ", "ｬ", "ｭ", "ｮ", "ｯ", "ｰ", "ｱ", "ｲ", "ｳ", "ｴ", "ｵ", "ｶ", "ｷ", "ｸ", "ｹ", "ｺ", "ｻ", "ｼ", "ｽ", "ｾ", "ｿ", "ﾀ", "ﾁ", "ﾂ", "ﾃ", "ﾄ", "ﾅ", "ﾆ", "ﾇ", "ﾈ", "ﾉ", "ﾊ", "ﾋ", "ﾌ", "ﾍ", "ﾎ", "ﾏ", "ﾐ", "ﾑ", "ﾒ", "ﾓ", "ﾔ", "ﾕ", "ﾖ", "ﾗ", "ﾘ", "ﾙ", "ﾚ", "ﾛ", "ﾜ", "ﾝ", "+", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Z", ":", "*", "=", "<", ">", ".", "|", "_"];

//  preliminary setup
const forecast = 50;   //  informs how frequently the drops will fall (sets the timespan between function calls (in ms))
const squareSide = 36;  // arbitrarily chosen measure for individual cells
const blankPercentage = 24;   // controls the percentage of blank spaces
const staticPercentage = 44;    // controls the percentage of static spaces
const staticRange = blankPercentage + staticPercentage; // the upper bound for the static numbers (lower bound is blankPercentage + 1).
// const dynamicPercentage = (100 - staticRange);    //  remaining percentage of non-blank & non-static spaces is dynamic
const speedFastest = 15;   //  fastest speed
const speedDamper = 45;   //  slowest speed
let winLR = window.innerWidth;  //  pixel width of screen
let winTB = window.innerHeight;   // pixel height of screen
let horizCount = Math.floor(winLR/squareSide*2);  // quantity of cells horizontally across screen
let vertCount = Math.floor(winTB/squareSide);   // quantity of cells vertically across screen
const rainDropLowerBound = 2;   // minimum dripSize length
const rainDropUpperBound = vertCount;   // maximum dripSize length
const matrix = document.getElementById("copperTop");
const gridBox = document.createDocumentFragment('div');
matrix.style.display = 'flex';

//  construct a grid
for (var i = 0; i < horizCount; i++) {
  const vertColumn = document.createElement('div');
  vertColumn.className = `vertColumn${i} pillar`;
  for (var j = 0; j < vertCount; j++) {
    const colSquare = document.createElement('div');
    colSquare.className = `square ${i}-${j}`;
    colSquare.style.order = `${j}`;
    colSquare.style.height = `${squareSide}px`;
    colSquare.style.width = `${squareSide*0.5}px`;
    vertColumn.appendChild(colSquare);
  }
  gridBox.appendChild(vertColumn);
}
matrix.appendChild(gridBox);

function rand(arg1){    //  randomization helper function
  const result = Math.floor(Math.random()*arg1);
  return result;
}

//  create a recurring loop to update the dynamic characters
function dynoFill(readIn, readOut){
  let recurrence;
  const timer = 50 + rand(130);
  function charSwitch(){
    if (readOut.classList.contains("io")){    // **NB .contains is a DOMTokenlist method
      readOut.innerText = unicode[rand(unicode.length-1)];
    }
  }
  if (readIn.status != "off") {
    recurrence = setInterval(charSwitch, timer);
    readIn.turbidity = recurrence;
  } else if (readIn.status === "off") {
    recurrence = clearInterval(readIn.turbidity);
    readOut.innerText = "";
  }
}

// assign an output value to the current cell based on the established blank, static, and dynamic percentages above
function signalProcessing(input, scrCell){
  const signalIndex = rand(100)+1;    //random index for sorting
  if (signalIndex <= blankPercentage) {
    input.channel = "silent";
    input.glyph = "";
    scrCell.innerText = input.glyph;
  } else if (signalIndex > blankPercentage && signalIndex <= staticRange) {
    input.channel = "static";
    input.glyph = unicode[rand(unicode.length-1)];
    scrCell.innerText = input.glyph;
  } else if (signalIndex > staticRange) {
    input.channel = "dynamic";
    dynoFill(input, scrCell);
  }
}

function simulatePrecip(droplet, k){
  const bow = droplet.digits[droplet.size-1];
  const stern = droplet.digits[0];
  const dropElemTail = droplet.element.children[k-droplet.size];
  const dropElemHead = droplet.element.children[k];
  const caboose = {spot:droplet.digits[(droplet.size-1)-(k%droplet.size)].spot, status:`${droplet.digits[(droplet.size-1)-(k%droplet.size)].status}`, glyph:`${droplet.digits[(droplet.size-1)-(k%droplet.size)].glyph}`, channel:`${droplet.digits[(droplet.size-1)-(k%droplet.size)].channel}`, turbidity:droplet.digits[(droplet.size-1)-(k%droplet.size)].turbidity};
  droplet.rearGuard = caboose;

  if (dropElemHead) {
    dropElemHead.classList.add("header");
    dropElemHead.innerText = unicode[rand(unicode.length-1)];
  }
  if(droplet.element.children[k-1]){
    droplet.element.children[k-1].classList.remove("header");
    droplet.element.children[k-1].classList.add("io");
  }

  debugger
  droplet.digits[(droplet.size-1)-(k%droplet.size)].spot = k;   //  current spot, or Bow of the droplet
  // droplet.digits[(droplet.size-1)-((k-(droplet.size-1))%droplet.size)]   //  oldest spot, or Stern of the droplet
  debugger

  if (k < vertCount) {
    signalProcessing(droplet.digits[(droplet.size-1)-(k%droplet.size)], dropElemHead);
  }
  debugger

  if ("stern.spot" <= vertCount) {
    if (ster) {

    }
  }


  // if (stern.spot <= vertCount) { // as long as there are drop elements on the screen
  //   if (stern.spot <= 0 && bow.spot < droplet.size){    // Pouring phase establishes the digits onscreen
  //     signalProcessing(bow, dropElemHead);
  //     colValues[bow.spot] = {status:bow.status, glyph:bow.glyph, channel:bow.channel, turbidity:bow.turbidity};
  //   } else if (stern.spot > 0 && bow.spot < vertCount) {   // Enter the Sliding phase
  //     signalProcessing(bow, dropElemHead);
  //     colValues[bow.spot] = {status:bow.status, glyph:bow.glyph, channel:bow.channel, turbidity:bow.turbidity};
  //     colValues[stern.spot-1].status = "off";
  //     dynoFill(colValues[stern.spot-1], dropElemTail);
  //     dropElemTail.classList.remove("io");
  //   } else if ( bow.spot >= vertCount) {    //  Enter the Draining phase
  //     droplet.digits[vertCount+droplet.size-1-k] = {spot:k, status:"off", glyph:"", channel:"none", turbidity:0};
  //     colValues[stern.spot-1].status = "off";
  //     dynoFill(colValues[stern.spot-1], dropElemTail);
  //     dropElemTail.classList.remove("io");
  //     // debugger
  //   }
  // }
  // // debugger
  //
  // // droplet.digits[(droplet.size-1)-((k-1)%droplet.size)].spot   //  most recent spot
  //
  // // for (var j = 0; j < droplet.size; j++) {   //  relabel the location for each spot within the rainDrop
  // //   if ((droplet.digits[j].spot >= 0) && bow.spot < droplet.size){   // if the digits are onscreen but the drop hasn't begun to slide
  // //     if(droplet.digits[j-1]){   //  pass along the cell's glyph, channel signal, and interval info to the subsequent digit within the droplet.
  // //       droplet.digits[j-1] = {spot:(droplet.digits[j].spot), status:(k<=vertCount)?"on":"off", glyph:droplet.digits[j].glyph, channel:droplet.digits[j].channel, turbidity:droplet.digits[j].turbidity};
  // //     }
  // //   }
  // //   droplet.digits[j].spot += 1;    //  increment all the droplet digits along the column
  // // }
}

// move the raindrop across the screen
function falling(water){
  const ticker = water.speed;
  for (var i = 0; i < vertCount+water.size; i++) {  // Increment the rainDrop among the cells within a column
    const k = i;    //  so as not to overwrite the i value
    let waterClock = setTimeout(function(){
      simulatePrecip(water,k);
    }, ticker*k);
  }
}

//  chooses a column for each drop to fall down
function colPicker(input){
  const arbColNum = rand(horizCount-1);
  const column = document.getElementsByClassName(`vertColumn${arbColNum}`)[0];
  const result = (input == "element") ? column : arbColNum;
  return result;
}

function RainDrop() {
  this.element = colPicker("element"),
  this.colNum = colPicker("column"),
  this.speed = (speedFastest+rand(speedDamper)),
  this.size = (rainDropLowerBound + rand(rainDropUpperBound-rainDropLowerBound)),
  this.digitBuilder = function(measure){
    let digitHolder = {};
    for (var i = 0; i < measure; i++) {
      const order = {spot:(i+1-measure), status:(i == measure-1) ? "on" : "off", glyph:"", channel:"none", turbidity:0};
      digitHolder[i] = order;
    }
    return digitHolder;
  },
  this.digits = this.digitBuilder(this.size),
  this.rearGuard = {};
}

function cyberZeus(){   //  master function for making it rain
  const dew1 = new RainDrop();  //  instantiate a drop
  falling(dew1);  //  activate the drop
}

cyberZeus();
// setInterval(cyberZeus, forecast);    //  run repeatedly


// 1) Replace the canal attribute for a leaner RainDrop object
// 2) Replace the J for loop in simulatePrecip in favor of a modulus operation?
