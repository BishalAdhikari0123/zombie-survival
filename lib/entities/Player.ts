import { drawPlayerSprite } from '../utils/sprites';
import { WeaponType } from '../data/weapons';
import { PowerupType } from './Powerup';
import { GameMap } from '../data/maps';
import { checkMapCollision } from '../systems/mapCollision';

/**
 * Player entity representing the player character
 */
export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  maxHealth: number;
  health: number;
  color: string;
  rotation: number; // Angle in radians
  speedBoostTimer: number;
  rapidFireTimer: number;
  currentWeapon: WeaponType;
  weaponTimer: number; // Duration for special weapons if they are pickups

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = 3;
    this.maxHealth = 100;
    this.health = 100;
    this.color = '#3b82f6'; // Blue
    this.rotation = 0; // Facing right by default
    this.speedBoostTimer = 0;
    this.rapidFireTimer = 0;
    this.currentWeapon = 'pistol'; // Default
    this.weaponTimer = 0;
  }

  /**
   * Update logic for timers
   */
  update(deltaTime: number): void {
    if (this.speedBoostTimer > 0) this.speedBoostTimer -= deltaTime;
    if (this.rapidFireTimer > 0) this.rapidFireTimer -= deltaTime;

    if (this.weaponTimer > 0) {
      this.weaponTimer -= deltaTime;
      if (this.weaponTimer <= 0) {
        this.currentWeapon = 'pistol';
      }
    }
  }



  /**
   * Update player position based on velocity
   */
  move(vx: number, vy: number, canvasWidth: number, canvasHeight: number, map: GameMap): void {
    const currentSpeed = this.speed * (this.speedBoostTimer > 0 ? 1.5 : 1);

    const nextX = this.x + vx * currentSpeed;
    const nextY = this.y + vy * currentSpeed;

    // Check X axis collision
    if (!checkMapCollision(nextX, this.y, this.width, this.height, map)) {
      this.x = nextX;
    }

    // Check Y axis collision
    if (!checkMapCollision(this.x, nextY, this.width, this.height, map)) {
      this.y = nextY;
    }

    // Keep player within canvas bounds
    this.x = Math.max(this.width / 2, Math.min(canvasWidth - this.width / 2, this.x));
    this.y = Math.max(this.height / 2, Math.min(canvasHeight - this.height / 2, this.y));
  }

  /**
   * Update facing direction based on target position (mouse)
   */
  updateDirection(targetX: number, targetY: number): void {
    this.rotation = Math.atan2(targetY - this.y, targetX - this.x);
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  applyPowerup(type: PowerupType): void {
    if (type === 'health') {
      this.health = Math.min(this.maxHealth, this.health + 30);
    } else if (type === 'speed') {
      this.speedBoostTimer = 10000; // 10 seconds
    } else if (type === 'rapid_fire') {
      this.rapidFireTimer = 5000; // 5 seconds
    } else if (type.startsWith('weapon_')) {
      // Extract weapon name from 'weapon_name'
      const weaponName = type.replace('weapon_', '') as any;
      this.currentWeapon = weaponName;
      this.weaponTimer = 20000;
    }
  }

  /**
   * Check if player is alive
   */
  isAlive(): boolean {
    return this.health > 0;
  }

  /**
   * Render player on canvas
   */
  render(ctx: CanvasRenderingContext2D): void {
    // Draw status auras
    if (this.speedBoostTimer > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 25, 0, Math.PI * 2);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    if (this.rapidFireTimer > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 28, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw player sprite
    drawPlayerSprite(ctx, this.x, this.y, this.width, this.height, this.rotation, this.currentWeapon);

    // Draw health bar above player
    const barWidth = this.width;
    const barHeight = 4;
    const barY = this.y - this.height / 2 - 10;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);

    // Health
    const healthWidth = (this.health / this.maxHealth) * barWidth;
    ctx.fillStyle = this.health > 50 ? '#22c55e' : this.health > 25 ? '#eab308' : '#ef4444';
    ctx.fillRect(this.x - barWidth / 2, barY, healthWidth, barHeight);
  }

  /**
   * Get center position
   */
  getCenter(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
