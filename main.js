const notes = [];
const pattern = ['B', 'N', 'B', 'N', 'B', 'B', 'N', 'B', 'N', 'B', 'N', 'B', 'B', 'N', 'B', 'N', 'B', 'B', 'N', 'B', 'N', 'B', 'N', 'B', 'B'];

const mapBtn = document.querySelector('#mapBtn');
let map = new Map();
let isMapping = false; 
let mapCount = 0;

function mapButtonClicked() {
    isMapping = true; 
    mapBtn.innerText = "mapping"; 
    mapBtn.disabled = true;
    alert("Toutes modifications est cruciale pour l'expérience utilisateur.");
    mappingKeys();
}

mapBtn.addEventListener('click', mapButtonClicked);

function midiMessageReceived(event) {
    const NOTE_ON = 9;
    const NOTE_OFF = 8;

    const cmd = event.data[0] >> 4;
    const pitch = event.data[1];

    if (cmd === NOTE_OFF || (cmd === NOTE_ON === 0)) {
        const noteDiv = document.querySelector(`.note${pitch-47}`);
        if (noteDiv) {
            noteDiv.style.backgroundColor = '';
        }
    } else if (cmd === NOTE_ON) {
        const noteDiv = document.querySelector(`.note${pitch-47}`);
        noteDiv.style.backgroundColor = 'red';
        if (isMapping) {
            mappingKeys();
        }
    }
}

function mappingKeys() {
    if (isMapping) {
        const noteDiv = document.querySelector(`.note${mapCount+1}`);
        if (noteDiv) {
            noteDiv.style.backgroundColor = 'yellow';
            mapCount++;
            if (mapCount === pattern.length) {
                alert("Le mappage est fini.");
                isMapping = false;
                mapBtn.disabled = false;
                mapBtn.innerText = "map";
            } else {
                midiKeyPressed();
            }
        }
    } else if (mapCount === 25) {
        alert("Le mappage est fini.");
    }
}

function midiKeyPressed() {
    if (isMapping) {
        const currentNoteDiv = document.querySelector(`.note${mapCount}`);
        const nextNoteDiv = document.querySelector(`.note${mapCount+1}`);
        
        if (currentNoteDiv) {
            currentNoteDiv.style.backgroundColor = '';
        }
        
        if (nextNoteDiv) {
            nextNoteDiv.style.backgroundColor = 'yellow';
        }
    }
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
        const inputDevice = input.value;
        console.log('Connected MIDI Input:', inputDevice.name);
        midiIn.push(inputDevice);
    }

    const outputs = midiAccess.outputs.values();
    for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
        const outputDevice = output.value;
        console.log('Connected MIDI Output:', outputDevice.name);
        midiOut.push(outputDevice);
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
    const offset = ['4em', '8.37em', '17.12em', '21.5em', '25.87em', '34.62em', '39em', '47.75em', '52.12em', '56.5em'];
    for (let i = 0; i < pattern.length; i++) {
        const div = document.createElement("div");
        div.classList.add(pattern[i] === 'B' ? "white" : "black");
        if (pattern[i] === 'N') {
            div.style.left = offset.shift();
        }
        div.classList.add(`note${i+1}`);
        piano[0].appendChild(div);
    }
}
