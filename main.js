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