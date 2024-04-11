const notes = [];

function midiMessageReceived(event) {
    const NOTE_ON = 9;
    const NOTE_OFF = 8;

    const cmd = event.data[0] >> 4;
    const pitch = event.data[1];
    const timestamp = Date.now();

    if (cmd === NOTE_OFF || (cmd === NOTE_ON === 0)) {
        console.log(`🎧 from ${event.srcElement.name} note off: pitch:${pitch}`);

        const note = notesOn.get(pitch);
        if (note) {
            console.log(`🎵 pitch:${pitch}, duration:${timestamp - note} ms.`);
            notes.push(pitch);
            for (let i = 1; i < notes.length; i++) {
                const previousIndex = i - 1;
                console.log("Previous index :", previousIndex, "value :", notes[previousIndex]);
                notes.splice(previousIndex, 1);
            }
            console.log(notes)
            notesOn.delete(pitch);
        }
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

const initBtn = document.querySelector('#init');

function mappingSequences() {
    // fonction to map the notes
}

initBtn.addEventListener('click', mappingSequences);

window.onload = () => {
    const piano = document.getElementsByClassName("piano");
    for (let i = 1; i <= 25; i++) {
        const div = document.createElement("div");
        div.classList.add(i <= 10 ? "black" : "white");
        piano[0].appendChild(div);
        div.addEventListener('click', () => {
            console.log("test");
        });
    }
}