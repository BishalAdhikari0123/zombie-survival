import { Particle, ParticleType } from '../entities/Particle';

export function createBloodSplatter(x: number, y: number, count: number, direction: number): Particle[] {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
        // Randomize angle slightly
        const angle = direction + (Math.random() - 0.5) * 1.5;
        const speed = Math.random() * 5 + 2;
        const life = Math.random() * 30 + 30;
        const size = Math.random() * 3 + 2;
        // Vary blood color slightly
        const color = Math.random() > 0.5 ? '#b91c1c' : '#991b1b';

        particles.push(new Particle(x, y, 'blood', color, speed, angle, life, size));
    }
    return particles;
}

export function createMuzzleFlash(x: number, y: number, rotation: number, color: string = '#fcd34d'): Particle[] {
    const particles: Particle[] = [];
    // Flash core
    particles.push(new Particle(x, y, 'muzzle', '#fff7ed', 0, 0, 5, 8));

    // Sparks
    for (let i = 0; i < 5; i++) {
        const angle = rotation + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 10 + 5;
        particles.push(new Particle(x, y, 'muzzle', color, speed, angle, 10, 2));
    }
    return particles;
}

export function createShell(x: number, y: number, rotation: number): Particle {
    // Eject sideways relative to gun
    const angle = rotation + Math.PI / 2 + (Math.random() - 0.5) * 0.5;
    const speed = Math.random() * 3 + 2;
    const life = Math.random() * 60 + 120; // Last longer on floor
    return new Particle(x, y, 'shell', '#facc15', speed, angle, life, 2.5);
}

export function createExplosion(x: number, y: number, size: number = 1): Particle[] {
    const particles: Particle[] = [];
    const count = 20 * size;

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 * size;
        const life = Math.random() * 30 + 20;
        const pSize = Math.random() * 10 * size + 5;

        // Mix of fire and smoke colors
        const rand = Math.random();
        let color;
        if (rand < 0.3) color = '#fff7ed'; // White smoke
        else if (rand < 0.6) color = '#fdba74'; // Orange fire
        else color = '#ef4444'; // Red fire

        particles.push(new Particle(x, y, 'smoke', color, speed, angle, life, pSize));
    }
    return particles;
}

export function createImpact(x: number, y: number, color: string): Particle[] {
    const particles: Particle[] = [];
    for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.push(new Particle(x, y, 'impact', color, speed, angle, 15, 2));
    }
    return particles;
}

export function updateParticles(particles: Particle[]): Particle[] {
    return particles.filter(p => {
        p.update();
        return !p.isDead();
    });
}
