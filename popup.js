const fontToggle = document.getElementById("fontToggle");
const rulerToggle = document.getElementById("rulerToggle");
const summaryToggle = document.getElementById("summaryToggle");
const textSize = document.getElementById("textSize");
const textSizeValue = document.getElementById("textSizeValue");
const pageTint = document.getElementById("pageTint");
const readingGrade = document.getElementById("readingGrade");

const defaults = {
  fontEnabled: false,
  rulerEnabled: false,
  summaryEnabled: false,
  textScale: 100,
  pageTint: "none",
  readingGrade: "5",
};

function updateTextSizeLabel() {
  textSizeValue.value = `${textSize.value}%`;
  textSizeValue.textContent = `${textSize.value}%`;
}

function applyReadingPreferences(preferences) {
  const tintColors = {
    none: "transparent",
    cream: "#fff7e6",
    blue: "#edf7ff",
    green: "#eef9ef",
  };
  const styleId = "dyslexia-reading-style";
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  const fontRules = preferences.fontEnabled
    ? "font-family: 'OpenDyslexic', Arial, sans-serif !important; letter-spacing: 0.05em !important; word-spacing: 0.1em !important; line-height: 1.8 !important;"
    : "";
  const tint = tintColors[preferences.pageTint] || tintColors.none;

  styleTag.textContent = `
    ${preferences.fontEnabled ? "@import url('https://fonts.cdnfonts.com/css/opendyslexic');" : ""}
    html { background-color: ${tint} !important; }
    body { background-color: ${tint} !important; font-size: ${preferences.textScale}% !important; }
    body p, body span, body h1, body h2, body h3, body h4, body h5, body h6, body li, body a, body label, body input, body textarea, body button { ${fontRules} }
  `;

  // Overlay for full-page background
  const tintOverlayId = "dyslexia-reading-tint-overlay";
  const existingTintOverlay = document.getElementById(tintOverlayId);
  const overlayColors = {
    cream: "rgba(255, 228, 154, 0.16)",
    blue: "rgba(158, 213, 247, 0.14)",
    green: "rgba(178, 229, 178, 0.14)",
  };
  if (preferences.pageTint === "none") {
    existingTintOverlay?.remove();
  } else {
    const tintOverlay = existingTintOverlay || document.createElement("div");
    tintOverlay.id = tintOverlayId;
    tintOverlay.setAttribute("aria-hidden", "true");
    tintOverlay.style.cssText = `position:fixed;inset:0;z-index:2147483647;pointer-events:none;background:${overlayColors[preferences.pageTint] || overlayColors.cream};`;
    if (!existingTintOverlay) document.documentElement.appendChild(tintOverlay);
  }

  // Reading Ruler logic
  const rulerId = "dyslexia-reading-ruler";
  const existingRuler = document.getElementById(rulerId);
  if (preferences.rulerEnabled && !existingRuler) {
    const ruler = document.createElement("div");
    ruler.id = rulerId;
    ruler.setAttribute("aria-hidden", "true");
    ruler.style.cssText =
      "position:fixed;z-index:2147483647;left:0;width:100vw;height:38px;pointer-events:none;display:none;background:rgba(255,220,115,.18);border-top:1px solid rgba(188,138,0,.42);border-bottom:1px solid rgba(188,138,0,.42);";
    document.documentElement.appendChild(ruler);
    document.__dyslexiaRulerHandler = (event) => {
      ruler.style.display = "block";
      ruler.style.top = `${Math.max(0, event.clientY - 19)}px`;
    };
    document.addEventListener(
      "mousemove",
      document.__dyslexiaRulerHandler,
      true,
    );
  } else if (!preferences.rulerEnabled && existingRuler) {
    existingRuler.remove();
    document.removeEventListener(
      "mousemove",
      document.__dyslexiaRulerHandler,
      true,
    );
    delete document.__dyslexiaRulerHandler;
  }

  const summaryClass = "dyslexia-ai-summary";

  if (!preferences.summaryEnabled) {
    document
      .querySelectorAll(`.${summaryClass}`)
      .forEach((summary) => (summary.style.display = "none"));
    return;
  }

  const summaryStyleId = "dyslexia-ai-summary-style";
  if (!document.getElementById(summaryStyleId)) {
    const summaryStyle = document.createElement("style");
    summaryStyle.id = summaryStyleId;
    summaryStyle.textContent = `
      .${summaryClass} { margin: 12px 0 20px; }
      .${summaryClass} details { overflow: hidden; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04); }
      .${summaryClass} summary { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; color: #1e40af; cursor: pointer; font-size: calc(13px * var(--dyslexia-summary-scale)); font-weight: 700; list-style: none; user-select: none; background: #f8fafc; }
      .${summaryClass} summary::-webkit-details-marker { display: none; }
      .${summaryClass} summary::before { content: "✦"; margin-right: 8px; color: #2563eb; }
      .${summaryClass} .dyslexia-summary-title { display: flex; align-items: center; flex-grow: 1; }
      .${summaryClass} .dyslexia-minimize-btn { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; background: #e2e8f0; color: #475569; font-weight: 800; font-size: 14px; line-height: 1; margin-left: 8px; transition: background 0.15s ease; }
      .${summaryClass} details[open] .dyslexia-minimize-btn::after { content: "−"; }
      .${summaryClass} details:not([open]) .dyslexia-minimize-btn::after { content: "+"; }
      .${summaryClass} summary:hover .dyslexia-minimize-btn { background: #cbd5e1; color: #0f172a; }
      .${summaryClass} .dyslexia-summary-text { padding: 12px 14px 14px; color: #334155; font-size: calc(13px * var(--dyslexia-summary-scale)); line-height: 1.6; border-top: 1px solid #f1f5f9; }
      .${summaryClass} .dyslexia-summary-text[hidden] { display: none; }
      .${summaryClass} .dyslexia-summary-list { margin: 6px 0 10px; padding-left: 20px; line-height: 1.6; }
      .${summaryClass} .dyslexia-summary-list li + li { margin-top: 6px; }
      .${summaryClass} .dyslexia-overview-words { margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; }
      .${summaryClass} .dyslexia-overview-words-title { display: block; margin-bottom: 6px; color: #1e40af; font-size: calc(11px * var(--dyslexia-summary-scale)); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
      .${summaryClass} .dyslexia-word { display: inline; font-size: calc(12px * var(--dyslexia-summary-scale)); line-height: 1.5; }
      .${summaryClass} .dyslexia-word + .dyslexia-word::before { content: " • "; color: #94a3b8; }
      .${summaryClass} .dyslexia-word strong { color: #0f172a; }
      .${summaryClass} .dyslexia-rewrite-button { width: 100%; margin-top: 12px; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; color: #1e40af; cursor: pointer; font: inherit; font-size: calc(12px * var(--dyslexia-summary-scale)); font-weight: 700; background: #f8fafc; transition: background 0.15s ease; }
      .${summaryClass} .dyslexia-rewrite-button:hover { background: #eff6ff; border-color: #93c5fd; }
      .${summaryClass} .dyslexia-rewrite-result { margin: 12px 0 0; padding: 12px 14px; border-left: 3px solid #2563eb; color: #1e293b; line-height: 1.8; background: #f8fafc; border-radius: 0 8px 8px 0; }
    `;
    document.head.appendChild(summaryStyle);
  }

  const paragraphs = Array.from(document.querySelectorAll("p"));
  paragraphs.forEach((paragraph) => {
    const paragraphText = paragraph.innerText.trim().replace(/\s+/g, " ");
    if (
      paragraphText.length < 80 ||
      paragraph.closest(
        "nav, footer, header, aside, form, .dyslexia-ai-summary",
      )
    )
      return;

    // Check if a summary card already exists for this paragraph
    let wrapper = paragraph.nextElementSibling;
    if (wrapper && wrapper.classList.contains(summaryClass)) {
      wrapper.style.display = "block";
      wrapper.style.setProperty(
        "--dyslexia-summary-scale",
        String(preferences.textScale / 100),
      );
      if (preferences.fontEnabled) {
        wrapper.style.fontFamily = "'OpenDyslexic', Arial, sans-serif";
      } else {
        wrapper.style.fontFamily = "";
      }
      return; // Do not recreate or re-add listeners to existing summary box
    }

    wrapper = document.createElement("div");
    wrapper.className = summaryClass;
    wrapper.style.setProperty(
      "--dyslexia-summary-scale",
      String(preferences.textScale / 100),
    );
    if (preferences.fontEnabled) {
      wrapper.style.fontFamily = "'OpenDyslexic', Arial, sans-serif";
      wrapper.style.letterSpacing = "0.05em";
      wrapper.style.wordSpacing = "0.1em";
    }

    wrapper.innerHTML = `
      <details>
        <summary>
          <span class="dyslexia-summary-title">Get AI overview</span>
          <span class="dyslexia-minimize-btn" title="Minimize / Expand"></span>
        </summary>
        <div class="dyslexia-summary-text" hidden></div>
      </details>
    `;

    const details = wrapper.querySelector("details");
    const summaryText = wrapper.querySelector(".dyslexia-summary-text");

    // Prevent interactions inside the summary box from closing details
    summaryText.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    details.addEventListener("toggle", async () => {
      // If closing or already fetched once on this paragraph node, NEVER re-fetch
      if (!details.open || paragraph.__dyslexiaSummaryCache) return;

      summaryText.hidden = false;

      // Check if cache already exists on paragraph object
      if (paragraph.__dyslexiaSummaryCache) {
        summaryText.replaceChildren(
          paragraph.__dyslexiaSummaryCache.cloneNode(true),
        );
        return;
      }

      summaryText.textContent = "Creating a simpler summary…";

      chrome.runtime.sendMessage(
        { type: "summarizeParagraph", text: paragraphText },
        (response) => {
          if (chrome.runtime.lastError) {
            summaryText.textContent =
              "Unable to create a summary on this page.";
            return;
          }
          const summary =
            response?.summary ||
            response?.error ||
            "Unable to create a summary. Check your Azure OpenAI settings.";
          const [wordsPart, summaryPart] = summary.includes("SUMMARY:")
            ? summary.split("SUMMARY:", 2)
            : ["", summary];
          const wordLines = wordsPart
            .replace("DIFFICULT_WORDS:", "")
            .split(/\n+/)
            .map((word) => word.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
            .filter(Boolean);
          const points = summaryPart
            .split(/\n+/)
            .map((point) =>
              point.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim(),
            )
            .filter(Boolean);
          const content = document.createDocumentFragment();

          if (wordLines.length) {
            const wordSection = document.createElement("div");
            wordSection.className = "dyslexia-overview-words";
            const title = document.createElement("span");
            title.className = "dyslexia-overview-words-title";
            title.textContent = "Helpful words";
            wordSection.appendChild(title);
            wordLines.forEach((word) => {
              const item = document.createElement("span");
              item.className = "dyslexia-word";
              const [term, ...meaningParts] = word.split(/\s*[—:-]\s*/, 2);
              const termElement = document.createElement("strong");
              termElement.textContent = term;
              item.append(
                termElement,
                meaningParts.length ? ` — ${meaningParts.join("")}` : "",
              );
              wordSection.appendChild(item);
            });
            content.appendChild(wordSection);
          }

          const list = document.createElement("ul");
          list.className = "dyslexia-summary-list";
          (points.length ? points : [summaryPart]).forEach((point) => {
            const item = document.createElement("li");
            item.textContent = point;
            list.appendChild(item);
          });
          content.appendChild(list);

          const rewriteButton = document.createElement("button");
          rewriteButton.type = "button";
          rewriteButton.className = "dyslexia-rewrite-button";
          rewriteButton.textContent = `Rewrite for Grade ${preferences.readingGrade}`;
          rewriteButton.addEventListener("click", (e) => {
            e.stopPropagation();
            rewriteButton.disabled = true;
            rewriteButton.textContent = "Rewriting passage…";
            chrome.runtime.sendMessage(
              {
                type: "rewriteParagraph",
                text: paragraphText,
                grade: preferences.readingGrade,
              },
              (rewriteResponse) => {
                const rewrite =
                  rewriteResponse?.rewrite ||
                  rewriteResponse?.error ||
                  "Unable to rewrite this passage.";
                const rewriteResult = document.createElement("div");
                rewriteResult.className = "dyslexia-rewrite-result";
                rewriteResult.style.setProperty(
                  "letter-spacing",
                  "0.05em",
                  "important",
                );
                rewriteResult.style.setProperty(
                  "word-spacing",
                  "0.1em",
                  "important",
                );
                rewriteResult.style.setProperty(
                  "line-height",
                  "1.8",
                  "important",
                );
                rewriteResult.textContent = rewrite;
                rewriteButton.replaceWith(rewriteResult);

                // Cache updated fragment with rewrite attached
                paragraph.__dyslexiaSummaryCache = content.cloneNode(true);
              },
            );
          });
          content.appendChild(rewriteButton);

          // Save generated DOM content in memory cache on paragraph
          paragraph.__dyslexiaSummaryCache = content.cloneNode(true);
          summaryText.replaceChildren(content);
        },
      );
    });
    paragraph.insertAdjacentElement("afterend", wrapper);
  });
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

function readPreferences() {
  return {
    fontEnabled: fontToggle.checked,
    rulerEnabled: rulerToggle.checked,
    summaryEnabled: summaryToggle.checked,
    textScale: Number(textSize.value),
    pageTint: pageTint.value,
    readingGrade: readingGrade.value,
  };
}

function saveAndApply() {
  const preferences = readPreferences();
  chrome.storage.local.set(preferences);
  applyToActiveTab(preferences);
}

chrome.storage.local.get(defaults, (preferences) => {
  fontToggle.checked = preferences.fontEnabled;
  rulerToggle.checked = preferences.rulerEnabled;
  summaryToggle.checked = preferences.summaryEnabled;
  textSize.value = preferences.textScale;
  pageTint.value = preferences.pageTint;
  readingGrade.value = preferences.readingGrade;
  updateTextSizeLabel();
  applyToActiveTab(preferences);
});

fontToggle.addEventListener("change", saveAndApply);
rulerToggle.addEventListener("change", saveAndApply);
summaryToggle.addEventListener("change", saveAndApply);
pageTint.addEventListener("change", saveAndApply);
readingGrade.addEventListener("change", saveAndApply);
textSize.addEventListener("input", () => {
  updateTextSizeLabel();
  saveAndApply();
});
