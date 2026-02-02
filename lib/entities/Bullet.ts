import { drawBulletSprite } from '../utils/sprites';

/**
 * Bullet entity fired by the player
 */
export class Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  damage: number;
  color: string;
  life: number;
  penetration: number;
  explosiveRadius: number;
  hitIds: Set<number>; // Track hit entities to prevent double damage

  constructor(
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    stats: {
      damage: number;
      speed: number;
      range: number;
      color: string;
      radius: number;
      spread: number;
      penetration: number;
      explosiveRadius: number;
    }
  ) {
    this.x = x;
    this.y = y;
    this.radius = stats.radius;
    this.speed = stats.speed;
    this.damage = stats.damage;
    this.color = stats.color;
    this.life = stats.range;
    this.penetration = stats.penetration;
    this.explosiveRadius = stats.explosiveRadius;
    this.hitIds = new Set();

    // Calculate direction vector
    const dx = targetX - x;
    const dy = targetY - y;
    let angle = Math.atan2(dy, dx);

    // Apply random spread
    angle += (Math.random() - 0.5) * stats.spread;

    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
  }

  /**
   * Update bullet position
   */
  update(): void {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  /**
   * Check if bullet is out of bounds or expired
   */
  isOutOfBounds(canvasWidth: number, canvasHeight: number): boolean {
    return (
      this.life <= 0 ||
      this.x < 0 ||
      this.x > canvasWidth ||
      this.y < 0 ||
      this.y > canvasHeight
    );
  }

  /**
   * Render bullet on canvas
   */
  render(ctx: CanvasRenderingContext2D): void {
    drawBulletSprite(ctx, this.x, this.y, this.radius, this.color);
  }

  /**
   * Get center position
   */
  getCenter(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
