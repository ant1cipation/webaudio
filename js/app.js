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
const gain = context.createGain();
const filter = context.createBiquadFilter();
gain.connect(filter);
const analyser = context.createAnalyser();
filter.connect(analyser);
let source, buffer, paused = true,
	pauseTime, startTime;

// get source
getData('sample.wav');

// initialize analyser and visualizer
analyser.connect(context.destination);
analyser.fftSize = 256;
analyser.smoothingTimeConstant = 0.9;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
let canvas = qS('.visualizer canvas');
let canvasCtx = canvas.getContext('2d');
const width = canvas.width,
	height = canvas.height;
canvasCtx.clearRect(0, 0, width, height);
draw();

function draw() {
	requestAnimationFrame(draw);

	analyser.getByteFrequencyData(dataArray);

	canvasCtx.fillStyle = '#fff';
	canvasCtx.fillRect(0, 0, width, height);

	let barWidth = (width / bufferLength);
	let barHeight, x = 0;
	for (const e of dataArray) {
		canvasCtx.fillStyle = '#000';
		canvasCtx.fillRect(x, height - e, barWidth, e);

		x += barWidth;
	}
}

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
	source.connect(gain);
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

	qS('.playback button').innerHTML = 'pause';
};

function pause() {
	source.stop(0);
	pauseTime = Date.now() - startTime;
	paused = true;

	qS('.playback button').innerHTML = 'play_arrow';
}

// event handlers
qS('.playback button').addEventListener('click', () => {
	paused ? play() : pause();
});
qS('select').addEventListener('input', e => {
	filter.type = e.target.value;
});
qS('.frequency-range').addEventListener('input', e => {
	filter.frequency.setValueAtTime(e.target.value, context.currentTime);
});
qS('.gain-range').addEventListener('input', e => {
	gain.gain.value = e.target.value / 10;
});