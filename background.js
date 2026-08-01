const API_VERSION = "2024-06-01";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "summarizeParagraph") {
    summarizeParagraph(message.text)
      .then((summary) => sendResponse({ summary }))
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }

  if (message.type === "rewriteParagraph") {
    rewriteParagraph(message.text, message.grade)
      .then((rewrite) => sendResponse({ rewrite }))
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }
});

async function getAzureSettings() {
  const settings = await chrome.storage.sync.get([
    "azure_endpoint",
    "azure_deployment",
    "azure_key",
  ]);
  const { azure_endpoint: endpoint, azure_deployment: deployment, azure_key: apiKey } = settings;

  if (!endpoint || !deployment || !apiKey) {
    throw new Error("Add your Azure OpenAI settings in the extension options first.");
  }

  return { endpoint, deployment, apiKey };
}

async function summarizeParagraph(text) {
  const { endpoint, deployment, apiKey } = await getAzureSettings();

  const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${encodeURIComponent(deployment)}/chat/completions?api-version=${API_VERSION}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "You make text easier to read for a person with dyslexia. First identify up to 3 difficult words in the text and give a very short, simple meaning for each. Then summarize the text using 2 to 4 short bullet points. Each bullet must contain one idea and no more than 12 simple words. Use plain language and keep only the essential meaning. Return exactly this format, with no extra text:\nDIFFICULT_WORDS:\n- word — simple meaning\nSUMMARY:\n- short point",
        },
        { role: "user", content: text.slice(0, 6000) },
      ],
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = result.error?.message || result.message || "No error details were returned.";
    throw new Error(`Azure OpenAI request failed (${response.status}): ${detail}`);
  }
  const summary = result.choices?.[0]?.message?.content?.trim();
  if (!summary) throw new Error("Azure OpenAI did not return a summary.");
  return summary;
}

async function rewriteParagraph(text, grade) {
  const { endpoint, deployment, apiKey } = await getAzureSettings();
  const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${encodeURIComponent(deployment)}/chat/completions?api-version=${API_VERSION}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: `Rewrite text for a Grade ${grade} reader with dyslexia. Keep the original meaning and key facts. Use short sentences, familiar words, one idea per sentence, and clear paragraph breaks. Return only the rewritten passage.`,
        },
        { role: "user", content: text.slice(0, 6000) },
      ],
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = result.error?.message || result.message || "No error details were returned.";
    throw new Error(`Azure OpenAI request failed (${response.status}): ${detail}`);
  }
  const rewrite = result.choices?.[0]?.message?.content?.trim();
  if (!rewrite) throw new Error("Azure OpenAI did not return a rewrite.");
  return rewrite;
}
