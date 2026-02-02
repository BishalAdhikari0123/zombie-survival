import { Zombie, ZombieType } from '../entities/Zombie';

/**
 * Spawn zombies around the edges of the canvas
 */
export function spawnZombies(
  count: number,
  canvasWidth: number,
  canvasHeight: number,
  wave: number
): Zombie[] {
  const zombies: Zombie[] = [];
  const padding = 50; // Spawn outside visible area

  for (let i = 0; i < count; i++) {
    let x: number, y: number;

    // Pick Type based on Wave
    let type: ZombieType = 'standard';
    const rand = Math.random();

    if (wave >= 5) {
      // High level waves have complex mix
      if (rand < 0.1) type = 'tank';
      else if (rand < 0.3) type = 'exploder';
      else if (rand < 0.6) type = 'fast';
    } else if (wave >= 3) {
      // Mid level waves intro fast & tank
      if (rand < 0.1) type = 'tank';
      else if (rand < 0.4) type = 'fast';
    } else if (wave >= 2) {
      // Wave 2 intros fast
      if (rand < 0.3) type = 'fast';
    }

    // Randomly choose which edge to spawn from
    const edge = Math.floor(Math.random() * 4);

    switch (edge) {
      case 0: // Top
        x = Math.random() * canvasWidth;
        y = -padding;
        break;
      case 1: // Right
        x = canvasWidth + padding;
        y = Math.random() * canvasHeight;
        break;
      case 2: // Bottom
        x = Math.random() * canvasWidth;
        y = canvasHeight + padding;
        break;
      case 3: // Left
        x = -padding;
        y = Math.random() * canvasHeight;
        break;
      default:
        x = 0;
        y = 0;
    }

    zombies.push(new Zombie(x, y, wave, type));
  }

  return zombies;
}

/**
 * Calculate zombie count for current wave
 */
export function getZombieCountForWave(wave: number): number {
  return Math.floor(5 + wave * 3);
}
