/* ============ TAB SWITCHING ============ */
const tabBtns = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

/* ============ TEXT TO SPEECH ============ */
const ttsInput = document.getElementById("ttsInput");
const voiceSelect = document.getElementById("voiceSelect");
const rateRange = document.getElementById("rateRange");
const pitchRange = document.getElementById("pitchRange");
const rateVal = document.getElementById("rateVal");
const pitchVal = document.getElementById("pitchVal");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const ttsStatus = document.getElementById("ttsStatus");

const synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = "";
  voices.forEach((v, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${v.name} (${v.lang})`;
    voiceSelect.appendChild(opt);
  });
}

loadVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = loadVoices;
}

rateRange.addEventListener("input", () => rateVal.textContent = rateRange.value);
pitchRange.addEventListener("input", () => pitchVal.textContent = pitchRange.value);

speakBtn.addEventListener("click", () => {
  const text = ttsInput.value.trim();
  if (!text) {
    setStatus(ttsStatus, "Please enter some text first.", "error");
    return;
  }
  if (!("speechSynthesis" in window)) {
    setStatus(ttsStatus, "Speech synthesis is not supported in this browser.", "error");
    return;
  }

  synth.cancel(); // stop anything currently playing

  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = voices[voiceSelect.value];
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.rate = parseFloat(rateRange.value);
  utterance.pitch = parseFloat(pitchRange.value);

  utterance.onstart = () => setStatus(ttsStatus, "Speaking...", "success");
  utterance.onend = () => setStatus(ttsStatus, "Done.", "");
  utterance.onerror = (e) => setStatus(ttsStatus, "Error: " + e.error, "error");

  synth.speak(utterance);
});

pauseBtn.addEventListener("click", () => {
  if (synth.speaking && !synth.paused) {
    synth.pause();
    setStatus(ttsStatus, "Paused.", "");
  }
});

resumeBtn.addEventListener("click", () => {
  if (synth.paused) {
    synth.resume();
    setStatus(ttsStatus, "Resumed.", "success");
  }
});

stopBtn.addEventListener("click", () => {
  synth.cancel();
  setStatus(ttsStatus, "Stopped.", "");
});

/* ============ SPEECH TO TEXT ============ */
const recordBtn = document.getElementById("recordBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const sttOutput = document.getElementById("sttOutput");
const sttStatus = document.getElementById("sttStatus");
const sttLang = document.getElementById("sttLang");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;
let finalTranscript = "";

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    isListening = true;
    recordBtn.textContent = "⏹ Stop Listening";
    recordBtn.classList.add("recording");
    setStatus(sttStatus, "Listening...", "success");
  };

  recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
    }
    sttOutput.value = finalTranscript + interimTranscript;
  };

  recognition.onerror = (event) => {
    setStatus(sttStatus, "Error: " + event.error, "error");
  };

  recognition.onend = () => {
    isListening = false;
    recordBtn.textContent = "🎤 Start Listening";
    recordBtn.classList.remove("recording");
    if (sttStatus.textContent === "Listening...") {
      setStatus(sttStatus, "Stopped.", "");
    }
  };
} else {
  recordBtn.disabled = true;
  setStatus(sttStatus, "Speech recognition is not supported in this browser. Try Chrome or Edge.", "error");
}

recordBtn.addEventListener("click", () => {
  if (!recognition) return;

  if (isListening) {
    recognition.stop();
  } else {
    finalTranscript = sttOutput.value ? sttOutput.value + " " : "";
    recognition.lang = sttLang.value;
    recognition.start();
  }
});

clearBtn.addEventListener("click", () => {
  sttOutput.value = "";
  finalTranscript = "";
  setStatus(sttStatus, "Cleared.", "");
});

copyBtn.addEventListener("click", () => {
  if (!sttOutput.value) return;
  navigator.clipboard.writeText(sttOutput.value)
    .then(() => setStatus(sttStatus, "Copied to clipboard!", "success"))
    .catch(() => setStatus(sttStatus, "Could not copy.", "error"));
});

/* ============ HELPERS ============ */
function setStatus(el, msg, type) {
  el.textContent = msg;
  el.className = "status" + (type ? " " + type : "");
}
