var soundEnabled = true;
var myOscillator;
var playingSound;
var previousSoundTimeStamp;

var myElementSet;

var frameCountPerCicle = 60;
var currentCicleFrameCount;
var
    currentCicleProgressRatio,
    currentCicleQuadEaseInRatio,
    currentCicleQuadEaseOutRatio,
    currentCicleQuartEaseInRatio,
    currentCicleQuartEaseOutRatio;

var backgroundColor;

function setup() {
    createCanvas(640, 640);
    backgroundColor = color(240);

    myOscillator = new p5.Oscillator();
    myOscillator.setType('sine');
    myOscillator.freq(880);
    myOscillator.amp(0);
    myOscillator.start();

    ellipseMode(CENTER);
    rectMode(CENTER);
    myElementSet = new ElementSet(4, 40);
    myElementSet.push(drawExpandingRipple);
    myElementSet.push(drawPoppingCircles);
}

function draw() {
    background(backgroundColor);
    updateCurrentCicleProgress();

    myElementSet.display();

    if (soundEnabled) {
        if (frameCount % frameCountPerCicle == 0) playSound();
        if (playingSound && millis() - previousSoundTimeStamp > 20) {
            myOscillator.amp(0, 0.1);
            playingSound = false;
        }
    }
}

function updateCurrentCicleProgress() {
    currentCicleFrameCount = frameCount % frameCountPerCicle;
    currentCicleProgressRatio = currentCicleFrameCount / frameCountPerCicle;
    currentCicleQuadEaseInRatio = currentCicleProgressRatio * currentCicleProgressRatio;
    currentCicleQuadEaseOutRatio = -sq(currentCicleProgressRatio - 1) + 1;
    currentCicleQuartEaseInRatio = pow(currentCicleProgressRatio, 4);
    currentCicleQuartEaseOutRatio = -pow(currentCicleProgressRatio - 1, 4) + 1;
}

function mouseClicked() {
    if (soundEnabled) myOscillator.stop();
    else myOscillator.start();
    soundEnabled = !soundEnabled;
}

function playSound() {
    myOscillator.amp(1, 0.02);
    previousSoundTimeStamp = millis();
    playingSound = true;
}

var ElementSet = function(elementXCount, elementDisplaySize) {
    var elementArray = [];
    var positionInterval = width / (elementXCount + 1);
    var xIndex = 0;
    var yIndex = 0;

    this.push = function(displayFunction) {
        elementArray.push(new Element(
            (xIndex + 1) * positionInterval,
            (yIndex + 1) * positionInterval,
            displayFunction
        ));
        xIndex++;
        if (xIndex >= elementXCount) {
            xIndex = 0;
            yIndex++;
        }
    };

    this.display = function() {
        for (var elementIndex = 0, elementNumber = elementArray.length; elementIndex < elementNumber; elementIndex++) {
            elementArray[elementIndex].display(elementDisplaySize);
        }
    };
};

var Element = function(x, y, displayFunction) {
    this.xPosition = x;
    this.yPosition = y;
    this.display = displayFunction;
};

function drawExpandingRipple(size) {
    var diameter = size * 1.5 * currentCicleQuartEaseOutRatio;
    stroke(0);
    strokeWeight(size * 0.2 * (1 - currentCicleQuartEaseOutRatio));
    noFill();
    ellipse(this.xPosition, this.yPosition, diameter, diameter);
}

function drawPoppingCircles(size) {
    var diameter = size * 0.3 * (1 - currentCicleProgressRatio);
    var distance = size * 0.7 * (currentCicleQuartEaseOutRatio);
    stroke(0);
    strokeWeight(1);
    noFill();
    for (var i = 0; i < 5; i++) {
        var rotationAngle = -HALF_PI + i * TWO_PI / 5;
        push();
        translate(this.xPosition, this.yPosition);
        rotate(rotationAngle);
        ellipse(distance, 0, diameter, diameter);
        pop();
    }
}