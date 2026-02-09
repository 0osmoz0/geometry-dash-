/**
 * Sons sans assets : bips via Web Audio API (oscillateur).
 */

const Audio = (function () {
  let ctx = null;
  let enabled = true;

  function getContext() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.resume) ctx.resume();
    } catch (e) {}
    return ctx;
  }

  function beep(frequency, duration, type) {
    const ac = getContext();
    if (!ac || !enabled) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.frequency.value = frequency;
    osc.type = type || 'square';
    gain.gain.setValueAtTime(0.15, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + duration);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  }

  function playJump() {
    beep(440, 0.08, 'square');
  }

  function playDeath() {
    beep(180, 0.15, 'sawtooth');
    setTimeout(function () {
      beep(120, 0.2, 'sawtooth');
    }, 80);
  }

  function setEnabled(val) {
    enabled = !!val;
  }

  return {
    playJump,
    playDeath,
    setEnabled
  };
})();
