// init SpeechSynthesis API
const synth = window.speechSynthesis;

//DOM Elements
const textForm = document.querySelector('form'),
  textInput = document.querySelector('#text-input'),
  voiceSelect = document.querySelector('#voice-select'),
  rate = document.querySelector('#rate'),
  rateValue = document.querySelector('#rate-value'),
  pitch = document.querySelector('#pitch'),
  pitchValue = document.querySelector('#pitch-value'),
  body = document.querySelector('body');

//   init Voices Array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();
  //   loop through all voices and create an option for each one
  voices.forEach(voice => {
    // create option element
    const option = document.createElement('option');
    // fill the option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';
    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};
getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// speak
const speak = () => {
  // check if speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textInput.value !== '') {
    // Add background animation
    body.style.background = '#141414 url(./img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';

    //   Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    // Speak end
    speakText.onend = e => {
      body.style.background = '#141414';
      console.log('Done speaking');
    };
    // speak error
    speakText.onerror = e => {
      console.error('something went wrong');
    };
    // selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );
    // Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // Speak
    synth.speak(speakText);
  }
};

// Event Listeners

// Text form submit
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));
rate.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// voice select change
voiceSelect.addEventListener('change', e => speak());
