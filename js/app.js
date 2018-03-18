'use strict';

const context = new AudioContext();
let source;

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

getData('sample.wav');