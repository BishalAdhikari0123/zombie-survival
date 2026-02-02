# Zombie Survival Game 🧟

A fast-paced, high-octane 2D top-down zombie survival game built with **Next.js 14**, **TypeScript**, and **HTML Canvas**. Developed entirely through **Vibe Coding**. Survive endless waves of zombies, scavenge for powerful weapons, and climb the leaderboard.

## 🎮 Game Features

- **Top-Down Action**: Precise movement and aiming mechanics for an intense combat experience.
- **Dynamic Wave System**: Face increasingly difficult waves with faster, tankier, and more lethal zombies.
- **Tiered Loot Drops**: Defeated zombies have a 25% chance to drop powerups or weapons.
- **Advanced Arsenal**: Progressive weapon system that unlocks more powerful gear as you survive longer:
  - **Early Game**: Uzi, Machine Gun, Shotgun.
  - **Mid Game**: Magnum, Plasma Rifle.
  - **Late Game**: Laser, Flamethrower, Bazooka, Sniper Rifle.
- **Visual Effects**: Immersive particle systems for blood splatter, muzzle flashes, shell ejections, and explosive impacts.
- **Cross-Platform Support**: Fully responsive design with **Touch JoyStick** support for mobile and tablet gameplay.
- **Procedural Background**: Dark, atmospheric grid-based environment with vignette effects.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust type safety
- **Rendering**: **HTML Canvas API** (No external game engines or libraries)
- **Game Engine**: Custom-built `requestAnimationFrame` game loop with decoupled systems:
  - `lib/entities`: OOP-based entity management.
  - `lib/systems`: Modular logic for spawning, collision, powerups, and particles.
  - `lib/utils`: Optimized math and input handling.

## 📁 Project Structure

```text
frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home/Menu page
│   └── game/
│       └── page.tsx         # Main game implementation (Canvas + UI)
├── lib/
│   ├── entities/            # Player, Zombie, Bullet, Powerup, Particle classes
│   ├── systems/             # Game logic (collision, waves, spawning, powerups)
│   └── utils/               # Helpers (input, math, environment drawing)
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm / npm / yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd zombieGame/frontend

# Install dependencies
pnpm install
```

### Running the Game

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

## 🕹️ Controls

### PC (Keyboard & Mouse)
- **W / ↑**: Move Up
- **A / ←**: Move Left
- **S / ↓**: Move Down
- **D / →**: Move Right
- **Mouse Movement**: Aim
- **Left Click**: Shoot

### Mobile / Tablet
- **Left Joystick**: Movement
- **Right Joystick**: Aim & Shoot
- **Auto-Scale**: Game canvas automatically adjusts to any screen size and orientation.

## 🧪 Game Mechanics

### Player Stats
- **Health**: 100 HP (Regenerates with health powerups).
- **Base Speed**: 3 units/frame.
- **Auto-Aim**: Visual indicator for projectile pathing.

### Zombie Scalability
Zombies evolve every wave to keep the challenge high:
- **Speed**: Increases by 15% per wave.
- **Health**: Base 50 HP + 10 per wave.
- **Damage**: Base 5 HP + 2 per wave.

### Combat System
- **Projectiles**: Vary in speed, damage, and size based on the equipped weapon.
- **Collision**: Precise circle-to-circle collision detection for entities.
- **Feedback**: Dynamic screenshake and particle effects on impact.

## ✨ Future Roadmap

- [ ] Persistent Global Leaderboard (Backend integration).
- [ ] Character Upgrades (Permanent stat boosts).
- [ ] Alternative Maps (Urban, Forest, Lab).
- [ ] Multi-player Co-op mode.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.