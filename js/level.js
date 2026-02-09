/**
 * Niveaux : chargement JSON, obstacles dans la zone visible, rendu.
 */

const Level = (function () {
  const GROUND_TOP = 640;
  const GROUND_HEIGHT = 80;
  let currentObstacles = [];
  let levelLength = 0;

  function loadLevel(levelId, callback) {
    const path = 'levels/' + levelId + '.json';
    fetch(path)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        currentObstacles = Array.isArray(data) ? data : (data.obstacles || []);
        levelLength = 0;
        currentObstacles.forEach(function (o) {
          const end = o.x + (o.width || 40);
          if (end > levelLength) levelLength = end;
        });
        if (callback) callback();
      })
      .catch(function () {
        currentObstacles = [];
        levelLength = 5000;
        if (callback) callback();
      });
  }

  function getObstaclesInView(cameraX, viewWidth) {
    const end = cameraX + viewWidth + 100;
    return currentObstacles.filter(function (o) {
      const oEnd = o.x + (o.width || 40);
      return oEnd >= cameraX && o.x <= end;
    });
  }

  function getObstacles() {
    return currentObstacles;
  }

  function getLevelLength() {
    return levelLength;
  }

  function draw(cameraX, viewWidth, groundTop, groundHeight) {
    const w = Renderer.getWidth();
    const h = Renderer.getHeight();
    const gt = groundTop !== undefined ? groundTop : GROUND_TOP;
    const gh = groundHeight !== undefined ? groundHeight : GROUND_HEIGHT;

    Renderer.drawBackground(cameraX);

    const obstacles = getObstaclesInView(cameraX, viewWidth);
    obstacles.forEach(function (o) {
      const screenX = o.x - cameraX;
      const screenY = o.y !== undefined ? o.y : gt - (o.height || 80);
      const width = o.width || 80;
      const height = o.height || 80;
      if (o.type === 'spike') {
        Renderer.drawSpike(screenX, screenY, width, height);
      } else {
        Renderer.drawBlock(screenX, screenY, width, height);
      }
    });

    const groundStart = Math.floor(cameraX / 400) * 400 - cameraX;
    for (let x = groundStart; x < w + 400; x += 400) {
      Renderer.drawGround(x, 400, gt, gh);
    }
  }

  return {
    loadLevel,
    getObstaclesInView,
    getObstacles,
    getLevelLength,
    draw,
    GROUND_TOP,
    GROUND_HEIGHT
  };
})();
