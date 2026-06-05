function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  appendMessage('user', text);

  let response = null;
  const t = text.toLowerCase();

  // Keyword-based responses
  const responsesMap = {
    'schizophr': "Schizophrenia severity score prediction analyzes speech biomarkers (like MFCCs and ZCR) to assist clinical decision making.",
    'depress': "This system is optimized for schizophrenia severity analysis rather than depression monitoring. Would you like to learn about speech biomarker analysis?",
    'stress': "Stress can impact clinical symptoms. Proper routine structures and sleep hygiene can help manage it.",
    'anxious': "Anxiety is common. We recommend tracking clinical symptoms and consulting a professional.",
    'overwhelm': "If a patient is overwhelmed, professional psychiatric consultation and family support are advised.",
    'voices': "Auditory hallucinations ('hearing voices') are key symptoms evaluated under clinical severity classification.",
    'hallucination': "Hallucinations are tracked under severity scores. Let me know if you want info on speech patterns.",
    'paranoid': "Paranoia is an important symptom in clinical severity assessments. We analyze speech biomarkers to monitor symptom trends.",
    'hello': "Hello! I am your clinical support assistant. How can I help you today?",
    'hi': "Hi there! I can assist with schizophrenia severity assessments and speech biomarker questions.",
    'hey': "Hey! How can I support your clinical evaluation today?",
    'help': "I provide clinical support for schizophrenia severity assessments. What details do you need?",
    'scale': "The severity score ranges from 0 to 10: Minimal (0-2.5), Mild (2.5-5), Moderate (5-7.5), and Severe (7.5-10).",
    'score': "The severity score ranges from 0 to 10: Minimal (0-2.5), Mild (2.5-5), Moderate (5-7.5), and Severe (7.5-10)."
  };

  // Match keywords
  for (let keyword in responsesMap) {
    if (new RegExp(`\\b${keyword}\\b`, 'i').test(t)) {
      response = responsesMap[keyword];
      break; // stop at first match (important improvement)
    }
  }

  // Default fallback
  if (!response) {
    if (t.split(' ').length < 3) {
      response = "I see. Could you provide more clinical details about that?";
    } else {
      response = "Thank you for that information. How does this relate to the patient's clinical symptoms?";
    }
  }

  appendMessage('doctor', response);
}