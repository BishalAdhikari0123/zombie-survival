import { GameMap, Obstacle } from '../data/maps';
import { checkRectCollision } from './collision';

/**
 * Check if a rectangle collides with any map obstacle
 */
export function checkMapCollision(
    x: number,
    y: number,
    width: number,
    height: number,
    map: GameMap
): Obstacle | null {
    for (const obstacle of map.obstacles) {
        if (
            checkRectCollision(
                x,
                y,
                width,
                height,
                obstacle.x + obstacle.width / 2, // helper expects center
                obstacle.y + obstacle.height / 2,
                obstacle.width,
                obstacle.height
            )
        ) {
            return obstacle;
        }
    }
    return null;
}

/**
 * Check if a circle (bullet) collides with any map obstacle
 */
export function checkBulletMapCollision(
    x: number,
    y: number,
    radius: number,
    map: GameMap
): boolean {
    for (const obstacle of map.obstacles) {
        // Simple circle-rect check (can reuse collision.ts function if exported, or simplified bound check)
        // Reusing simple rect check by approximating circle as rect
        if (
            x + radius > obstacle.x &&
            x - radius < obstacle.x + obstacle.width &&
            y + radius > obstacle.y &&
            y - radius < obstacle.y + obstacle.height
        ) {
            return true;
        }
    }
    return false;
}
