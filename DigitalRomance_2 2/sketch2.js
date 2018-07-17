
var popups = [];  //images Array
var popupsMessage =  []; //images Array for Message PopUps
var sliders = []; //images für Slider Popups

var popupsIndex = [];   // Indizes für Popup Images --> später geshuffelt
var popupsMessageIndex = [];

var popupsIndexCounter = 0;
var popupsMessageIndexCounter = 0;


var activePopups = [];
// var activePopupsXPosition = [];
// var activePopupsYPosition = [];
var activePopupsIndex;

var activeSlider;

var timePassed = 0;
var deltaTime = 1000; // <-- Die Zeit die wir warten wollen bis ein popup erscheint

var messageSound;
var sliderSound;

///Images in Arrays laden
function preload(){

  soundFormats('mp3', 'ogg');
  messageSound = loadSound('sounds/facebookSound.mp3');
  sliderSound = loadSound('sounds/smsSound.mp3');

  for(var i = 0; i < 19; i++){
    var fileName = 'images/classic/' + i + '.png';
    popups[i] = loadImage(fileName);
    popupsIndex[i] = i;
  }

  for(var i = 0; i < 13; i++){
    var fileName = 'images/message/' + i + '.png';
    popupsMessage[i] = loadImage(fileName);
    popupsMessageIndex[i] = i;
  }

  for(var i = 0; i < 15; i++){
    var fileName = 'images/slider/' + i + '.png';
    sliders[i] = loadImage(fileName);
  }

  popupsIndex.shuffle();
  popupsMessageIndex.shuffle();


}

///Start
function setup() {
  // put setup code here
  var canvas = createCanvas(windowWidth, windowHeight);
  console.log(" 2 windowWidth: ",windowWidth," height", windowHeight);

  pixelDensity(1);

  canvas.parent('popupdiv');
  activePopupsIndex = 0;

  timePassed = millis();

  ellipseMode(CORNER);

  smooth();

  messageSound.setVolume(0.5);

  var sliderImage = sliders[0];
  activeSlider = new Slider(sliders, 1430, 268, 3);
}


///Loop
function draw() {

  clear();

  for(var i = 0; i < activePopups.length; i++){

    activePopups[i].display();
  }

  // Zeitintervall zum Erzeugen der Popups
  if(millis() > timePassed + deltaTime){

    if(activePopupsIndex < 5){

      var randomNumber = random(1); //Zum "Würfeln" welches popup entsteht...

      if(randomNumber < 0.5){
        //var popupImage = random(popups);
        var randomIndex = popupsIndex[popupsIndexCounter];
        var popupImage = popups[randomIndex];
        activePopups[activePopupsIndex] = new PopUp(popupImage, 4, true, millis());
        popupsIndexCounter++;
        if(popupsIndexCounter > popupsIndex.length-1){
          popupsIndex.shuffle();
          popupsIndexCounter=0;
        }
      } else {
        //var popupImage = random(popupsMessage);
        messageSound.play();
        var randomIndex = popupsMessageIndex[popupsMessageIndexCounter];
        var popupImage = popupsMessage[randomIndex];
        activePopups[activePopupsIndex] = new PopUp(popupImage, 1.8, false, millis());
        popupsMessageIndexCounter ++;
        if(popupsMessageIndexCounter > popupsMessageIndex.length-1){
          popupsMessageIndex.shuffle();
          popupsMessageIndexCounter=0;
        }
      }

      activePopupsIndex ++;
    }

    timePassed = millis();

    deltaTime = random(1000, 2000); // neue Zeit
    //console.log(deltaTime);
  }

  for(var i = activePopups.length -1; i >= 0; i--){
    var popup = activePopups[i];

    if(popup.living() == false && popup.classicPopup == false){
      activePopups.splice(i, 1);
      // console.log("popup: ", i, "died, RIP");

      if(activePopupsIndex >= 0){
        activePopupsIndex --;
      }
      return;
    }
  }

  for(var i = activePopups.length -1; i >= 0; i--){
    var popup = activePopups[i];
    popup.hoverPopUp(mouseX, mouseY);
    popup.hoverPopUpBar(mouseX, mouseY);
  }


  activeSlider.slideInOut();
  activeSlider.display();

}

//////////////////////////
///// Event Listener /////
//////////////////////////


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  console.log("windowWidth: ",windowWidth," height", windowHeight);
}

