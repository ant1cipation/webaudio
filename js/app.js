'use strict';

// helpers
function qS(q) {
	return document.querySelector(q);
}

function qSA(q) {
	return document.querySelectorAll(q);
}

// code
const context = new AudioContext();
let source, buffer, paused = true,
	pauseTime, startTime;

// get source
getData('sample.wav');

// initialize analyser and visualizer
const analyser = context.createAnalyser();
analyser.connect(context.destination);
analyser.fftSize = 256;
analyser.smoothingTimeConstant = 0.9;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
let canvas = qS('.vis-canvas');
let canvasCtx = canvas.getContext('2d');
const width = canvas.width,
	height = canvas.height;
canvasCtx.clearRect(0, 0, width, height);

function draw() {
	const drawVisual = requestAnimationFrame(draw);

	analyser.getByteFrequencyData(dataArray);

	canvasCtx.fillStyle = '#fff';
	canvasCtx.fillRect(0, 0, width, height);

	let barWidth = (width / bufferLength) * 2.5;
	let barHeight, x = 0;
	for (const e of dataArray) {
		canvasCtx.fillStyle = '#000';
		canvasCtx.fillRect(x, height - e, barWidth, e);

		x += barWidth + 1;
	}
}
draw();


function getData(path) {
	let request = new XMLHttpRequest();
	request.open('GET', path, true);
	request.responseType = 'arraybuffer';

	request.onload = () => {
		let audioData = request.response;
		context.decodeAudioData(audioData, b => {
			buffer = b;
		});
	};
	request.send();
}

function play() {
	source = context.createBufferSource();
	source.connect(analyser);
	source.loop = true;
	source.buffer = buffer;
	paused = false;

	if (pauseTime) {
		startTime = Date.now() - pauseTime;
		source.start(0, pauseTime / 1000);
	} else {
		startTime = Date.now();
		source.start(0);
	}
};

function pause() {
	source.stop(0);
	pauseTime = Date.now() - startTime;
	paused = true;
}

// event handlers
qS('.playbtn').addEventListener('click', () => {
	paused ? play() : pause();
});