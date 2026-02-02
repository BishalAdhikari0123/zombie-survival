'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Player } from '@/lib/entities/Player';
import { Zombie } from '@/lib/entities/Zombie';
import { Bullet } from '@/lib/entities/Bullet';
import { Particle } from '@/lib/entities/Particle';
import { Powerup } from '@/lib/entities/Powerup';
import { WEAPONS } from '@/lib/data/weapons';
import { MAPS, GameMap } from '@/lib/data/maps';
import { updateParticles, createMuzzleFlash, createShell, createImpact } from '@/lib/systems/particles';
import { handlePowerupCollection } from '@/lib/systems/powerups';
import { drawBackground } from '@/lib/utils/drawEnvironment';
import { checkBulletMapCollision } from '@/lib/systems/mapCollision';
import {
  createInputState,
  setupKeyboardListeners,
  setupMouseListeners,
  getMovementVector,
  isShootPressed,
  getMousePosition,
} from '@/lib/utils/input';
import {
  handleBulletZombieCollisions,
  handleZombiePlayerCollisions,
} from '@/lib/systems/collision';
import { spawnZombies, getZombieCountForWave } from '@/lib/systems/spawn';
import { updateZombieMovement } from '@/lib/systems/movement';
import {
  createWaveState,
  shouldStartNextWave,
  startWave,
  updateWave,
} from '@/lib/systems/waves';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalWave, setFinalWave] = useState(0);
  const [savingScore, setSavingScore] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game state (using refs to avoid re-renders)
    const gameState = {
      player: new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2),
      zombies: [] as Zombie[],
      bullets: [] as Bullet[],
      particles: [] as Particle[],
      powerups: [] as Powerup[],
      score: 0,
      map: MAPS[Math.floor(Math.random() * MAPS.length)], // Random map
      inputState: createInputState(),
      waveState: createWaveState(),
      lastShootTime: 0,
      animationId: 0,
      screenShake: 0,
      isRunning: true,
      isPaused: false,
    };

    // Set up input listeners
    const cleanupKeyboard = setupKeyboardListeners(gameState.inputState);
    const cleanupMouse = setupMouseListeners(canvas, gameState.inputState, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Mobile/Touch Support
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      gameState.inputState.touch.active = true;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;

      gameState.inputState.touch.isAiming = false;
      gameState.inputState.touch.moveX = 0;
      gameState.inputState.touch.moveY = 0;

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const tx = (touch.clientX - rect.left) * scaleX;
        const ty = (touch.clientY - rect.top) * scaleY;

        // Simple Joystick Split: Left half move, Right half aim
        if (tx < CANVAS_WIDTH / 2) {
          // Movement Joystick (Center at ~200, 600)
          const centerX = 200;
          const centerY = 600;
          const dx = tx - centerX;
          const dy = ty - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 80;
          gameState.inputState.touch.moveX = dx / Math.max(dist, maxDist);
          gameState.inputState.touch.moveY = dy / Math.max(dist, maxDist);
        } else {
          // Aiming Joystick (Center at ~1000, 600)
          const centerX = 1000;
          const centerY = 600;
          const dx = tx - centerX;
          const dy = ty - centerY;
          gameState.inputState.touch.aimX = dx / 50; // Sensitivity
          gameState.inputState.touch.aimY = dy / 50;
          gameState.inputState.touch.isAiming = true;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        gameState.inputState.touch.moveX = 0;
        gameState.inputState.touch.moveY = 0;
        gameState.inputState.touch.isAiming = false;
      } else {
        // Re-eval touches
        handleTouch(e);
      }
    };

    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    // Pause handler
    const handlePauseKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        gameState.isPaused = !gameState.isPaused;
        setPaused(gameState.isPaused);
      }
    };
    window.addEventListener('keydown', handlePauseKey);

    // Game over session tracking
    const startTime = Date.now();

    // Game loop
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      if (!gameState.isRunning) return;

      // Handle pause - skip all updates but continue rendering
      if (gameState.isPaused) {
        lastTime = currentTime; // Update lastTime to prevent time jump on unpause
        gameState.animationId = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Update Screen Shake decay
      if (gameState.screenShake > 0) {
        gameState.screenShake = Math.max(0, gameState.screenShake - deltaTime * 0.05);
      }

      ctx.save();
      // Apply Screen Shake
      if (gameState.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * gameState.screenShake;
        const shakeY = (Math.random() - 0.5) * gameState.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // Clear canvas and draw background (map color)
      // drawBackground(ctx, CANVAS_WIDTH, CANVAS_HEIGHT); // Replaced by map render

      // Draw Map Background
      ctx.fillStyle = gameState.map.backgroundColor;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Grid
      ctx.strokeStyle = gameState.map.gridColor;
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // Draw Obstacles
      gameState.map.obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        // Bevel/Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      });

      // Check if player is alive
      if (!gameState.player.isAlive()) {
        gameState.isRunning = false;
        const score = gameState.score;
        const wave = gameState.waveState.currentWave;
        const duration = Math.floor((Date.now() - startTime) / 1000);

        setFinalScore(score);
        setFinalWave(wave);
        setGameOver(true);

        // Save session if logged in
        const token = localStorage.getItem('token');
        if (token) {
          setSavingScore(true);
          import('@/lib/api').then(({ gameApi }) => {
            gameApi.saveSession({
              score,
              waveReached: wave,
              duration
            }).then(() => {
              setSavingScore(false);
              setScoreSaved(true);
            }).catch(err => {
              console.error('Failed to save score:', err);
              setSavingScore(false);
            });
          });
        }
        return;
      }

      // Wave management
      if (shouldStartNextWave(gameState.waveState, Date.now())) {
        const zombieCount = getZombieCountForWave(gameState.waveState.currentWave + 1);
        const newZombies = spawnZombies(
          zombieCount,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          gameState.waveState.currentWave + 1
        );
        gameState.zombies.push(...newZombies);
        startWave(gameState.waveState, zombieCount);
      }

      // Player movement
      const movement = getMovementVector(gameState.inputState);
      gameState.player.move(movement.vx, movement.vy, CANVAS_WIDTH, CANVAS_HEIGHT, gameState.map);
      gameState.player.update(deltaTime);

      // Update player facing direction to mouse/touch
      const playerCenter = gameState.player.getCenter();
      const mousePos = getMousePosition(gameState.inputState, playerCenter.x, playerCenter.y);
      gameState.player.updateDirection(mousePos.x, mousePos.y);

      // Player shooting
      if (isShootPressed(gameState.inputState)) {
        const now = Date.now();
        const weaponStats = WEAPONS[gameState.player.currentWeapon];

        // Calculate cooldown with rapid fire buff
        let cooldown = weaponStats.cooldown;
        if (gameState.player.rapidFireTimer > 0) {
          cooldown /= 2;
        }

        if (now - gameState.lastShootTime >= cooldown) {
          const playerCenter = gameState.player.getCenter();
          const mousePos = getMousePosition(gameState.inputState, playerCenter.x, playerCenter.y);

          const angle = Math.atan2(mousePos.y - playerCenter.y, mousePos.x - playerCenter.x);

          // Spawn bullets (loop for shotgun/spread)
          for (let i = 0; i < weaponStats.bulletCount; i++) {
            const bullet = new Bullet(
              playerCenter.x,
              playerCenter.y,
              mousePos.x,
              mousePos.y,
              {
                damage: weaponStats.damage,
                speed: weaponStats.bulletSpeed,
                range: weaponStats.range,
                color: weaponStats.color,
                radius: weaponStats.bulletRadius,
                spread: weaponStats.spread,
                penetration: weaponStats.penetration,
                explosiveRadius: weaponStats.explosiveRadius
              }
            );
            gameState.bullets.push(bullet);
          }

          // Muzzle flash
          const muzzlePos = {
            x: playerCenter.x + Math.cos(angle) * 30,
            y: playerCenter.y + Math.sin(angle) * 30
          };
          gameState.particles.push(...createMuzzleFlash(muzzlePos.x, muzzlePos.y, angle, weaponStats.color));

          // Shell ejection (except for tech weapons like Laser/Plasma)
          if (['pistol', 'uzi', 'machine_gun', 'shotgun', 'sniper', 'magnum'].includes(gameState.player.currentWeapon)) {
            gameState.particles.push(createShell(playerCenter.x, playerCenter.y, angle));
          }

          // Apply screenshake based on weapon
          if (weaponStats.explosiveRadius > 0) {
            gameState.screenShake = 10;
          } else if (weaponStats.bulletCount > 1) {
            gameState.screenShake = 5;
          } else {
            gameState.screenShake = 2;
          }

          // Recoil (Kickback)
          const kickback = weaponStats.explosiveRadius > 0 ? 4 : (weaponStats.bulletCount > 1 ? 3 : 1);
          const kickX = Math.cos(angle) * kickback;
          const kickY = Math.sin(angle) * kickback;
          // Apply recoil by attempting a "move" in the opposite direction
          gameState.player.move(-kickX, -kickY, CANVAS_WIDTH, CANVAS_HEIGHT, gameState.map);

          gameState.lastShootTime = now;
        }
      }

      // Update bullets
      gameState.bullets = gameState.bullets.filter((bullet) => {
        bullet.update();
        if (checkBulletMapCollision(bullet.x, bullet.y, bullet.radius, gameState.map)) {
          gameState.particles.push(...createImpact(bullet.x, bullet.y, bullet.color));
          return false;
        }
        return !bullet.isOutOfBounds(CANVAS_WIDTH, CANVAS_HEIGHT);
      });

      // Update particles
      gameState.particles = updateParticles(gameState.particles);

      // Update zombie movement
      updateZombieMovement(gameState.zombies, gameState.player, deltaTime, gameState.map);

      // Handle collisions
      const collisionResult = handleBulletZombieCollisions(
        gameState.bullets,
        gameState.zombies,
        gameState.particles,
        gameState.powerups,
        gameState.waveState.currentWave
      );
      gameState.bullets = collisionResult.bullets;
      gameState.zombies = collisionResult.zombies;
      gameState.score += collisionResult.kills * 10;

      handleZombiePlayerCollisions(
        gameState.zombies,
        gameState.player,
        Date.now()
      );

      // Shake screen if player hit (detecting health change could be done but simpler is just fixed check in logic or just check damage event)
      // Since we don't have a returned "wasHit" from handleZombiePlayerCollisions here, let's keep it simple.
      // Actually, let's check player health change if we want it to be perfectly accurate, but I'll skip for now.

      // Update Powerups
      gameState.powerups = handlePowerupCollection(gameState.powerups, gameState.player);

      // Update wave state
      updateWave(gameState.waveState, gameState.zombies.length);

      // Render
      // Draw grid


      // Render entities
      // Particles (render below entities? or above? usually below living, above dead. we'll do below for stains, above for smoke)
      // For now, render all particles below bullets/zombies, or maybe split layers.
      // Let's render them first (under) for blood stains, but we might want flash on top.
      // Simple approach: render all particles first.
      gameState.particles.forEach((p) => p.render(ctx));
      gameState.powerups.forEach((p) => p.render(ctx));

      gameState.zombies.forEach((zombie) => zombie.render(ctx));
      gameState.bullets.forEach((bullet) => bullet.render(ctx));
      gameState.player.render(ctx);

      // Render Mobile Joysticks
      if (gameState.inputState.touch.active) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#fff';
        // Move
        ctx.beginPath(); ctx.arc(200, 600, 60, 0, Math.PI * 2); ctx.fill();
        // Aim
        ctx.beginPath(); ctx.arc(1000, 600, 60, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Render HUD
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`Score: ${gameState.score}`, 20, 40);
      ctx.fillText(`Wave: ${gameState.waveState.currentWave}`, 20, 70);
      ctx.fillText(
        `Zombies: ${gameState.zombies.length}`,
        20,
        100
      );

      // Health bar
      const healthBarWidth = 200;
      const healthBarHeight = 30;
      const healthBarX = CANVAS_WIDTH - healthBarWidth - 20;
      const healthBarY = 20;

      ctx.fillStyle = '#334155';
      ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

      const healthPercent = gameState.player.health / gameState.player.maxHealth;
      const currentHealthWidth = healthBarWidth * healthPercent;

      ctx.fillStyle =
        healthPercent > 0.5
          ? '#22c55e'
          : healthPercent > 0.25
            ? '#eab308'
            : '#ef4444';
      ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `HP: ${Math.ceil(gameState.player.health)}/${gameState.player.maxHealth}`,
        healthBarX + healthBarWidth / 2,
        healthBarY + healthBarHeight / 2 + 6
      );
      ctx.textAlign = 'left';

      // Weapon UI
      const weaponStats = WEAPONS[gameState.player.currentWeapon];
      ctx.fillStyle = weaponStats.color;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Weapon: ${weaponStats.name}`, 20, CANVAS_HEIGHT - 60);

      if (gameState.player.weaponTimer > 0) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText(`Time: ${Math.ceil(gameState.player.weaponTimer / 1000)}s`, 20, CANVAS_HEIGHT - 35);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText('Infinite Ammo', 20, CANVAS_HEIGHT - 35);
      }

      // Wave message
      if (!gameState.waveState.waveInProgress && gameState.waveState.currentWave > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, CANVAS_HEIGHT / 2 - 50, CANVAS_WIDTH, 100);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `Wave ${gameState.waveState.currentWave} Complete!`,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2
        );
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(
          'Next wave incoming...',
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2 + 40
        );
        ctx.textAlign = 'left';
      }

      ctx.restore();

      // Continue loop
      gameState.animationId = requestAnimationFrame(gameLoop);
    };

    // Start game loop
    gameState.animationId = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      gameState.isRunning = false;
      cancelAnimationFrame(gameState.animationId);
      cleanupKeyboard();
      cleanupMouse();
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
      canvas.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handlePauseKey);
    };
  }, []);

  const handleRestart = () => {
    setGameOver(false);
    setFinalScore(0);
    setFinalWave(0);
    // Force re-mount by changing key
    window.location.reload();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0f172a',
        position: 'relative',
      }}
    >
      <div style={{
        width: '95vw',
        height: 'auto',
        maxHeight: '90vh',
        maxWidth: '1200px',
        aspectRatio: '3/2',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            border: '2px solid #334155',
            borderRadius: '8px',
            background: '#000',
            cursor: 'crosshair',
            touchAction: 'none'
          }}
        />
      </div>

      <div style={{
        marginTop: '1.5rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.875rem',
        padding: '0 20px'
      }}>
        <p style={{ marginBottom: '0.5rem', color: '#fbbf24', fontWeight: 'bold' }}>
          {typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'Rotate for better experience' : ''}
        </p>
        <p>WASD/Arrows to move • Click to shoot</p>
        <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>On Mobile/iPad: Use Left side to move, Right side to aim/shoot</p>
      </div>

      {paused && !gameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.85)',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '3px solid #3b82f6',
          }}
        >
          <h1 style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '1rem' }}>
            PAUSED
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
            Press ESC or P to resume
          </p>
        </div>
      )}

      {gameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '3px solid #ef4444',
          }}
        >
          <h1 style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' }}>
            GAME OVER
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Final Score: <span style={{ color: '#fbbf24' }}>{finalScore}</span>
          </p>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
            Waves Survived: <span style={{ color: '#22c55e' }}>{finalWave}</span>
          </p>

          <div style={{ marginBottom: '2rem' }}>
            {savingScore ? (
              <p style={{ color: '#64748b', fontSize: '1rem' }}>Saving score to leaderboard...</p>
            ) : scoreSaved ? (
              <p style={{ color: '#22c55e', fontSize: '1rem', fontWeight: 'bold' }}>✓ Score saved to Hall of Fame!</p>
            ) : !localStorage.getItem('token') ? (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Log in</Link> to save your score.
              </p>
            ) : null}
          </div>

          <button
            onClick={handleRestart}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.25rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '1rem',
            }}
          >
            Play Again
          </button>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              fontSize: '1.25rem',
              background: '#475569',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Main Menu
          </a>
        </div>
      )}

      <div
        style={{
          marginTop: '1rem',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '0.875rem',
        }}
      >
        <p>WASD or Arrow Keys to move • Click to shoot • ESC or P to pause</p>
      </div>
    </div>
  );
}
