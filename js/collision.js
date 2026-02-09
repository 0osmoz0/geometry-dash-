/**
 * Collisions AABB : cube vs obstacles et sol.
 */

const Collision = (function () {
  function aabbIntersect(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  function checkObstacles(playerHitbox, obstacles, cameraX) {
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      const screenX = o.x - cameraX;
      const oW = o.width || 80;
      const oH = o.height || 80;
      const oY = o.y !== undefined ? o.y : Level.GROUND_TOP - oH;
      var rect;
      if (o.type === 'spike') {
        var spikeHitHeight = Math.min(25, oH * 0.25);
        rect = {
          x: screenX + 5,
          y: oY,
          width: Math.max(20, oW - 10),
          height: spikeHitHeight
        };
      } else {
        rect = {
          x: screenX,
          y: oY,
          width: oW,
          height: oH
        };
      }
      if (aabbIntersect(playerHitbox, rect)) return true;
    }
    return false;
  }

  return {
    checkObstacles,
    aabbIntersect
  };
})();
