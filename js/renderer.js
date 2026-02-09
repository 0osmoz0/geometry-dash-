/**
 * Rendu 100% formes géométriques (sans assets).
 * Dessin du cube, sol, blocs, spikes, décor, particules.
 */

const Renderer = (function () {
  const DESIGN_WIDTH = 1280;
  const DESIGN_HEIGHT = 720;

  let ctx = null;
  let canvas = null;
  let scaleX = 1;
  let scaleY = 1;

  function init() {
    canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ratio = DESIGN_WIDTH / DESIGN_HEIGHT;
    const windowRatio = w / h;
    if (windowRatio > ratio) {
      canvas.style.width = h * ratio + 'px';
      canvas.style.height = h + 'px';
    } else {
      canvas.style.width = w + 'px';
      canvas.style.height = w / ratio + 'px';
    }
    canvas.width = DESIGN_WIDTH;
    canvas.height = DESIGN_HEIGHT;
    scaleX = canvas.width / DESIGN_WIDTH;
    scaleY = canvas.height / DESIGN_HEIGHT;
  }

  function getWidth() { return DESIGN_WIDTH; }
  function getHeight() { return DESIGN_HEIGHT; }
  function getCtx() { return ctx; }
  function getCanvas() { return canvas; }

  function clear(color) {
    if (!ctx) return;
    ctx.fillStyle = color || '#0a0a0f';
    ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
  }

  /** Cube joueur : carré avec dégradé et bordure */
  function drawCube(x, y, size) {
    if (!ctx) return;
    const s = size || 50;
    const grad = ctx.createLinearGradient(x, y, x + s, y + s);
    grad.addColorStop(0, '#88ccff');
    grad.addColorStop(0.5, '#44aaff');
    grad.addColorStop(1, '#2288dd');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, s, s);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, s, s);
  }

  /** Sol / plateforme : rectangle avec dégradé */
  function drawGround(screenX, width, groundY, height) {
    if (!ctx) return;
    const h = height || 80;
    const grad = ctx.createLinearGradient(screenX, groundY, screenX + width, groundY + h);
    grad.addColorStop(0, '#1a3a5c');
    grad.addColorStop(0.5, '#2a5a8c');
    grad.addColorStop(1, '#1a3a5c');
    ctx.fillStyle = grad;
    ctx.fillRect(screenX, groundY, width, h);
    ctx.strokeStyle = '#3a7abb';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, groundY, width, h);
  }

  /** Bloc obstacle : rectangle */
  function drawBlock(screenX, screenY, width, height) {
    if (!ctx) return;
    const grad = ctx.createLinearGradient(screenX, screenY, screenX + width, screenY + height);
    grad.addColorStop(0, '#cc4444');
    grad.addColorStop(0.5, '#aa2222');
    grad.addColorStop(1, '#882222');
    ctx.fillStyle = grad;
    ctx.fillRect(screenX, screenY, width, height);
    ctx.strokeStyle = '#ff6666';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, screenY, width, height);
  }

  /** Spike : triangle pointant vers le haut */
  function drawSpike(screenX, screenY, width, height) {
    if (!ctx) return;
    const cx = screenX + width / 2;
    ctx.fillStyle = '#dd3333';
    ctx.strokeStyle = '#ff6666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, screenY + height);
    ctx.lineTo(screenX, screenY);
    ctx.lineTo(screenX + width, screenY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  /** Grille / décor arrière-plan (opacité réduite) */
  function drawBackground(cameraX) {
    if (!ctx) return;
    ctx.save();
    ctx.globalAlpha = 0.15;
    const gridSize = 80;
    const start = Math.floor(cameraX / gridSize) * gridSize - cameraX;
    for (let x = start; x < DESIGN_WIDTH + gridSize; x += gridSize) {
      ctx.strokeStyle = '#4488ff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, DESIGN_HEIGHT);
      ctx.stroke();
    }
    ctx.restore();
  }

  /** Particules à la mort (petits carrés) */
  function drawParticles(particles) {
    if (!ctx || !particles) return;
    particles.forEach(function (p) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color || '#ffaa44';
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  return {
    init,
    resize,
    clear,
    getWidth,
    getHeight,
    getCtx,
    getCanvas,
    drawCube,
    drawGround,
    drawBlock,
    drawSpike,
    drawBackground,
    drawParticles,
    DESIGN_WIDTH,
    DESIGN_HEIGHT
  };
})();
