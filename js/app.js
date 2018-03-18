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
let source;

getData('sample.wav');

function getData(path) {
	source = context.createBufferSource();
	let request = new XMLHttpRequest();
	request.open('GET', path, true);
	request.responseType = 'arraybuffer';

	request.onload = () => {
		let audioData = request.response;

		context.decodeAudioData(audioData, buffer => {
			source.buffer = buffer;
			source.connect(context.destination);
			source.loop = true;
		});
	};
	request.send();
}


// playback with source.start(0) and source.stop()

// event handlers
document.querySelector('.playbtn').addEventListener('click', () => {
	source.start(0);
})