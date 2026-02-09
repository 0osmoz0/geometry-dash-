/**
 * Point d'entrée : états MENU | PLAYING | PAUSED | GAME_OVER | LEVEL_SELECT.
 * Boucle requestAnimationFrame, input, lancement niveau, retour menu.
 */

(function () {
  const STATE_MENU = 'MENU';
  const STATE_PLAYING = 'PLAYING';
  const STATE_PAUSED = 'PAUSED';
  const STATE_GAME_OVER = 'GAME_OVER';
  const STATE_LEVEL_SELECT = 'LEVEL_SELECT';

  let state = STATE_MENU;
  let selectedLevelId = 'level1';
  let lastTime = 0;

  function toMenu() {
    state = STATE_MENU;
    Menu.showMain();
  }

  function toLevelSelect() {
    state = STATE_LEVEL_SELECT;
    Menu.showLevels();
  }

  function toSettings() {
    Menu.showSettings();
  }

  function startLevel(levelId) {
    selectedLevelId = levelId || selectedLevelId;
    state = STATE_PLAYING;
    Game.start(selectedLevelId);
  }

  function showGameOver() {
    state = STATE_GAME_OVER;
  }

  function canvasToLogical(e) {
    const canvas = Renderer.getCanvas();
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function handleClick(e) {
    const pos = canvasToLogical(e);
    if (state === STATE_MENU || state === STATE_LEVEL_SELECT) {
      const action = Menu.handleClick(pos.x, pos.y);
      if (action === 'play') startLevel(selectedLevelId);
      else if (action === 'levels') toLevelSelect();
      else if (action === 'settings') toSettings();
      else if (action === 'level1') startLevel('level1');
      else if (action === 'back') toMenu();
    } else if (state === STATE_GAME_OVER) {
      const action = GameOverScreen.handleClick(pos.x, pos.y);
      if (action === 'replay') startLevel(selectedLevelId);
      else if (action === 'menu') toMenu();
    } else if (state === STATE_PLAYING) {
      Player.jump();
    }
  }

  function handleKeyDown(e) {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      if (state === STATE_PLAYING) Player.jump();
    }
    if (e.code === 'KeyP' || e.key === 'Escape') {
      if (state === STATE_PLAYING) {
        state = STATE_PAUSED;
      } else if (state === STATE_PAUSED) {
        state = STATE_PLAYING;
      }
    }
    if (e.code === 'KeyF') {
      e.preventDefault();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(function () {});
      } else {
        document.exitFullscreen();
      }
    }
  }

  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (state === STATE_MENU || state === STATE_LEVEL_SELECT) {
      Menu.render();
      return;
    }

    if (state === STATE_PLAYING) {
      Game.update(dt);
      Game.render();
      return;
    }

    if (state === STATE_PAUSED) {
      Game.render();
      const ctx = Renderer.getCtx();
      if (ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, Renderer.getWidth(), Renderer.getHeight());
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Pause', Renderer.getWidth() / 2, Renderer.getHeight() / 2);
        ctx.font = '20px sans-serif';
        ctx.fillText('Appuyez sur P ou Échap pour reprendre', Renderer.getWidth() / 2, Renderer.getHeight() / 2 + 50);
      }
      return;
    }

    if (state === STATE_GAME_OVER) {
      Game.update(dt);
      Game.render();
      GameOverScreen.render();
    }
  }

  Game.onGameOver(showGameOver);
  Game.onWin(function () {
    state = STATE_MENU;
    Menu.showMain();
  });

  Renderer.init();
  Menu.showMain();
  Renderer.getCanvas().addEventListener('click', handleClick);
  Renderer.getCanvas().addEventListener('touchstart', function (e) {
    e.preventDefault();
    if (e.touches.length) handleClick(e.touches[0]);
  }, { passive: false });
  document.addEventListener('keydown', handleKeyDown);

  requestAnimationFrame(function (t) {
    lastTime = t;
    requestAnimationFrame(loop);
  });
})();
