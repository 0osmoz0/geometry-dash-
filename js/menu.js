/**
 * Menu principal : écran titre, boutons Play / Levels / Settings.
 * Tout dessiné en Canvas avec détection de clic sur les zones.
 */

const Menu = (function () {
  let buttons = [];
  let levelButtons = [];
  let currentScreen = 'main'; // 'main' | 'levels' | 'settings'

  function getButtons() {
    const w = Renderer.getWidth();
    const h = Renderer.getHeight();
    const centerX = w / 2;
    const bw = 280;
    const bh = 56;
    const gap = 24;
    const startY = h * 0.52;
    return [
      { id: 'play', x: centerX - bw / 2, y: startY, width: bw, height: bh },
      { id: 'levels', x: centerX - bw / 2, y: startY + bh + gap, width: bw, height: bh },
      { id: 'settings', x: centerX - bw / 2, y: startY + (bh + gap) * 2, width: bw, height: bh }
    ];
  }

  function getLevelButtons() {
    const w = Renderer.getWidth();
    const centerX = w / 2;
    const bw = 280;
    const bh = 48;
    return [
      { id: 'level1', x: centerX - bw / 2, y: 320, width: bw, height: bh },
      { id: 'back', x: centerX - bw / 2, y: 420, width: bw, height: bh }
    ];
  }

  function drawButton(ctx, btn, text, isBack) {
    const grad = ctx.createLinearGradient(btn.x, btn.y, btn.x + btn.width, btn.y + btn.height);
    grad.addColorStop(0, isBack ? '#333355' : '#2a4a7a');
    grad.addColorStop(1, isBack ? '#222244' : '#1a3a5c');
    ctx.fillStyle = grad;
    ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
    ctx.strokeStyle = '#4a7abb';
    ctx.lineWidth = 2;
    ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, btn.x + btn.width / 2, btn.y + btn.height / 2);
  }

  function render() {
    const ctx = Renderer.getCtx();
    if (!ctx) return;
    const w = Renderer.getWidth();
    const h = Renderer.getHeight();

    Renderer.clear('#0d1120');

    if (currentScreen === 'main') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1a1a2e');
      grad.addColorStop(0.5, '#16213e');
      grad.addColorStop(1, '#0d1120');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#4488ff';
      ctx.font = 'bold 56px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Geometry Dash', w / 2, h * 0.32);
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#88aacc';
      ctx.fillText('Sans assets • Espace ou clic pour sauter', w / 2, h * 0.42);

      buttons = getButtons();
      drawButton(ctx, buttons[0], 'Jouer', false);
      drawButton(ctx, buttons[1], 'Niveaux', false);
      drawButton(ctx, buttons[2], 'Paramètres', false);
    } else if (currentScreen === 'levels') {
      ctx.fillStyle = '#0d1120';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Choisir un niveau', w / 2, 260);
      levelButtons = getLevelButtons();
      drawButton(ctx, levelButtons[0], 'Niveau 1', false);
      drawButton(ctx, levelButtons[1], 'Retour', true);
    } else if (currentScreen === 'settings') {
      ctx.fillStyle = '#0d1120';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Paramètres', w / 2, 260);
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#88aacc';
      ctx.fillText('Plein écran : F | Son : Web Audio (bips)', w / 2, 320);
      const backBtn = { id: 'back', x: w / 2 - 140, y: 400, width: 280, height: 48 };
      drawButton(ctx, backBtn, 'Retour', true);
      levelButtons = [backBtn];
    }
  }

  function hitTest(x, y, list) {
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) {
        return b.id;
      }
    }
    return null;
  }

  function handleClick(x, y) {
    if (currentScreen === 'main') {
      return hitTest(x, y, buttons);
    }
    if (currentScreen === 'levels') {
      const id = hitTest(x, y, levelButtons);
      if (id) return id;
    }
    if (currentScreen === 'settings') {
      const id = hitTest(x, y, levelButtons);
      if (id === 'back') return 'back';
    }
    return null;
  }

  function showMain() { currentScreen = 'main'; }
  function showLevels() { currentScreen = 'levels'; }
  function showSettings() { currentScreen = 'settings'; }

  return {
    render,
    handleClick,
    showMain,
    showLevels,
    showSettings
  };
})();

/**
 * Écran Game Over : message + boutons Replay / Menu.
 */
const GameOverScreen = (function () {
  let buttons = [];

  function getButtons() {
    const w = Renderer.getWidth();
    const h = Renderer.getHeight();
    const centerX = w / 2;
    const bw = 220;
    const bh = 52;
    return [
      { id: 'replay', x: centerX - bw - 20, y: h / 2 + 20, width: bw, height: bh },
      { id: 'menu', x: centerX + 20, y: h / 2 + 20, width: bw, height: bh }
    ];
  }

  function render() {
    const ctx = Renderer.getCtx();
    if (!ctx) return;
    const w = Renderer.getWidth();
    const h = Renderer.getHeight();
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 52px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', w / 2, h / 2 - 50);
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '18px sans-serif';
    ctx.fillText('Rejouer ou retour au menu', w / 2, h / 2 - 5);
    buttons = getButtons();
    buttons.forEach(function (b) {
      const grad = ctx.createLinearGradient(b.x, b.y, b.x + b.width, b.y + b.height);
      grad.addColorStop(0, b.id === 'replay' ? '#2a6a3a' : '#3a3a5a');
      grad.addColorStop(1, b.id === 'replay' ? '#1a4a2a' : '#2a2a4a');
      ctx.fillStyle = grad;
      ctx.fillRect(b.x, b.y, b.width, b.height);
      ctx.strokeStyle = '#4a8a5a';
      ctx.strokeRect(b.x, b.y, b.width, b.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(b.id === 'replay' ? 'Rejouer' : 'Menu', b.x + b.width / 2, b.y + b.height / 2);
    });
  }

  function handleClick(x, y) {
    const list = getButtons();
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) return b.id;
    }
    return null;
  }

  return { render, handleClick };
})();
