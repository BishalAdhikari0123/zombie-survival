import { Player } from '../entities/Player';
import { Zombie } from '../entities/Zombie';
import { Bullet } from '../entities/Bullet';

/**
 * Check collision between two rectangular entities
 */
export function checkRectCollision(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean {
  return (
    x1 - w1 / 2 < x2 + w2 / 2 &&
    x1 + w1 / 2 > x2 - w2 / 2 &&
    y1 - h1 / 2 < y2 + h2 / 2 &&
    y1 + h1 / 2 > y2 - h2 / 2
  );
}

/**
 * Check collision between a circle (bullet) and rectangle (zombie)
 */
export function checkCircleRectCollision(
  cx: number,
  cy: number,
  radius: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  // Find the closest point on the rectangle to the circle
  const closestX = Math.max(rx - rw / 2, Math.min(cx, rx + rw / 2));
  const closestY = Math.max(ry - rh / 2, Math.min(cy, ry + rh / 2));

  // Calculate distance between circle center and closest point
  const distanceX = cx - closestX;
  const distanceY = cy - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  return distanceSquared < radius * radius;
}

/**
 * Handle bullet vs zombie collisions
 */
import { createBloodSplatter } from './particles';
import { Particle } from '../entities/Particle';

import { trySpawnPowerup } from './powerups';
import { Powerup } from '../entities/Powerup';

/**
 * Handle bullet vs zombie collisions
 */
import { createExplosion } from './particles';

export function handleBulletZombieCollisions(
  bullets: Bullet[],
  zombies: Zombie[],
  particles: Particle[],
  powerups: Powerup[],
  wave: number
): { bullets: Bullet[]; zombies: Zombie[]; kills: number } {
  const remainingBullets: Bullet[] = [];
  const remainingZombies: Zombie[] = [];
  let kills = 0;

  // We need to track dead zombies within this frame so AOE doesn't double count kills or logic breaks
  const deadZombieIndices = new Set<number>();

  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    let bulletRemoved = false;

    // Check against all zombies
    for (let j = 0; j < zombies.length; j++) {
      if (deadZombieIndices.has(j)) continue;
      const zombie = zombies[j];

      // Skip if already hit by this bullet (penetration logic)
      if (bullet.hitIds.has(zombie.id)) continue;

      if (
        checkCircleRectCollision(
          bullet.x,
          bullet.y,
          bullet.radius,
          zombie.x,
          zombie.y,
          zombie.width,
          zombie.height
        )
      ) {
        // HIT!
        bullet.hitIds.add(zombie.id);

        // Logic for Explosives vs Regular
        if (bullet.explosiveRadius > 0) {
          // EXPLOSION LOGIC
          // 1. Create explosion effect
          particles.push(...createExplosion(bullet.x, bullet.y, 2)); // Size 2 explosion

          // 2. Damage all zombies in radius
          for (let k = 0; k < zombies.length; k++) {
            if (deadZombieIndices.has(k)) continue;
            const targetZ = zombies[k];
            const dx = targetZ.x - bullet.x;
            const dy = targetZ.y - bullet.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= bullet.explosiveRadius + targetZ.width / 2) {
              targetZ.takeDamage(bullet.damage); // Full damage for now
              particles.push(...createBloodSplatter(targetZ.x, targetZ.y, 3, Math.atan2(dy, dx)));

              if (targetZ.isDead()) {
                deadZombieIndices.add(k);
                kills++;
                particles.push(...createBloodSplatter(targetZ.x, targetZ.y, 10, Math.atan2(dy, dx)));
                // Drop powerup
                const p = trySpawnPowerup(targetZ.x, targetZ.y, wave);
                if (p) powerups.push(p);
              }
            }
          }

          // Bullet dies immediately on impact if explosive
          bulletRemoved = true;
          break; // Stop checking collisions for this bullet
        } else {
          // REGULAR / PENETRATION LOGIC
          zombie.takeDamage(bullet.damage);
          bullet.penetration--;

          // Spawn blood
          const angle = Math.atan2(bullet.vy, bullet.vx);
          particles.push(...createBloodSplatter(zombie.x, zombie.y, 5, angle));

          if (zombie.isDead()) {
            deadZombieIndices.add(j);
            kills++;
            particles.push(...createBloodSplatter(zombie.x, zombie.y, 15, angle));
            const p = trySpawnPowerup(zombie.x, zombie.y, wave);
            if (p) powerups.push(p);
          }

          // Check if bullet should die
          if (bullet.penetration <= 0) {
            bulletRemoved = true;
            break;
          }
        }
      }
    }

    if (!bulletRemoved) {
      remainingBullets.push(bullet);
    }
  }

  // Re-build zombie list, skipping dead ones
  // Note: We use the existing zombies array source of truth, but filter out indices that died this frame
  for (let j = 0; j < zombies.length; j++) {
    if (!zombies[j].isDead()) {
      remainingZombies.push(zombies[j]);
    }
  }

  return {
    bullets: remainingBullets,
    zombies: remainingZombies,
    kills,
  };
}

/**
 * Handle zombie vs player collisions
 */
export function handleZombiePlayerCollisions(
  zombies: Zombie[],
  player: Player,
  currentTime: number
): void {
  for (const zombie of zombies) {
    if (
      checkRectCollision(
        player.x,
        player.y,
        player.width,
        player.height,
        zombie.x,
        zombie.y,
        zombie.width,
        zombie.height
      )
    ) {
      // Zombie attacks player if cooldown is ready
      if (zombie.canAttack(currentTime)) {
        const damage = zombie.attack(currentTime);
        player.takeDamage(damage);
      }
    }
  }
}
