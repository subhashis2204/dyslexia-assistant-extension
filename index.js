const fontToggle = document.getElementById("fontToggle");
const rulerToggle = document.getElementById("rulerToggle");
const summaryToggle = document.getElementById("summaryToggle");
const textSize = document.getElementById("textSize");
const textSizeValue = document.getElementById("textSizeValue");
const letterSpacing = document.getElementById("letterSpacing");
const letterSpacingValue = document.getElementById("letterSpacingValue");
const wordSpacing = document.getElementById("wordSpacing");
const wordSpacingValue = document.getElementById("wordSpacingValue");
const pageTint = document.getElementById("pageTint");
const readingGrade = document.getElementById("readingGrade");

const defaults = {
  fontEnabled: false,
  rulerEnabled: false,
  summaryEnabled: false,
  textScale: 100,
  pageTint: "none",
  readingGrade: "5",
  letterSpacing: 0.05,
  wordSpacing: 0.1,
};

function updateTextSizeLabel() {
  textSizeValue.value = `${textSize.value}%`;
  textSizeValue.textContent = `${textSize.value}%`;
}

function updateLetterSpacingLabel() {
  letterSpacingValue.value = `${letterSpacing.value}em`;
  letterSpacingValue.textContent = `${letterSpacing.value}em`;
}

function updateWordSpacingLabel() {
  wordSpacingValue.value = `${wordSpacing.value}em`;
  wordSpacingValue.textContent = `${wordSpacing.value}em`;
}

function readPreferences() {
  return {
    fontEnabled: fontToggle.checked,
    rulerEnabled: rulerToggle.checked,
    summaryEnabled: summaryToggle.checked,
    textScale: Number(textSize.value),
    letterSpacing: Number(letterSpacing.value),
    wordSpacing: Number(wordSpacing.value),
    pageTint: pageTint.value,
    readingGrade: readingGrade.value,
  };
}

function applyReadingPreferences(preferences) {
  const tintColors = {
    none: "transparent",
    cream: "#fff7e6",
    blue: "#edf7ff",
    green: "#eef9ef",
  };

  let styleTag = document.querySelector("#dyslexia-reading-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dyslexia-reading-style";
    document.head.appendChild(styleTag);
  }

  if (preferences.fontEnabled) {
    const fontRules = `
        @import url('https://fonts.cdnfonts.com/css/opendyslexic');

        * {
            font-family: 'OpenDyslexic', Arial, sans-serif !important;
            letter-spacing: ${preferences.letterSpacing}em !important;
            word-spacing: ${preferences.wordSpacing}em !important; 
            line-height: 1.8 !important;
        }`;

    styleTag.textContent = fontRules;
  } else {
    styleTag.textContent = "";
  }
}
function saveAndApply() {
  const preferences = readPreferences();
  chrome.storage.local.set(preferences);
  applyToActiveTab(preferences);
}

async function applyToActiveTab(preferences) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: applyReadingPreferences,
      args: [preferences],
    });
  } catch {
    // Browser internal pages cannot be modified.
  }
}

fontToggle.addEventListener("change", saveAndApply);
rulerToggle.addEventListener("change", saveAndApply);
summaryToggle.addEventListener("change", saveAndApply);
pageTint.addEventListener("change", saveAndApply);
readingGrade.addEventListener("change", saveAndApply);
