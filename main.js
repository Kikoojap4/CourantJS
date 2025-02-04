let nbPoints = 1000; // amount of points
let points = []; // list of all points

let speed = 1; // the speed represents how fast the points will move each frame 
let size = 1; // the size represents how big the points will be (better to keep at low values)
let positionScale = 300; // the scale represents how much the noise will be zoomed
let rotationScale = 1; // how much a point can change it's direction at total (1 = 2PI)
let fadeSpeed = 0; // how fast the points will fade out (0 = no fade, 255 = instant fade)
let opacity = 40; // how visible is the point (0 = invisible, 255 = opaque)
let borderRule = "randomTeleport"; // determines what happens when a point goes off-screen (randomTeleport, linkedTeleport, none)

let mainWidth;
let mainHeight;
let currentColor;

function setup() {
    // get size of div
    if (window.innerWidth > 1920) {
        mainWidth = document.getElementById("main").clientWidth;
        mainHeight = window.innerHeight - 300; // test
    } else {
        mainWidth = document.getElementById("main").clientWidth;
        mainHeight = document.getElementById("setterCanvaHeight").clientHeight + 25; // + 25 is a manual offset to make canvas slightly bigger than the sidebar
    }
    // initialize canvas
    createCanvas(mainWidth, mainHeight); // set canva size
    background(0); // set background color in A
    currentColor = color(0,255,200,opacity)
    stroke(currentColor); // set color in RGBA
    strokeWeight(size); // set size of points

    // create all points
    for (let i = 0; i < nbPoints; i++) {
        points.push(createVector(random(mainWidth), random(mainHeight))); // add a new point with random position
    }
}

function draw() {
    if (fadeSpeed > 0) {
        background(0, 0, 0, fadeSpeed);
    }
    for (vector of points) {
        // set the direction of the point with semi-random noise
        let direction = 2 * rotationScale * Math.PI * noise(vector.x / positionScale, vector.y / positionScale);

        // apply the movement
        vector.x += Math.cos(direction) * speed;
        vector.y += Math.sin(direction) * speed;

        // check if the point is off-screen and apply border rule
        switch (borderRule) {
            case "randomTeleport":
                if (vector.x < 0 || vector.x > mainWidth || vector.y < 0 || vector.y > mainHeight) {
                    vector.x = random(mainWidth);
                    vector.y = random(mainHeight);
                }
                break;
            case "linkedTeleport":
                if (vector.x < 0) vector.x = mainWidth;
                if (vector.x > mainWidth) vector.x = 0;
                if (vector.y < 0) vector.y = mainHeight;
                if (vector.y > mainHeight) vector.y = 0;
                break;
            case "none":
            default:
                break;
        }

        // draw the point
        point(vector.x, vector.y)
    }
}

function windowResized() {
    if (mainWidth != document.getElementById("main").clientWidth) { // check that it is not only the height that changed (we don't care in this case)
        // get new div size
        if (window.innerWidth > 1920) {
            mainWidth = document.getElementById("main").clientWidth;
            mainHeight = innerHeight - 250; // make the canva take most screen space
        } else {
            mainWidth = document.getElementById("main").clientWidth;
            mainHeight = document.getElementById("setterCanvaHeight").clientHeight + 25; // + 25 is a manual offset to make canvas slightly bigger than the sidebar
        }
        
        // resize canvas to correct size
        resizeCanvas(mainWidth, mainHeight);

        reset();
    }
}

function refresh() {
    //reset values
    background(0);
    totalOffset = 0;
    stroke(currentColor);
    // replace all points to random positions
    for (vector of points) {
        vector.x = random(mainWidth);
        vector.y = random(mainHeight);
    }
}

function reset() {
    //reset values
    stroke(currentColor);
    background(0);
    totalOffset = 0;

    // replace all points to random positions
    for (vector of points) {
        vector.x = random(mainWidth);
        vector.y = random(mainHeight);
    }
}

function recreatePoints() {
    stroke(0, 255, 200, opacity);
    for (let i = 0; i < nbPoints; i++) {
        points.push(createVector(random(mainWidth), random(mainHeight)));
    }
}

///////////////////////////
//    Lien avec HTML     //
///////////////////////////

function inputNbParticle(event) {

    if (event.keyCode == 13) {
        points = []; // destroy all points
        nbPoints = document.getElementById("nbPoints").value; // get new amount of points

        // create points at random positions
        recreatePoints();

        refresh();
    }
}

function inputOpacity(event) {
    if (event.keyCode === 13) { // check if enter is pressed
        console.log("inputOpacity");
        opacity = Math.floor(document.getElementById("opacity").value); // change opacity (USE MATH.FLOOR BECAUSE STROKE DOESN'T ACCEPT FLOATS)
        currentColor.setAlpha(opacity); // set opacity in color
        stroke(currentColor); // set color in RGBA
        reset();
    }
}

function inputFade(event) {
    if (event.keyCode === 13) { // check if enter is pressed
        fadeSpeed = Math.floor(document.getElementById("fadeSpeed").value); // change fade speed (USE MATH.FLOOR BECAUSE STROKE DOESN'T ACCEPT FLOATS)
        reset();
    }
}

function inputSpeed(event) {

    if (event.keyCode == 13) {
        speed = document.getElementById("speed").value;
        refresh();
    }
}

function inputRotation(event){
    if (event.keyCode == 13) {
        rotationScale = document.getElementById("rotationScale").value;
        refresh();
    }
}

function clickOnRefresh() {
    speed = document.getElementById("speed").value;
    rotationScale = document.getElementById("rotationScale").value;
    points = []; // destroy all points
    nbPoints = document.getElementById("nbPoints").value;
    recreatePoints();
    refresh();
}



function colorToHex(hex) {
    //Convertir une couleur hexadécimale en RGB
    // Couper en trois parties 

    hex = hex.substring(1);
    //Couper en 3 parties avec comme 
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    console.log(r + "," + g + "," + b);
    return (r + "," + g + "," + b);
}