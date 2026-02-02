export type WeaponType =
    | 'pistol'
    | 'uzi'
    | 'machine_gun'
    | 'shotgun'
    | 'sniper'
    | 'flamethrower'
    | 'bazooka'
    | 'laser'
    | 'magnum'
    | 'plasma';

export interface WeaponStats {
    name: string;
    damage: number;
    cooldown: number;
    bulletSpeed: number;
    bulletRadius: number;
    bulletCount: number;
    spread: number;
    range: number;
    color: string;
    automatic: boolean;
    penetration: number; // How many enemies it can hit before disappearing
    explosiveRadius: number; // 0 for no explosion
}

export const WEAPONS: Record<WeaponType, WeaponStats> = {
    pistol: {
        name: 'Pistol',
        damage: 25,
        cooldown: 300,
        bulletSpeed: 9,
        bulletRadius: 4,
        bulletCount: 1,
        spread: 0.05,
        range: 60,
        color: '#fbbf24', // Yellow
        automatic: false,
        penetration: 1,
        explosiveRadius: 0
    },
    uzi: {
        name: 'Uzi',
        damage: 12,
        cooldown: 80, // Very Fast
        bulletSpeed: 11,
        bulletRadius: 3,
        bulletCount: 1,
        spread: 0.25, // Inaccurate
        range: 40,
        color: '#fcd34d',
        automatic: true,
        penetration: 1,
        explosiveRadius: 0
    },
    machine_gun: {
        name: 'Assault Rifle',
        damage: 20,
        cooldown: 120,
        bulletSpeed: 12,
        bulletRadius: 3.5,
        bulletCount: 1,
        spread: 0.1,
        range: 60,
        color: '#f59e0b', // Orange
        automatic: true,
        penetration: 1,
        explosiveRadius: 0
    },
    shotgun: {
        name: 'Shotgun',
        damage: 15,
        cooldown: 900,
        bulletSpeed: 10,
        bulletRadius: 3,
        bulletCount: 8,
        spread: 0.45,
        range: 25,
        color: '#ef4444', // Red
        automatic: false,
        penetration: 1,
        explosiveRadius: 0
    },
    sniper: {
        name: 'Sniper Rifle',
        damage: 150,
        cooldown: 1500,
        bulletSpeed: 25,
        bulletRadius: 5,
        bulletCount: 1,
        spread: 0,
        range: 150,
        color: '#60a5fa', // Blue
        automatic: false,
        penetration: 5, // Hits 5 enemies
        explosiveRadius: 0
    },
    flamethrower: {
        name: 'Flamethrower',
        damage: 6,
        cooldown: 30, // Extremely fast
        bulletSpeed: 6,
        bulletRadius: 6,
        bulletCount: 1,
        spread: 0.3,
        range: 30,
        color: '#ea580c', // Dark Orange
        automatic: true,
        penetration: 999, // Burn through all
        explosiveRadius: 0
    },
    bazooka: {
        name: 'Bazooka',
        damage: 200,
        cooldown: 2000,
        bulletSpeed: 6, // Slow
        bulletRadius: 8,
        bulletCount: 1,
        spread: 0,
        range: 80,
        color: '#1e293b', // Dark projectile
        automatic: false,
        penetration: 1,
        explosiveRadius: 100 // Big boom
    },
    laser: {
        name: 'Laser Rifle',
        damage: 45,
        cooldown: 400,
        bulletSpeed: 30, // Instant
        bulletRadius: 4,
        bulletCount: 1,
        spread: 0,
        range: 100,
        color: '#10b981', // Emerald
        automatic: false,
        penetration: 3,
        explosiveRadius: 0
    },
    magnum: {
        name: 'Magnum .44',
        damage: 90,
        cooldown: 600,
        bulletSpeed: 15,
        bulletRadius: 5,
        bulletCount: 1,
        spread: 0.02,
        range: 80,
        color: '#cbd5e1', // Silver
        automatic: false,
        penetration: 2,
        explosiveRadius: 0
    },
    plasma: {
        name: 'Plasma Rifle',
        damage: 35,
        cooldown: 150,
        bulletSpeed: 8,
        bulletRadius: 6,
        bulletCount: 1,
        spread: 0.05,
        range: 70,
        color: '#8b5cf6', // Violet
        automatic: true,
        penetration: 1,
        explosiveRadius: 20 // Small splash
    }
};
