function midiMessageReceived(event) {
    console.log('MIDI message received:', event);
}

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
    for (let i = 1; i <= 24; i++) {
        const div = document.createElement("div");
        div.classList.add(i <= 10 ? "black" : "white");
        piano[0].appendChild(div);
        div.addEventListener('click', () => {
            console.log("test");
        });
    }
}