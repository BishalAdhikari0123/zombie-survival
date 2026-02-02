import { drawZombieSprite } from '../utils/sprites';

/**
 * Zombie entity that chases the player
 */
export type ZombieType = 'standard' | 'tank' | 'fast' | 'exploder';

/**
 * Zombie entity that chases the player
 */
export class Zombie {
  id: number;
  static nextId = 0;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  maxHealth: number;
  health: number;
  damage: number;
  rotation: number; // Angle in radians
  color: string;
  attackCooldown: number;
  lastAttackTime: number;
  type: ZombieType;

  constructor(x: number, y: number, wave: number = 1, type: ZombieType = 'standard') {
    this.type = type;
    this.id = Zombie.nextId++;
    this.x = x;
    this.y = y;
    // Base stats based on Type
    switch (type) {
      case 'tank':
        this.width = 40;
        this.height = 40;
        this.speed = 0.5 + (wave * 0.05); // Very slow
        this.maxHealth = 150 + (wave * 30); // Huge Health
        this.damage = 15 + (wave * 3);
        this.color = '#dc2626'; // Red
        break;
      case 'fast':
        this.width = 20;
        this.height = 20;
        this.speed = 2.5 + (wave * 0.2); // Very fast
        this.maxHealth = 30 + (wave * 5); // Low Health
        this.damage = 4 + (wave * 1);
        this.color = '#facc15'; // Yellow
        break;
      case 'exploder':
        this.width = 30;
        this.height = 30;
        this.speed = 1.2 + (wave * 0.1);
        this.maxHealth = 40 + (wave * 8);
        this.damage = 30; // Explosion damage
        this.color = '#7e22ce'; // Purple
        break;
      case 'standard':
      default:
        this.width = 25;
        this.height = 25;
        this.speed = 1 + (wave * 0.15);
        this.maxHealth = 50 + (wave * 10);
        this.damage = 5 + (wave * 2);
        this.color = '#22c55e'; // Green
        break;
    }

    this.health = this.maxHealth;
    this.attackCooldown = 1000;
    this.lastAttackTime = 0;
    this.rotation = 0;
  }

  /**
   * Move zombie towards target position (player)
   */
  moveTowards(targetX: number, targetY: number, deltaTime: number): void {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Normalize and apply speed
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;

      // Update rotation to face player
      this.rotation = Math.atan2(dy, dx);
    }
  }

  /**
   * Take damage from bullet
   */
  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  /**
   * Check if zombie is dead
   */
  isDead(): boolean {
    return this.health <= 0;
  }

  /**
   * Check if zombie can attack (cooldown expired)
   */
  canAttack(currentTime: number): boolean {
    return currentTime - this.lastAttackTime >= this.attackCooldown;
  }

  /**
   * Perform attack
   */
  attack(currentTime: number): number {
    this.lastAttackTime = currentTime;
    return this.damage;
  }

  /**
   * Render zombie on canvas
   */
  render(ctx: CanvasRenderingContext2D): void {
    // Draw zombie sprite
    drawZombieSprite(ctx, this.x, this.y, this.width, this.height, this.rotation, this.color);

    // Draw health bar above zombie
    const barWidth = this.width;
    const barHeight = 3;
    const barY = this.y - this.height / 2 - 8;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);

    // Health
    const healthWidth = (this.health / this.maxHealth) * barWidth;
    ctx.fillStyle = '#ef4444'; // Red
    ctx.fillRect(this.x - barWidth / 2, barY, healthWidth, barHeight);
  }

  /**
   * Get center position
   */
  getCenter(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
