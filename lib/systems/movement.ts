import { Zombie } from '../entities/Zombie';
import { Player } from '../entities/Player';
import { GameMap } from '../data/maps';
import { checkMapCollision } from './mapCollision';

/**
 * Update all zombies to move towards the player
 */
export function updateZombieMovement(
  zombies: Zombie[],
  player: Player,
  deltaTime: number,
  map: GameMap
): void {
  const playerCenter = player.getCenter();

  for (const zombie of zombies) {
    const dx = playerCenter.x - zombie.x;
    const dy = playerCenter.y - zombie.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      // 1. Ghost Mode & Off-screen check
      // Allow zombies to "ghost" through obstacles if they are currently stuck OR outside the map
      const isStuck =
        zombie.x < 30 ||
        zombie.x > 1170 ||
        zombie.y < 30 ||
        zombie.y > 770 ||
        checkMapCollision(zombie.x, zombie.y, zombie.width, zombie.height, map) !== null;

      // Base angle towards player
      const angleToPlayer = Math.atan2(dy, dx);

      if (isStuck) {
        // Just move directly towards player if stuck/offscreen
        const vx = Math.cos(angleToPlayer) * zombie.speed;
        const vy = Math.sin(angleToPlayer) * zombie.speed;
        zombie.x += vx;
        zombie.y += vy;
        zombie.rotation = angleToPlayer;
      } else {
        // 2. Feeler / Probe System (Refined)
        const bias = zombie.id % 2 === 0 ? 1 : -1;

        // Scan angles in increments of ~15 degrees up to 90 degrees
        // Removed retrograde angles (>90) to prevent turning back/vibrating
        const stepSize = 15 * (Math.PI / 180); // ~0.26 rad
        const steps = [
          0,
          1 * stepSize * bias, -1 * stepSize * bias,
          2 * stepSize * bias, -2 * stepSize * bias,
          3 * stepSize * bias, -3 * stepSize * bias, // 45 deg
          4 * stepSize * bias, -4 * stepSize * bias,
          5 * stepSize * bias, -5 * stepSize * bias,
          6 * stepSize * bias, -6 * stepSize * bias  // 90 deg
        ];

        let moved = false;

        for (const step of steps) {
          const probeAngle = angleToPlayer + step;
          const vx = Math.cos(probeAngle) * zombie.speed;
          const vy = Math.sin(probeAngle) * zombie.speed;

          const nextX = zombie.x + vx;
          const nextY = zombie.y + vy;

          // Check if this specific move is valid
          if (!checkMapCollision(nextX, nextY, zombie.width, zombie.height, map)) {
            zombie.x = nextX;
            zombie.y = nextY;
            moved = true;
            break;
          }
        }
      }

      // Always face the player (smooths out visual jitter from strafing)
      zombie.rotation = angleToPlayer;
    }
  }
}
