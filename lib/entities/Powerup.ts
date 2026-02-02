export type PowerupType =
    | 'health'
    | 'speed'
    | 'rapid_fire'
    | 'weapon_shotgun'
    | 'weapon_machine_gun'
    | 'weapon_sniper'
    | 'weapon_uzi'
    | 'weapon_flamethrower'
    | 'weapon_bazooka'
    | 'weapon_laser'
    | 'weapon_magnum'
    | 'weapon_plasma';

export class Powerup {
    x: number;
    y: number;
    width: number;
    height: number;
    type: PowerupType;
    life: number;
    pulse: number;

    constructor(x: number, y: number, type: PowerupType) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.type = type;
        this.life = 600; // 10 seconds at 60fps
        this.pulse = 0;
    }

    update(): void {
        this.life--;
        this.pulse += 0.1;
    }

    isExpired(): boolean {
        return this.life <= 0;
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Pulse scale effect
        const scale = 1 + Math.sin(this.pulse) * 0.1;
        ctx.scale(scale, scale);

        // Glow
        ctx.shadowBlur = 15;

        switch (this.type) {
            case 'health':
                ctx.fillStyle = '#ef4444';
                ctx.shadowColor = '#ef4444';
                break;
            case 'speed':
                ctx.fillStyle = '#3b82f6';
                ctx.shadowColor = '#3b82f6';
                break;
            case 'rapid_fire':
                ctx.fillStyle = '#f59e0b';
                ctx.shadowColor = '#f59e0b';
                break;
            case 'weapon_shotgun':
                ctx.fillStyle = '#ef4444';
                ctx.shadowColor = '#ef4444';
                break;
            case 'weapon_machine_gun':
                ctx.fillStyle = '#f59e0b';
                ctx.shadowColor = '#f59e0b';
                break;
            case 'weapon_sniper':
                ctx.fillStyle = '#60a5fa';
                ctx.shadowColor = '#60a5fa';
                break;
            case 'weapon_uzi':
                ctx.fillStyle = '#fcd34d';
                ctx.shadowColor = '#fcd34d';
                break;
            case 'weapon_flamethrower':
                ctx.fillStyle = '#ea580c';
                ctx.shadowColor = '#ea580c';
                break;
            case 'weapon_bazooka':
                ctx.fillStyle = '#1e293b';
                ctx.shadowColor = '#ffffff'; // White glow for dark item
                break;
            case 'weapon_laser':
                ctx.fillStyle = '#10b981';
                ctx.shadowColor = '#10b981';
                break;
            case 'weapon_magnum':
                ctx.fillStyle = '#cbd5e1';
                ctx.shadowColor = '#cbd5e1';
                break;
            case 'weapon_plasma':
                ctx.fillStyle = '#8b5cf6';
                ctx.shadowColor = '#8b5cf6';
                break;
        }

        // Draw box
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Draw Icon
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let icon = '';
        switch (this.type) {
            case 'health': icon = '+'; break;
            case 'speed': icon = '>>'; break;
            case 'rapid_fire': icon = '!!!'; break;
            case 'weapon_shotgun': icon = 'SG'; break;
            case 'weapon_machine_gun': icon = 'AR'; break;
            case 'weapon_sniper': icon = 'SN'; break;
            case 'weapon_uzi': icon = 'UZI'; break;
            case 'weapon_flamethrower': icon = 'FLM'; break;
            case 'weapon_bazooka': icon = 'RPG'; break;
            case 'weapon_laser': icon = 'LAS'; break;
            case 'weapon_magnum': icon = 'MAG'; break;
            case 'weapon_plasma': icon = 'PLA'; break;
        }

        ctx.fillText(icon, 0, 0);

        ctx.restore();
    }
}
