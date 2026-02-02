export interface Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

export interface GameMap {
    name: string;
    obstacles: Obstacle[];
    backgroundColor: string;
    gridColor: string;
}

export const MAPS: GameMap[] = [
    {
        name: 'Open Field',
        obstacles: [],
        backgroundColor: '#0f172a',
        gridColor: '#1e293b'
    },
    {
        name: 'The Maze',
        obstacles: [
            { x: 200, y: 200, width: 50, height: 400, color: '#334155' },
            { x: 400, y: 200, width: 400, height: 50, color: '#334155' },
            { x: 800, y: 100, width: 50, height: 300, color: '#334155' },
            { x: 600, y: 500, width: 300, height: 50, color: '#334155' },
            { x: 1000, y: 400, width: 50, height: 300, color: '#334155' },
        ],
        backgroundColor: '#1e1b4b', // Dark Indigo
        gridColor: '#312e81'
    },
    {
        name: 'City Streets',
        obstacles: [
            // Building blocks
            { x: 100, y: 100, width: 200, height: 200, color: '#374151' },
            { x: 900, y: 100, width: 200, height: 200, color: '#374151' },
            { x: 100, y: 500, width: 200, height: 200, color: '#374151' },
            { x: 900, y: 500, width: 200, height: 200, color: '#374151' },
            // Central monument - Shifted to not block spawn
            { x: 550, y: 200, width: 100, height: 100, color: '#475569' }
        ],
        backgroundColor: '#171717', // Asphalt
        gridColor: '#404040'
    },
    {
        name: 'Narrow Corridor',
        obstacles: [
            // Top wall
            { x: 0, y: 0, width: 1200, height: 250, color: '#0f172a' },
            // Bottom wall
            { x: 0, y: 550, width: 1200, height: 250, color: '#0f172a' },
            // Pillars in middle - Remove center one
            { x: 300, y: 350, width: 50, height: 100, color: '#334155' },
            { x: 850, y: 350, width: 50, height: 100, color: '#334155' }
        ],
        backgroundColor: '#020617',
        gridColor: '#1e293b'
    }
];
