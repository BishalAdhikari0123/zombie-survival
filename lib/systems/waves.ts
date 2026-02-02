/**
 * Wave management system
 */
export interface WaveState {
  currentWave: number;
  zombiesRemaining: number;
  waveInProgress: boolean;
  waveStartDelay: number;
  lastWaveEndTime: number;
}

export function createWaveState(): WaveState {
  return {
    currentWave: 0,
    zombiesRemaining: 0,
    waveInProgress: false,
    waveStartDelay: 3000, // 3 seconds between waves
    lastWaveEndTime: 0,
  };
}

export function shouldStartNextWave(
  waveState: WaveState,
  currentTime: number
): boolean {
  return (
    !waveState.waveInProgress &&
    waveState.zombiesRemaining === 0 &&
    currentTime - waveState.lastWaveEndTime >= waveState.waveStartDelay
  );
}

export function startWave(waveState: WaveState, zombieCount: number): void {
  waveState.currentWave++;
  waveState.zombiesRemaining = zombieCount;
  waveState.waveInProgress = true;
}

export function updateWave(waveState: WaveState, zombiesAlive: number): void {
  waveState.zombiesRemaining = zombiesAlive;

  if (waveState.waveInProgress && zombiesAlive === 0) {
    waveState.waveInProgress = false;
    waveState.lastWaveEndTime = Date.now();
  }
}
