var WIDTH = 1000,
    HEIGHT = 500; // canvas size
var OFFSET = 10; // space between rectangles
var BG_COLOR = 'white'; //background color
var NUMBER_OF_SOUNDS = 8;

var RECT_W = WIDTH / NUMBER_OF_SOUNDS - OFFSET,
    RECT_H = 500,
    RECT_R = 10; // rectangles parameters

var sounds = ['suoni/bell.wav',
              'suoni/violin.wav',
              'suoni/gong.wav',
              'suoni/trumpet.wav',
              'suoni/whistle.wav',
              'suoni/bongos.wav',
              'suoni/bass.wav',
              'suoni/maracas.wav'],
    colors = [],
    rects = [],
    timeframes = [];
var curr_timeframe = 0, // index of the current timeframe to reach 
    writing_position = 0, // position of the timeframes array where to write the next timeframe
    max_timeframes = 50; //useful to avoid wastes of memory
var buttonPressed = false,
    onStart = true;


function preload() {
    loadSounds();
    randomize_colors();
    initialize_rects_params();
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
    fill_background();
    randomize_colors();
    for (let i = 0; i < NUMBER_OF_SOUNDS; i++) {
        let y = random(HEIGHT - 10);

        fill(colors[i]);
        rect(rects[i][0], y, rects[i][2], HEIGHT - y, rects[i][3]);
    }
}

function draw() {
    if (buttonPressed) {
        let random_sound = floor(random(NUMBER_OF_SOUNDS)); // indice dell'array da cui pescare il suono da riprodurre (scelto a caso)
        let seconds_to_wait = random(2, 5); // secondi tra un suono e il successivo

        if (onStart) { // se il programma è appena iniziato, riproduciamo subito il primo suono
            seconds_to_wait = 0;
            onStart = false;
        }

        fill_background();
        update_timeframes(seconds_to_wait);
        play_and_draw(random_sound);
    }
}

function fill_background() {
    for (let i = 0; i < NUMBER_OF_SOUNDS; i++) {
        noStroke();
        fill(BG_COLOR);
        rect(i * WIDTH / NUMBER_OF_SOUNDS, 0, WIDTH / NUMBER_OF_SOUNDS, HEIGHT);
    }
}

function update_timeframes(next_timeframe) {
    // writes the next timeframe in the array containing all the timeframes
    // N.B.: the array has a fixed dimension to avoid waste of resources, thus every time we reach the end of the array, we restart writing from the beginning of the array 

    if (writing_position == max_timeframes) {
        writing_position = 0;
        curr_timeframe = 0;
        timeframes = [];
    }
    if (writing_position - curr_timeframe < 5) {
        timeframes[writing_position++] = next_timeframe;
    }
}

function play_and_draw(sound_to_play) {
    for (let i = 0; i < sounds.length; i++) {
        if (i == sound_to_play && !sounds[i].isPlaying()) {
            change_color(i);
            sounds[i].play(timeframes[curr_timeframe]);
            curr_timeframe++;
        }
        fill_rect(i);
    }
}

function fill_rect(i) {
    let color = colors[i];
    let m = (HEIGHT - rects[i][1]) / sounds[i].duration();
    let x = rects[i][0];
    let y = m * sounds[i].currentTime() + rects[i][1];
    let w = rects[i][2];
    let h = HEIGHT - y;
    let r = rects[i][3];

    if (!sounds[i].isPlaying() || sounds[i].duration() - sounds[i].currentTime() < 0.1) {
        h = 0;
    }

    fill(color[0], color[1], color[2]);
    rect(x, y, w, h, r);
}

function loadSounds() {
    for (let i = 0; i < NUMBER_OF_SOUNDS; i++) {
        sounds[i] = loadSound(sounds[i]);
    }
}

function initialize_rects_params() {
    i = 0;

    for (let i = 0; i < NUMBER_OF_SOUNDS; i++) {
        if (i > 0) {
            rects[i] = [RECT_W * i + OFFSET * (i + 1), HEIGHT - RECT_H, RECT_W, RECT_R];
        } else {
            rects[i] = [OFFSET, HEIGHT - RECT_H, RECT_W, RECT_R];
        }
    }
}


function randomize_colors() {
    for (i = 0; i < NUMBER_OF_SOUNDS; i++) {
        change_color(i);
    }
}

function change_color(i) {
    let r = floor(random(256));
    let g = floor(random(256));
    let b = floor(random(256));

    colors[i] = [r, g, b];
}

function pressStart() {
    // starts drawing if start button is pressed
    buttonPressed = true;
}


function pressStop() {
    // stops drawing if stop button is pressed
    buttonPressed = false;
    onStart = true;
    for (let i = 0; i < sounds.length; i++) {
        if (sounds[i].isPlaying()) {
            sounds[i].stop();
        }
        empty_rect(i);
    }
}

window.onload = function () {
    var startbtn = document.getElementById("startButton");
    var stopbtn = document.getElementById("stopButton");
    startbtn.onclick = pressStart;
    stopbtn.onclick = pressStop;
}
