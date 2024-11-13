const synth = window.speechSynthesis;

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voiceSelect");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");
const testButton = document.querySelector("#test-button");

let voices = [];

// Check if speech synthesis is supported
if (!('speechSynthesis' in window)) {
    alert('Speech synthesis is not supported in your browser. Please use Chrome, Edge, or Safari.');
    document.querySelector('button').disabled = true;
}

function populateVoiceList() {
    try {
        voices = synth.getVoices();
        console.log('Available voices:', voices.length);
        
        voiceSelect.innerHTML = '';
        
        if (voices.length === 0) {
            console.warn('No voices available yet. This might be due to voices loading asynchronously.');
            const option = document.createElement("option");
            option.textContent = "No voices available yet";
            voiceSelect.appendChild(option);
            return;
        }

        for (let i = 0; i < voices.length; i++) {
            const option = document.createElement("option");
            option.textContent = `${voices[i].name} (${voices[i].lang})`;

            if (voices[i].default) {
                option.textContent += " — DEFAULT";
                option.selected = true;
            }

            option.setAttribute("data-lang", voices[i].lang);
            option.setAttribute("data-name", voices[i].name);
            voiceSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error populating voice list:', error);
    }
}

function speak(text) {
    // Cancel any ongoing speech
    synth.cancel();

    try {
        console.log('Creating utterance with text:', text);
        const utterThis = new SpeechSynthesisUtterance(text);
        
        // Get selected voice
        const selectedOption = voiceSelect.selectedOptions[0].getAttribute("data-name");
        console.log('Selected voice:', selectedOption);
        
        // Find and set the voice
        const selectedVoice = voices.find(voice => voice.name === selectedOption);
        if (selectedVoice) {
            utterThis.voice = selectedVoice;
        } else {
            console.warn('Selected voice not found, using default');
        }

        // Set pitch and rate
        utterThis.pitch = pitch.value;
        utterThis.rate = rate.value;
        console.log('Pitch:', utterThis.pitch, 'Rate:', utterThis.rate);

        // Add event handlers for debugging
        utterThis.onstart = () => console.log('Speech started');
        utterThis.onend = () => console.log('Speech ended');
        utterThis.onerror = (event) => console.error('Speech error:', event);

        console.log('Starting speech...');
        synth.speak(utterThis);

    } catch (error) {
        console.error('Error during speech synthesis:', error);
        alert('An error occurred while trying to speak. Please check the console for details.');
    }
}

// Update the pitch and rate values display
pitch.addEventListener('input', () => {
    pitchValue.textContent = pitch.value;
});

rate.addEventListener('input', () => {
    rateValue.textContent = rate.value;
});

// Initial population of voices
populateVoiceList();

// Chrome loads voices asynchronously
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        console.log('Voices changed event fired');
        populateVoiceList();
    };
}

// Handle form submission
inputForm.onsubmit = (event) => {
    event.preventDefault();

    if (inputTxt.value.trim() === '') {
        alert('Please enter some text to speak');
        return;
    }

    speak(inputTxt.value);
    inputTxt.blur();
};

// Handle test button click
testButton.addEventListener('click', () => {
    const testText = "Hello World";
    inputTxt.value = testText;
    speak(testText);
});
