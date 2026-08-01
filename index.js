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