function mousePressed() {
  console.log("mouse Pressed...");


  if(activeSlider.isVisible){
    console.log("isVisible");
    if(mouseX > activeSlider.x && mouseX < activeSlider.x+activeSlider.w && mouseY > activeSlider.y && mouseY < activeSlider.y+activeSlider.h){
      console.log("inside active Slider");
      return;
    }
  }

  for(var i = activePopups.length -1; i >= 0; i--){
    var popup = activePopups[i];
    popup.barPressed(mouseX, mouseY);

    var lastPopup = activePopups[activePopups.length -1];

    if(lastPopup.classicPopup){
      if(mouseX > lastPopup.x && mouseX < lastPopup.x+lastPopup.w && mouseY > lastPopup.y && mouseY < lastPopup.y+lastPopup.h+lastPopup.barHeight){
        // console.log("inside lastPopup -- classic");
        return;
      }
    } else {
      if(mouseX > lastPopup.x && mouseX < lastPopup.x+lastPopup.w && mouseY > lastPopup.y && mouseY < lastPopup.y+lastPopup.h){
        // console.log("inside lastPopup -- message");
        return;
      }
    }

    if(popup.locked == true){
      if(i == activePopups.length -1){
        // console.log("don't swap");
        return;
      } else {
        // console.log("swap");
        activePopups.swap(i, activePopups.length - 1);
      }
    }
  }
}


function mouseDragged(){
  for(var i = activePopups.length -1; i >= 0; i--){
    var popup = activePopups[i];

    popup.barDragged(mouseX, mouseY);

    return;
  }
}

function mouseReleased(){
  for(var i = activePopups.length -1; i >= 0; i--){
    var popup = activePopups[i];
    popup.barReleased();
  }
}

function mouseClicked() {

  // if(popup.clickInside(mouseX, mouseY) == true){
  //   console.log("click inside");
  // }
  // console.log("mouseClicked x: ", mouseX, " y:", mouseY);
  //
  for(var i = activePopups.length -1; i >= 0; i--){

    var popup = activePopups[i];

    if(popup.clickInside(mouseX, mouseY)){
      // inside popup
      // remove Popup from Array
      activePopups.splice(i, 1);
      // console.log("delete popup: ", i);

      if(activePopupsIndex >= 0){
        activePopupsIndex --;
      }

      return;
    }
  }
}

// Array.prototype.swap = function (x,y) {
//   var b = this[x];
//   this[x] = this[y];
//   this[y] = b;
//   return this;
// }



////////////////////////
///// Hilfs-Methode ////
////////////////////////

Array.prototype.swap = function (x) {
  var b = this[x];
  this.splice(x, 1);
  this.push(b);
  // this[x] = this[y];
  // this[y] = b;
  return this;
}

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}



//////////////////////
//////////////////////
/// Klasse Popup//////
//////////////////////
//////////////////////

function Slider(imgArray, w, h, factor){

  this.imgArray = imgArray;

  this.x = windowWidth;
  this.y = 27.5;

  this.sizeFactor = factor;

  this.w = w/this.sizeFactor;
  this.h = h/this.sizeFactor;

  this.targetX = windowWidth-this.w-10;

  this.imageIndex = 0;

  this.easing = 0.13;

  this.slideInEnded = false;

  this.timeToWait = 1000;
  this.lastTime = 0;

  this.sceneIndex = 0;

  this.isVisible = false;

  this.playSound = false;


  this.display = function(){
    image(this.imgArray[this.imageIndex], this.x, this.y, this.w, this.h);
  }

  this.slideInOut = function(){

    if(this.sceneIndex == 0){
      //Slide In...
      if(this.x > this.targetX+.01 && !this.slideInEnded){
        this.x += (this.targetX - this.x)*this.easing;

        if(!this.playSound){
          sliderSound.play();
          this.playSound = true;
        }
      } else {
        if(!this.slideInEnded){
          this.x = this.targetX;
          this.timeToWait = random(10000,20000); //Wartezeit im ON
          this.targetX = windowWidth;
          this.lastTime = millis();
          // console.log("slideEnd, wait for: ", this.timeToWait, " new Target X: ", this.targetX);
          this.slideInEnded = true;
          this.isVisible = true;
          this.sceneIndex ++;
          this.playSound = false;
        }
      }
    } else if(this.sceneIndex == 1){
      //Wait for time
      if(millis() > this.lastTime+this.timeToWait){
        // console.log("timeToEait Over");
        this.slideInEnded = false;
        this.sceneIndex ++;
      }
    } else if(this.sceneIndex == 2){
      //Slide Out...
      if(this.x < this.targetX-.01 && !this.slideInEnded){
        this.x += (this.targetX - this.x)*this.easing;
      } else {
        if(!this.slideInEnded){
          this.x = this.targetX;
          this.timeToWait = random(100,200); //WarteZeit im Off
          this.targetX = windowWidth-this.w-10;
          this.lastTime = millis();
          // console.log("slide Out ended");
          this.slideInEnded == true;

          //next Image
          this.imageIndex++;
          if(this.imageIndex > this.imgArray.length-1){
            this.imageIndex = 0;
          }

          this.isVisible = false;
          this.sceneIndex ++;
        }
      }
    } else if(this.sceneIndex == 3){
      // Wait Again...
      if(millis() > this.lastTime+this.timeToWait){
        // console.log("timeToEait Over");
        this.slideInEnded = false;
        //reset Scene Index...
        this.sceneIndex = 0;
      }
    }


  }
}


