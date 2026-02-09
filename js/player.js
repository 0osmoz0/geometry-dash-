/**
 * Joueur (cube) : position Y monde, vélocité, gravité, saut.
 * La position X à l'écran est fixe (caméra scroll).
 */

const Player = (function () {
  const GRAVITY = 1200;
  const JUMP_FORCE = -520;
  const SIZE = 50;
  const GROUND_Y = 720 - 80 - SIZE; // au-dessus du sol (hauteur sol 80)

  let y = GROUND_Y;
  let velocityY = 0;
  let onGround = true;

  function reset() {
    y = GROUND_Y;
    velocityY = 0;
    onGround = true;
  }

  function update(dt) {
    velocityY += GRAVITY * dt;
    y += velocityY * dt;
    if (y >= GROUND_Y) {
      y = GROUND_Y;
      velocityY = 0;
      onGround = true;
    } else {
      onGround = false;
    }
  }

  function jump() {
    if (onGround) {
      velocityY = JUMP_FORCE;
      onGround = false;
      if (typeof Audio !== 'undefined') Audio.playJump();
    }
  }

  function getY() { return y; }
  function setY(val) { y = val; }
  function getVelocityY() { return velocityY; }
  function getSize() { return SIZE; }
  function getGroundY() { return GROUND_Y; }
  function isOnGround() { return onGround; }

  function getHitbox() {
    const screenX = Renderer.getWidth() * 0.2;
    return {
      x: screenX + 4,
      y: y + 4,
      width: SIZE - 8,
      height: SIZE - 8
    };
  }

  return {
    reset,
    update,
    jump,
    getY,
    setY,
    getVelocityY,
    getSize,
    getGroundY,
    isOnGround,
    getHitbox,
    SIZE,
    GROUND_Y
  };
})();
