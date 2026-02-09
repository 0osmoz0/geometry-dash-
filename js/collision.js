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
      const oY = o.y !== undefined ? o.y : Level.GROUND_TOP - (o.height || 80);
      const rect = {
        x: screenX,
        y: oY,
        width: o.width || 80,
        height: o.height || 80
      };
      if (aabbIntersect(playerHitbox, rect)) return true;
    }
    return false;
  }

  return {
    checkObstacles,
    aabbIntersect
  };
})();
