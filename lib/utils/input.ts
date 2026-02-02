/**
 * Input handler for keyboard, mouse, and touch
 */
export interface InputState {
  keys: Set<string>;
  mouse: {
    x: number;
    y: number;
    clicked: boolean;
  };
  touch: {
    moveX: number; // -1 to 1
    moveY: number; // -1 to 1
    aimX: number;  // -1 to 1 relative to player
    aimY: number;  // -1 to 1 relative to player
    active: boolean;
    isAiming: boolean;
  };
}

export function createInputState(): InputState {
  return {
    keys: new Set(),
    mouse: {
      x: 0,
      y: 0,
      clicked: false,
    },
    touch: {
      moveX: 0,
      moveY: 0,
      aimX: 0,
      aimY: 0,
      active: false,
      isAiming: false
    }
  };
}

/**
 * Set up keyboard event listeners
 */
export function setupKeyboardListeners(inputState: InputState): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    inputState.keys.add(e.key.toLowerCase());
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    inputState.keys.delete(e.key.toLowerCase());
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}

/**
 * Set up mouse event listeners with scaling support
 */
export function setupMouseListeners(
  canvas: HTMLCanvasElement,
  inputState: InputState,
  logicalWidth: number,
  logicalHeight: number
): () => void {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = logicalWidth / rect.width;
    const scaleY = logicalHeight / rect.height;
    inputState.mouse.x = (e.clientX - rect.left) * scaleX;
    inputState.mouse.y = (e.clientY - rect.top) * scaleY;
  };

  const handleMouseDown = () => {
    inputState.mouse.clicked = true;
  };

  const handleMouseUp = () => {
    inputState.mouse.clicked = false;
  };

  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp); // Use window for better release detection

  return () => {
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mouseup', handleMouseUp);
  };
}

/**
 * Get movement vector from input state (WASD + Touch)
 */
export function getMovementVector(inputState: InputState): { vx: number; vy: number } {
  let vx = 0;
  let vy = 0;

  // Keyboard
  if (inputState.keys.has('w') || inputState.keys.has('arrowup')) vy -= 1;
  if (inputState.keys.has('s') || inputState.keys.has('arrowdown')) vy += 1;
  if (inputState.keys.has('a') || inputState.keys.has('arrowleft')) vx -= 1;
  if (inputState.keys.has('d') || inputState.keys.has('arrowright')) vx += 1;

  // Touch Override (if active)
  if (inputState.touch.active) {
    vx = inputState.touch.moveX;
    vy = inputState.touch.moveY;
  }

  // Normalize
  if (vx !== 0 || vy !== 0) {
    const length = Math.sqrt(vx * vx + vy * vy);
    if (length > 1) { // Only normalize if exceeding 1 (keyboard)
      vx /= length;
      vy /= length;
    }
  }

  return { vx, vy };
}

/**
 * Check if shoot button is pressed
 */
export function isShootPressed(inputState: InputState): boolean {
  return inputState.mouse.clicked || inputState.touch.isAiming;
}

/**
 * Get mouse position or touch aim position
 */
export function getMousePosition(
  inputState: InputState,
  playerX: number = 600,
  playerY: number = 400
): { x: number; y: number } {
  if (inputState.touch.active && inputState.touch.isAiming) {
    // For mobile, aim is a vector from player
    return {
      x: playerX + inputState.touch.aimX * 200,
      y: playerY + inputState.touch.aimY * 200
    };
  }
  return { x: inputState.mouse.x, y: inputState.mouse.y };
}
