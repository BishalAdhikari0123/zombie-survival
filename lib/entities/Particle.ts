export type ParticleType = 'blood' | 'muzzle' | 'smoke' | 'impact' | 'shell';

export class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
    type: ParticleType;
    alpha: number;
    rotation: number;
    rotationSpeed: number;

    constructor(
        x: number,
        y: number,
        type: ParticleType,
        color: string,
        speed: number,
        angle: number,
        life: number,
        size: number
    ) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.maxLife = life;
        this.life = life;
        this.size = size;
        this.alpha = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    update(): void {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // Fade out
        this.alpha = this.life / this.maxLife;

        // Physics for particles
        if (this.type === 'blood') {
            this.vx *= 0.95;
            this.vy *= 0.95;
        } else if (this.type === 'shell') {
            this.vx *= 0.92;
            this.vy *= 0.92;
            this.rotation += this.rotationSpeed;
        }
    }

    isDead(): boolean {
        return this.life <= 0;
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;

        if (this.type === 'muzzle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'shell') {
            ctx.fillStyle = '#facc15'; // Golden shell
            ctx.fillRect(-this.size, -this.size / 2, this.size * 2, this.size);
        } else {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        ctx.restore();
    }
}
