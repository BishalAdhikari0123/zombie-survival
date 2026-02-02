/**
 * 3D Virtual Joystick for mobile/tablet devices
 */

export interface JoystickState {
  moveJoystick: {
    active: boolean;
    x: number; // -1 to 1
    y: number; // -1 to 1
    touchId: number | null;
    startX: number;
    startY: number;
  };
  aimJoystick: {
    active: boolean;
    x: number; // -1 to 1
    y: number; // -1 to 1
    touchId: number | null;
    startX: number;
    startY: number;
  };
}

export function createJoystickState(): JoystickState {
  return {
    moveJoystick: {
      active: false,
      x: 0,
      y: 0,
      touchId: null,
      startX: 0,
      startY: 0,
    },
    aimJoystick: {
      active: false,
      x: 0,
      y: 0,
      touchId: null,
      startX: 0,
      startY: 0,
    },
  };
}

/**
 * Draw a 3D-style joystick
 */
export function drawJoystick(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  stickX: number,
  stickY: number,
  color: string,
  isActive: boolean
) {
  const baseOpacity = isActive ? 0.5 : 0.3;
  const stickRadius = radius * 0.4;

  // Draw outer glow when active
  if (isActive) {
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.2);
    const glowColor = color.replace(')', ', 0.25)').replace('rgb', 'rgba');
    gradient.addColorStop(0, glowColor);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Base circle with 3D effect
  const baseGradient = ctx.createRadialGradient(
    centerX - radius * 0.3,
    centerY - radius * 0.3,
    radius * 0.1,
    centerX,
    centerY,
    radius
  );
  baseGradient.addColorStop(0, `rgba(100, 100, 100, ${baseOpacity + 0.2})`);
  baseGradient.addColorStop(0.7, `rgba(50, 50, 50, ${baseOpacity})`);
  baseGradient.addColorStop(1, `rgba(20, 20, 20, ${baseOpacity})`);

  ctx.fillStyle = baseGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Inner border for depth
  ctx.strokeStyle = `rgba(150, 150, 150, ${baseOpacity * 0.5})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
  ctx.stroke();

  // Directional markers (cross)
  ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity * 0.3})`;
  ctx.lineWidth = 2;
  const markerLen = radius * 0.6;
  
  // Horizontal
  ctx.beginPath();
  ctx.moveTo(centerX - markerLen, centerY);
  ctx.lineTo(centerX + markerLen, centerY);
  ctx.stroke();
  
  // Vertical
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - markerLen);
  ctx.lineTo(centerX, centerY + markerLen);
  ctx.stroke();

  // Calculate stick position
  const maxOffset = radius * 0.6;
  const stickPosX = centerX + stickX * maxOffset;
  const stickPosY = centerY + stickY * maxOffset;

  // Stick shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.arc(stickPosX + 3, stickPosY + 3, stickRadius, 0, Math.PI * 2);
  ctx.fill();

  // Stick with 3D gradient
  const stickGradient = ctx.createRadialGradient(
    stickPosX - stickRadius * 0.4,
    stickPosY - stickRadius * 0.4,
    stickRadius * 0.2,
    stickPosX,
    stickPosY,
    stickRadius
  );
  
  // Convert rgb to rgba with alpha values
  const rgbaColor1 = color.replace(')', ', 1)').replace('rgb', 'rgba');
  const rgbaColor2 = color.replace(')', ', 0.9)').replace('rgb', 'rgba');
  const rgbaColor3 = color.replace(')', ', 0.7)').replace('rgb', 'rgba');
  
  stickGradient.addColorStop(0, rgbaColor1);
  stickGradient.addColorStop(0.6, rgbaColor2);
  stickGradient.addColorStop(1, rgbaColor3);

  ctx.fillStyle = stickGradient;
  ctx.beginPath();
  ctx.arc(stickPosX, stickPosY, stickRadius, 0, Math.PI * 2);
  ctx.fill();

  // Stick highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(stickPosX - stickRadius * 0.3, stickPosY - stickRadius * 0.3, stickRadius * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Outer ring
  ctx.strokeStyle = isActive ? color : `rgba(100, 100, 100, ${baseOpacity})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Get joystick positions for rendering (responsive)
 */
export function getJoystickPositions(canvasWidth: number, canvasHeight: number) {
  const isMobile = canvasWidth < 800;
  const radius = isMobile ? 60 : 80;
  const margin = radius + 20;

  return {
    move: {
      x: margin,
      y: canvasHeight - margin,
      radius,
    },
    aim: {
      x: canvasWidth - margin,
      y: canvasHeight - margin,
      radius,
    },
  };
}

/**
 * Check if touch is within joystick area
 */
export function isTouchInJoystick(
  touchX: number,
  touchY: number,
  joystickX: number,
  joystickY: number,
  radius: number
): boolean {
  const dx = touchX - joystickX;
  const dy = touchY - joystickY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= radius * 1.5; // Slightly larger hit area
}

/**
 * Calculate joystick values from touch position
 */
export function calculateJoystickValue(
  touchX: number,
  touchY: number,
  centerX: number,
  centerY: number,
  maxRadius: number
): { x: number; y: number } {
  const dx = touchX - centerX;
  const dy = touchY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDist = maxRadius * 0.6;

  if (distance < 1) return { x: 0, y: 0 };

  // Normalize and clamp
  const normalized = Math.min(distance / maxDist, 1);
  const x = (dx / distance) * normalized;
  const y = (dy / distance) * normalized;

  return { x, y };
}
