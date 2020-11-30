// init speechsynth api
const synth = window.speechSynthesis;

// dom elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//browser identifier
var isChrome = !!window.chrome && !!window.chrome.webstore;

// initialize voices array

let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  //   loop through the voices and create an option for each one
  voices.forEach((voice) => {
    // create option element
    const option = document.createElement('option');
    // fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';
    // set needded attribute
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);

    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// if (isChrome) {
//   if (synth.onvoiceschanged !== undefined) {
//     synth.onvoiceschanged = getVoices;
//   }
// }
// speak
const speak = () => {
  // check if speaking
  if (synth.speaking) {
    console.error('already speaking');
    return;
  }
  if (textInput.value !== '') {
    // add background animation
    body.style.background = '#141414 url(./img/img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';
    //   get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    // speak end
    speakText.onend = (e) => {
      textInput.value = '';
      body.style.background = '#141414';
    };

    // speak errror
    speakText.onerror = (e) => {
      console.error('something went wrong');
    };

    // selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribue(
      'data-name'
    );
    // loop through the voices
    voices.forEach((voice) => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });
    // set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // speak
    synth.speak(speakText);
  }
};

// event listeners

// text form submit
textForm.addEventListener('submit', (e) => {
  e.preventDefault();
  speak();
  textInput.blur();
});
// rate value change
rate.addEventListener('change', (e) => (rateValue.textContent = rate.value));
pitch.addEventListener('change', (e) => (pitchValue.textContent = pitch.value));

// voice select change
voiceSelect.addEventListener('change', (e) => speak());
