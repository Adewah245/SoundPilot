// =========================================================================
// SoundPilot — AI Assistant Page
// =========================================================================

import * as C from '../components.js';
import { SMART_SUGGESTIONS, ENGINEERING_RESULTS } from '../data.js';

let chatHistory = [];
let isTyping = false;

export async function render(container) {
  chatHistory = [{
    role: 'assistant',
    text: "Hello! I am SoundPilot AI, your sound engineering assistant. I can explain any measurement, suggest what to fix, or guide you through the process step by step. What would you like to know?",
  }];

  const suggestions = [
    'What is RMS and why does it matter?',
    'How do I fix feedback on stage?',
    'What should I do about clipping?',
    'Explain my current alerts',
  ];

  container.innerHTML = `
    ${C.pageHeader('AI Assistant', 'Ask me anything about your sound system — I explain things in plain language, no engineering degree required', C.icon('ai', 20))}

    ${C.demoBanner(true)}

    <!-- Help callout -->
    <div class="help-callout mb-4">
      ${C.icon('help', 20)}
      <div>
        <strong>How to use the AI Assistant:</strong> Type your question below, or tap one of the suggested questions. I can explain technical terms, walk you through fixing problems, and tell you what to do next. No question is too simple!
      </div>
    </div>

    <div class="card">
      <div class="chat-container">
        <div class="chat-messages" id="chat-messages">
          ${renderMessages()}
        </div>
        <div class="chat-suggestions" id="chat-suggestions" style="padding:0 16px 8px">
          ${suggestions.map((s) => `<button class="chat-suggestion-btn" onclick="SP.ai.ask('${s.replace(/'/g, "\\'")}')">${s}</button>`).join('')}
        </div>
        <div class="chat-input-bar">
          <input class="chat-input" id="chat-input" placeholder="Ask a question..." onkeydown="if(event.key==='Enter')SP.ai.send()" />
          <button class="btn btn-primary" onclick="SP.ai.send()">${C.icon('send', 16)} Send</button>
        </div>
      </div>
    </div>
  `;

  window.SP.ai = { ask, send, getResponse };
}

function renderMessages() {
  return chatHistory.map((msg) => {
    if (msg.role === 'typing') {
      return `<div class="chat-typing">
        <div class="chat-avatar assistant">${C.icon('bot', 16)}</div>
        <div class="chat-typing-dots"><div class="chat-typing-dot"></div><div class="chat-typing-dot"></div><div class="chat-typing-dot"></div></div>
      </div>`;
    }
    return `<div class="chat-msg ${msg.role}">
      <div class="chat-avatar ${msg.role}">${msg.role === 'assistant' ? C.icon('bot', 16) : C.icon('user', 16)}</div>
      <div class="chat-bubble ${msg.role}">${msg.text}</div>
    </div>`;
  }).join('');
}

function updateMessages() {
  const el = document.getElementById('chat-messages');
  if (el) {
    el.innerHTML = renderMessages();
    el.scrollTop = el.scrollHeight;
  }
}

function ask(question) {
  document.getElementById('chat-input').value = question;
  send();
}

function send() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || isTyping) return;
  input.value = '';

  chatHistory.push({ role: 'user', text });
  isTyping = true;
  chatHistory.push({ role: 'typing' });
  updateMessages();

  setTimeout(() => {
    chatHistory = chatHistory.filter((m) => m.role !== 'typing');
    const response = getResponse(text);
    chatHistory.push({ role: 'assistant', text: response });
    isTyping = false;
    updateMessages();
  }, 800 + Math.random() * 600);
}

function getResponse(question) {
  const q = question.toLowerCase();

  if (q.includes('rms')) {
    return 'RMS (Root Mean Square) is the average loudness of your audio signal. Think of it like the average speed on a car trip — not the top speed, but what you were usually doing.\n\nYour current RMS is -18.2 dBFS, and your target is -18 dBFS. That means your average volume is right on target! Green means good.';
  }
  if (q.includes('feedback')) {
    const fbResult = ENGINEERING_RESULTS.find((r) => r.parameter === 'Feedback Margin');
    return `Feedback is that loud whistle or screech when a microphone picks up sound from a speaker and sends it back through — creating a loop. Like pointing a mic at the speaker it is connected to.\n\n${fbResult ? `Right now, your feedback margin is ${fbResult.actual} (target: ${fbResult.target}). This is ${fbResult.status === 'rejected' ? 'too high — you are at risk of feedback!' : 'within safe range.'}\n\nRecommendation: ${fbResult.recommendation}` : 'No feedback issues detected right now.'}`;
  }
  if (q.includes('clipping') || q.includes('clip')) {
    return 'Clipping happens when the audio signal is louder than the system can handle. The tops of the sound wave get "clipped off," causing harsh distortion.\n\nThink of it like filling a glass past the rim — the extra water spills over. Turn down the tap!\n\nIf you see clipping on the Measurements page, turn down the input gain or the channel fader until the red indicator goes away.';
  }
  if (q.includes('alert') || q.includes('alerts') || q.includes('warning')) {
    return 'You have 3 active alerts right now:\n\n1. CRITICAL: Clipping on Stage Monitor — distortion is at 3.4%, way above the 1% target. Reduce the monitor level by 3 dB.\n2. CRITICAL: Feedback Risk at 2.4 kHz — feedback margin is 0.8. Apply a notch filter at 2.4 kHz.\n3. WARNING: Elevated Noise Floor at FOH Left — likely HVAC interference. Try measuring with the air conditioning off.\n\nStart with the critical ones first — they are the most urgent.';
  }
  if (q.includes('distortion') || q.includes('thd')) {
    return 'Distortion (THD+N) measures how much unwanted sound your system adds to the original. Lower is better — anything above 1% starts to sound noticeably bad.\n\nLike a photocopy that is slightly blurry — the original is there, but something extra was added that should not be.\n\nYour stage monitor is showing 3.4% distortion, which is rejected. Reduce the monitor send level and check the amplifier gain structure.';
  }
  if (q.includes('noise')) {
    return 'The noise floor is the quietest background level your system can detect. A lower (more negative) number is better.\n\nLike the silence in a room before anyone speaks. A quiet room lets you hear whispers. A noisy room (near a road) makes it hard.\n\nYour FOH Left position is showing -48.5 dBFS (target -55). This is likely HVAC interference. Try measuring with the air handling off, or move the mic away from the vent.';
  }
  if (q.includes('how') && (q.includes('start') || q.includes('use') || q.includes('begin'))) {
    return 'Here is how to use SoundPilot, step by step:\n\n1. Go to the Measurements page and pick where your microphone is placed.\n2. Press the green Start button to begin measuring.\n3. Watch the meters and waveform move in real time.\n4. When done, press Stop, then Save.\n5. Check the Dashboard to see if your results are green (good), yellow (watch out), or red (fix it).\n6. Go to Engineering for Smart Suggestions on what to fix.\n7. Make one change, measure again, and use Verification to confirm it worked.\n\nRepeat until everything is green. That is the whole process!';
  }
  if (q.includes('spectrum') || q.includes('frequency')) {
    return 'The frequency spectrum shows which pitches (bass, mid, treble) are present and how loud each is. Low numbers on the left are bass. High numbers on the right are treble.\n\nLike an equalizer on a stereo — each bar shows energy at that pitch. Flat bars mean balanced sound.';
  }
  if (q.includes('waveform')) {
    return 'A waveform is a visual picture of your audio signal over time. The height shows how loud it is at each moment.\n\nLike a heart monitor on a hospital screen — the line goes up and down showing what is happening moment by moment.';
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return 'Hello! I am here to help you with anything about your sound system. You can ask me about measurements, alerts, feedback, clipping, or how to use SoundPilot. What would you like to know?';
  }

  return 'That is a great question! I can help with:\n\n- Explaining measurements (RMS, Peak, Noise, Distortion, Clipping, Feedback)\n- What to do about alerts and warnings\n- How to fix feedback or clipping\n- How to use SoundPilot step by step\n- What the waveform and spectrum show\n\nTry asking "What is RMS?" or "How do I fix feedback?" for a detailed answer.';
}
