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
let source, buffer, paused = true, pauseTime, startTime;

getData('sample.wav');

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
	source.connect(context.destination);
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