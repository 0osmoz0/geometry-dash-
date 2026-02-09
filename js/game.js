/**
 * Boucle de jeu : update, render, caméra, mort → callback GAME_OVER.
 */

const Game = (function () {
  const SCROLL_SPEED = 380;
  const PLAYER_SCREEN_X = 0.2;

  let cameraX = 0;
  let levelId = 'level1';
  let onGameOverCallback = null;
  let onWinCallback = null;
  let particles = [];
  let gameOverTimer = 0;

  function onGameOver(cb) { onGameOverCallback = cb; }
  function onWin(cb) { onWinCallback = cb; }

  function start(level) {
    levelId = level || 'level1';
    cameraX = 0;
    Player.reset();
    particles = [];
    gameOverTimer = 0;
    Level.loadLevel(levelId, function () {
      cameraX = 0;
    });
  }

  function spawnDeathParticles(x, y) {
    const n = 12;
    for (let i = 0; i < n; i++) {
      particles.push({
        x: x + Math.random() * 30 - 15,
        y: y + Math.random() * 30 - 15,
        vx: (Math.random() - 0.5) * 400,
        vy: (Math.random() - 0.5) * 400,
        life: 1,
        size: 8 + Math.random() * 8,
        color: '#ffaa44'
      });
    }
  }

  function update(dt) {
    if (gameOverTimer > 0) {
      gameOverTimer -= dt;
      particles.forEach(function (p) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 2;
      });
      particles = particles.filter(function (p) { return p.life > 0; });
      return;
    }

    cameraX += SCROLL_SPEED * dt;
    Player.update(dt);

    const hitbox = Player.getHitbox();
    const obstacles = Level.getObstaclesInView(cameraX, Renderer.getWidth());
    if (Collision.checkObstacles(hitbox, obstacles, cameraX)) {
      const screenX = Renderer.getWidth() * PLAYER_SCREEN_X + Player.getSize() / 2;
      spawnDeathParticles(screenX, Player.getY() + Player.getSize() / 2);
      gameOverTimer = 0.5;
      if (typeof Audio !== 'undefined') Audio.playDeath();
      if (onGameOverCallback) onGameOverCallback();
    }

    const len = Level.getLevelLength();
    if (len > 0 && cameraX > len) {
      if (onWinCallback) onWinCallback();
    }
  }

  function render() {
    const w = Renderer.getWidth();
    const h = Renderer.getHeight();
    const groundTop = Level.GROUND_TOP;
    const groundHeight = Level.GROUND_HEIGHT;

    Renderer.clear('#0d1120');
    Level.draw(cameraX, w, groundTop, groundHeight);

    const playerScreenX = w * PLAYER_SCREEN_X;
    const playerY = Player.getY();
    Renderer.drawCube(playerScreenX, playerY, Player.getSize());
    Renderer.drawParticles(particles);
  }

  function getCameraX() { return cameraX; }
  function getScrollSpeed() { return SCROLL_SPEED; }

  return {
    start,
    update,
    render,
    onGameOver,
    onWin,
    getCameraX,
    getScrollSpeed
  };
})();
