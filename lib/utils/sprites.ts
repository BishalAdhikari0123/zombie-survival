/**
 * Sprite rendering utilities
 */

import { WeaponType } from '../data/weapons';

/**
 * Draw a player sprite (human character)
 */
export function drawPlayerSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number = 0,
  weaponType: WeaponType = 'pistol'
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Add shadow for depth
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Scale factors to keep within width/height but look proportional
  const scale = width / 40; // Base size reference

  // --- Arms (holding gun) ---
  ctx.fillStyle = '#1e3a8a'; // Dark blue sleeves
  // Right arm (lower)
  ctx.beginPath();
  ctx.ellipse(5 * scale, 10 * scale, 8 * scale, 3 * scale, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  // Left arm (upper)
  ctx.beginPath();
  ctx.ellipse(5 * scale, -10 * scale, 8 * scale, 3 * scale, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Hands (skin tone)
  ctx.fillStyle = '#f4a460';
  // Right hand
  ctx.beginPath();
  ctx.arc(12 * scale, 8 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();
  // Left hand
  ctx.beginPath();
  ctx.arc(12 * scale, -8 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  // --- Body (Shoulders/Vest) ---
  const bodyGrad = ctx.createLinearGradient(-10 * scale, 0, 10 * scale, 0);
  bodyGrad.addColorStop(0, '#1e3a8a');
  bodyGrad.addColorStop(0.5, '#3b82f6');
  bodyGrad.addColorStop(1, '#1e3a8a');

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(-5 * scale, 0, 12 * scale, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- Head ---
  const headGrad = ctx.createRadialGradient(-2 * scale, -2 * scale, 2 * scale, 0, 0, 10 * scale);
  headGrad.addColorStop(0, '#fcd34d');
  headGrad.addColorStop(0.3, '#f4a460');
  headGrad.addColorStop(1, '#d97706');

  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 9 * scale, 0, Math.PI * 2);
  ctx.fill();

  // --- Weapon Sprite ---
  ctx.save();
  ctx.translate(15 * scale, 2 * scale);

  switch (weaponType) {
    case 'pistol':
      ctx.fillStyle = '#4b5563'; // Grey
      ctx.fillRect(0, -2 * scale, 8 * scale, 4 * scale);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(-2 * scale, -1 * scale, 4 * scale, 2 * scale);
      break;
    case 'uzi':
      ctx.fillStyle = '#1f2937'; // Black
      ctx.fillRect(0, -3 * scale, 10 * scale, 6 * scale);
      ctx.fillStyle = '#4b5563';
      ctx.fillRect(2 * scale, -1 * scale, 12 * scale, 2 * scale);
      break;
    case 'machine_gun':
      ctx.fillStyle = '#374151';
      ctx.fillRect(-2 * scale, -3 * scale, 15 * scale, 6 * scale);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(13 * scale, -1.5 * scale, 12 * scale, 3 * scale);
      break;
    case 'shotgun':
      ctx.fillStyle = '#451a03'; // Wood stock
      ctx.fillRect(-4 * scale, -2.5 * scale, 8 * scale, 5 * scale);
      ctx.fillStyle = '#1f2937'; // Double barrel
      ctx.fillRect(4 * scale, -3 * scale, 18 * scale, 2.5 * scale);
      ctx.fillRect(4 * scale, 0.5 * scale, 18 * scale, 2.5 * scale);
      break;
    case 'sniper':
      ctx.fillStyle = '#064e3b'; // Camo dark green
      ctx.fillRect(-5 * scale, -3 * scale, 18 * scale, 6 * scale);
      ctx.fillStyle = '#1f2937'; // Long barrel
      ctx.fillRect(13 * scale, -1 * scale, 25 * scale, 2 * scale);
      ctx.fillStyle = '#374151'; // Scope
      ctx.fillRect(0, -5 * scale, 8 * scale, 3 * scale);
      break;
    case 'flamethrower':
      ctx.fillStyle = '#991b1b'; // Red tank
      ctx.fillRect(-2 * scale, -4 * scale, 10 * scale, 8 * scale);
      ctx.fillStyle = '#4b5563'; // Nozzle
      ctx.fillRect(8 * scale, -2 * scale, 15 * scale, 4 * scale);
      ctx.fillStyle = '#f97316'; // Orange tip
      ctx.fillRect(23 * scale, -2.5 * scale, 3 * scale, 5 * scale);
      break;
    case 'bazooka':
      ctx.fillStyle = '#14532d'; // Olive green
      ctx.fillRect(-8 * scale, -5 * scale, 30 * scale, 10 * scale);
      ctx.fillStyle = '#1f2937'; // Hole
      ctx.beginPath();
      ctx.arc(22 * scale, 0, 5 * scale, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'laser':
      ctx.fillStyle = '#065f46'; // Emerald tech
      ctx.fillRect(0, -4 * scale, 15 * scale, 8 * scale);
      ctx.fillStyle = '#10b981'; // Flowing laser energy
      ctx.fillRect(15 * scale, -2 * scale, 10 * scale, 4 * scale);
      break;
    case 'magnum':
      ctx.fillStyle = '#94a3b8'; // Silver
      ctx.fillRect(0, -3 * scale, 12 * scale, 6 * scale);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-3 * scale, -2 * scale, 6 * scale, 4 * scale);
      break;
    case 'plasma':
      ctx.fillStyle = '#4c1d95'; // Purple tech
      ctx.fillRect(0, -5 * scale, 14 * scale, 10 * scale);
      ctx.fillStyle = '#a78bfa'; // Glow
      ctx.beginPath();
      ctx.arc(7 * scale, 0, 6 * scale, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
  ctx.restore();
}

/**
 * Draw a zombie sprite
 */
export function drawZombieSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number = 0,
  colorOverride?: string
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  const scale = width / 40; // Normalize scale based on width

  // --- Arms (Reaching out) ---
  const skinColor = colorOverride || '#15803d';
  ctx.fillStyle = skinColor; // Use Override Color

  // Right arm reaching forward
  ctx.beginPath();
  // Draw arm segments slightly uneven
  ctx.ellipse(10 * scale, 8 * scale, 10 * scale, 3 * scale, Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();

  // Left arm reaching forward
  ctx.beginPath();
  ctx.ellipse(10 * scale, -8 * scale, 10 * scale, 3 * scale, -Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();

  // Hands (Claws)
  ctx.fillStyle = '#14532d'; // Darker green hands
  ctx.beginPath();
  ctx.arc(20 * scale, 10 * scale, 3 * scale, 0, Math.PI * 2); // Right hand
  ctx.fill();
  ctx.beginPath();
  ctx.arc(20 * scale, -10 * scale, 3 * scale, 0, Math.PI * 2); // Left hand
  ctx.fill();

  // --- Body ---
  // Ripped clothes (Grey/Brown)
  const bodyGrad = ctx.createLinearGradient(-10 * scale, 0, 10 * scale, 0);
  bodyGrad.addColorStop(0, '#374151');
  bodyGrad.addColorStop(0.5, '#4b5563');
  bodyGrad.addColorStop(1, '#374151');

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  // Irregular shape for ragged clothes
  ctx.moveTo(-10 * scale, -8 * scale);
  ctx.lineTo(5 * scale, -10 * scale);
  ctx.lineTo(5 * scale, 10 * scale);
  ctx.lineTo(-10 * scale, 8 * scale);
  ctx.closePath();
  ctx.fill();

  // Blood stains
  ctx.fillStyle = 'rgba(185, 28, 28, 0.7)';
  ctx.beginPath();
  ctx.arc(0, 2 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  // --- Head ---
  // Zombie skin gradient
  const headGrad = ctx.createRadialGradient(-2 * scale, -2 * scale, 2 * scale, 0, 0, 10 * scale);
  headGrad.addColorStop(0, '#84cc16'); // Light green
  headGrad.addColorStop(0.4, '#65a30d'); // Green
  headGrad.addColorStop(1, '#365314'); // Dark Moss

  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 9 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (Glowing Red)
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ef4444';

  ctx.beginPath();
  ctx.arc(3 * scale, -3 * scale, 1.5 * scale, 0, Math.PI * 2); // Left eye relative to rotation
  ctx.fill();

  ctx.beginPath();
  ctx.arc(3 * scale, 3 * scale, 1.5 * scale, 0, Math.PI * 2); // Right eye
  ctx.fill();

  // Reset shadow for hair/scars
  ctx.shadowBlur = 0;

  // Scars/Decay
  ctx.strokeStyle = '#14532d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-4 * scale, -5 * scale);
  ctx.lineTo(-2 * scale, -2 * scale);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw a bullet sprite
 */
export function drawBulletSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string = '#fbbf24'
): void {
  // Outer glow
  ctx.save();
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.5);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.5, color + '66'); // Adding transparency
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Core bullet
  ctx.fillStyle = '#fff'; // White core for that "bright" look
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Inner color ring
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}
