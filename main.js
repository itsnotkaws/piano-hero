const notes = [];
const pattern = ['B', 'N', 'B', 'N', 'B', 'B', 'N', 'B', 'N', 'B', 'N', 'B', 'B', 'N', 'B', 'N', 'B', 'B', 'N', 'B', 'N', 'B', 'N', 'B', 'B'];

const mapBtn = document.querySelector('#mapBtn');
let map = new Map();
let isMapping = false; 
let mapCount = 0;
let isFirstPress = true;

function mapButtonClicked() {
    isMapping = true; 
    mapBtn.innerText = "mapping"; 
    mapBtn.disabled = true;
    // alert("Toutes modifications est cruciale pour l'expérience utilisateur.");
    mappingKeys();
}

function midiMessageReceived(event) {
    const NOTE_ON = 9;
    const NOTE_OFF = 8;

    const cmd = event.data[0] >> 4;
    const pitch = event.data[1];
    const timestamp = Date.now();

    if (cmd === NOTE_OFF || (cmd === NOTE_ON === 0)) {
        const noteDiv = document.querySelector(`.note${pitch-47}`);
        if (noteDiv) {
            noteDiv.style.backgroundColor = '';
            // console.log(`Key released: ${pitch-47}`);
        }
    } else if (cmd === NOTE_ON) {
        const noteDiv = document.querySelector(`.note${pitch-47}`);
        noteDiv.style.backgroundColor = 'red';
        console.log(`Key pressed: ${pitch-47}`);
        if (isMapping) {
            midiKeyPressed(pitch);
            notesOn.set(pitch, timestamp);
            mappingKeys(pitch);
        }
        //console.log(`🎧 from ${event.srcElement.name} note off: pitch:${pitch}`);
    }
}

const notesOn = new Map();

function mappingKeys(pitch) {
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
                midiKeyPressed(pitch);
            }
        }
    } else if (mapCount === 25) {
        alert("Le mappage est fini.");
    }
}

function midiKeyPressed(pitch) {
    if (isMapping) {
        const noteDiv = document.querySelector(`.note${mapCount}`);
        if (noteDiv) {
            noteDiv.style.backgroundColor = 'yellow';
            console.log(`Key pressed: ${pitch-47}`);
            if (noteDiv.classList.contains(`note${mapCount}`) && (pitch - 47) === mapCount) {
                console.log("Correct key pressed");
                isKeyPressed = true;
            } else {
                if (isFirstPress) {
                    isFirstPress = false;
                } else {
                    if (!isKeyPressed) {
                        console.log("Incorrect key pressed");
                        isKeyPressed = true;
                    }
                }
            }
        }
    }
}

function mappingNextKeys() {
    const noteDiv = document.querySelector(`.note${mapCount}`);
    noteDiv.style.backgroundColor = '';
    noteDiv.removeEventListener('click', mappingNextKeys);
    mappingKeys();
}

mapBtn.addEventListener('click', mapButtonClicked);

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
            console.log("Clicked with mouse");
        });
    }
}
