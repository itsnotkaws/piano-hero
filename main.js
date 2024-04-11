const notes = [];

function midiMessageReceived(event) {
    const NOTE_ON = 9;
    const NOTE_OFF = 8;

    const cmd = event.data[0] >> 4;
    const pitch = event.data[1];
    const timestamp = Date.now();

    if (cmd === NOTE_OFF || (cmd === NOTE_ON === 0)) {
        const noteDiv = document.querySelector(`.note${pitch-47}`);
        noteDiv.style.backgroundColor = '';

    } else if (cmd === NOTE_ON) {
        const noteDiv = document.querySelector(`.note${pitch-47}`);
        noteDiv.style.backgroundColor = 'red';

    } else if (cmd === NOTE_ON) {
        //console.log(`🎧 from ${event.srcElement.name} note off: pitch:${pitch}`);

        notesOn.set(pitch, timestamp);
    }
}

const notesOn = new Map();

function onMIDISuccess(midiAccess) {
    console.log('MIDI Access Granted');
    initDevices(midiAccess);
}

function onMIDIFailure() {
    console.error('MIDI Access Denied');
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function initDevices(midiAccess) {
    midiIn = [];
    midiOut = [];

    const inputs = midiAccess.inputs.values();
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        midiIn.push(input.value);
    }

    const outputs = midiAccess.outputs.values();
    for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
        midiOut.push(output.value);
    }

    startListening();
}

function startListening() {
    for (const input of midiIn) {
        input.addEventListener('midimessage', midiMessageReceived);
    }
}

window.onload = () => {
    const piano = document.getElementsByClassName("piano");
    const pattern = ['B', 'N', 'B', 'N', 'B', 'B', 'N', 'B', 'N', 'B', 'N', 'B', 'B', 'N', 'B', 'N', 'B', 'B', 'N', 'B', 'N', 'B', 'N', 'B', 'B'];
    const offset = ['4em', '8.37em', '17.12em', '21.5em', '25.87em', '34.62em', '39em', '47.75em', '52.12em', '56.5em'];
    for (let i = 0; i < pattern.length; i++) {
        const div = document.createElement("div");
        div.classList.add(pattern[i] === 'B' ? "white" : "black");
        if (pattern[i] === 'N') {
            div.style.left = offset.shift();
        }
        div.classList.add(`note${i+1}`);
        piano[0].appendChild(div);
        div.addEventListener('click', () => {
            console.log("test");
        });
    }
}
