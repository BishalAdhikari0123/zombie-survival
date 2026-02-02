/**
 * Draw the game background
 */
export function drawBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
): void {
    // Dark ground color
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw tiles/grid pattern
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    const tileSize = 50;

    for (let x = 0; x < width; x += tileSize) {
        for (let y = 0; y < height; y += tileSize) {
            // Draw random floor detail
            // Using deterministic random based on position to keep it static
            const randomVal = Math.sin(x * 123 + y * 321);

            if (randomVal > 0.9) {
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(x + 5, y + 5, 10, 5);
            } else if (randomVal < -0.9) {
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(x + 20, y + 30, 5, 5);
            }

            ctx.strokeRect(x, y, tileSize, tileSize);
        }
    }

    // Vignette effect
    const gradient = ctx.createRadialGradient(width / 2, height / 2, height / 2, width / 2, height / 2, height);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.6)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}