function PopUp(img, factor, classicPopup, birthTime) {
    this.popimage = img;

    this.sizeFactor = factor;

    this.classicPopup = classicPopup;

    this.w = this.popimage.width/this.sizeFactor;
    this.h = this.popimage.height/this.sizeFactor;

    this.x = random(0, windowWidth-this.w);
    this.y = random(0, windowHeight-this.h);

    this.buttonPosX = 12;
    this.buttonPosY = 12;
    this.buttonW = 16;
    this.buttonH = 16;

    this.barHeight = 40;

    this.hover = false;

    this.locked = false;
    this.hoverBar = false;

    this.offsetX = 0;
    this.offsetY = 0;

    this.birthTime = birthTime;
    this.lifeTime = random(30000, 40000);

    this.display = function(){
      // fill(this.color);
      // noStroke();
      //rect(this.x, this.y, this.w, this.h);

      fill('#dddbdd');
      noStroke();

      //Zeige Popups immer innerhalb des Screens...
      if(this.x < 0){
        this.x = 0;
      }
      else if(this.x > windowWidth-this.w){
        this.x = windowWidth-this.w;
      }

      if(this.y < 0){
        this.y = 0;
      }
      else if(this.y > windowHeight-this.barHeight){
        this.y = windowHeight-this.barHeight;
      }


      ///Display Popup basierend auf "classicPopup" variable
      if(this.classicPopup == true){
        rect(this.x, this.y, this.w, this.barHeight, 10, 10, 0, 0);

        image(this.popimage, this.x, this.y+this.barHeight, this.w, this.h);


        fill('#8b8b90');
        if(this.hover == true){
          fill('#8800ff');
        }
        ellipse(this.x+this.buttonPosX, this.y+this.buttonPosY, this.buttonW, this.buttonH);

        fill('#8b8b90');
        ellipse(this.x+this.buttonPosX*2 + this.buttonW, this.y+this.buttonPosY, this.buttonW, this.buttonH);
        ellipse(this.x+this.buttonPosX*3 + this.buttonW*2, this.y+this.buttonPosY, this.buttonW, this.buttonH);
      }
      else {
        image(this.popimage, this.x, this.y, this.w, this.h);
      }


    };

    this.clickInside = function(x, y){

      if(x > this.x+this.buttonPosX && x < this.x+this.buttonPosX+this.buttonW && y > this.y+this.buttonPosY && y < this.y+this.buttonPosY+this.buttonH && this.classicPopup){
        return true;
      }
      return false;
    }

    this.hoverPopUp = function(x, y){

      if(x > this.x+this.buttonPosX && x < this.x+this.buttonPosX+this.buttonW && y > this.y+this.buttonPosY && y < this.y+this.buttonPosY+this.buttonH){
        this.hover = true;
        // console.log("HOVER");
      } else {
        this.hover = false;
        // console.log(" no hover");
      }
    }

    this.hoverPopUpBar = function(x, y){

      if(this.classicPopup){
        if(x > this.x && x < this.x+this.w && y > this.y && y < this.y+this.barHeight){
          this.hoverBar = true;
           // console.log("HOVER BAR");
        } else {
          this.hoverBar = false;
          // console.log(" NO hover bar");
        }
      }
      else {
        if(x > this.x && x < this.x+this.w && y > this.y && y < this.y+this.h){
          this.hoverBar = true;
           // console.log("HOVER BAR");
        } else {
          this.hoverBar = false;
          // console.log(" NO hover bar");
        }
      }
    }

    this.barPressed = function(x, y){

      if(this.hoverBar == true){
        this.locked = true;
      } else {
        this.locked = false;
      }
      this.offsetX = x - this.x;
      this.offsetY = y -this.y;

    }

    this.barDragged = function(x, y){
      if(this.locked == true){
        // console.log(y);
        this.x = x - this.offsetX;
        this.y = y - this.offsetY;
      }
    }

    this.barReleased = function(){
      this.locked = false;
    }

    this.living = function(){
      if(millis() > this.birthTime + this.lifeTime){
        return false;
      }
      else {
        return true;
      }
    }
}
