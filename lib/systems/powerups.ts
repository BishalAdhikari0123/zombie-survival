import { Powerup, PowerupType } from '../entities/Powerup';
import { Player } from '../entities/Player';

export function trySpawnPowerup(x: number, y: number, wave: number): Powerup | null {
    if (Math.random() < 0.25) { // 25% drop chance
        const pool: PowerupType[] = ['health', 'health', 'speed', 'rapid_fire'];

        // Tiered Weapon Pool
        if (wave >= 8) {
            pool.push('weapon_bazooka', 'weapon_laser', 'weapon_flamethrower', 'weapon_sniper', 'weapon_plasma');
        } else if (wave >= 5) {
            pool.push('weapon_magnum', 'weapon_plasma', 'weapon_sniper', 'weapon_machine_gun', 'weapon_laser');
        } else if (wave >= 3) {
            pool.push('weapon_machine_gun', 'weapon_shotgun', 'weapon_magnum', 'weapon_uzi');
        } else {
            pool.push('weapon_uzi', 'weapon_machine_gun', 'weapon_shotgun');
        }

        const type = pool[Math.floor(Math.random() * pool.length)];
        return new Powerup(x, y, type);
    }
    return null;
}

export function handlePowerupCollection(
    powerups: Powerup[],
    player: Player
): Powerup[] {
    const remaining: Powerup[] = [];

    for (const p of powerups) {
        p.update();

        // Check collision with player
        const dx = player.x - p.x;
        const dy = player.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < player.width / 2 + p.width / 2) {
            // Collected!
            player.applyPowerup(p.type);
        } else if (!p.isExpired()) {
            remaining.push(p);
        }
    }

    return remaining;
}
