import { Seconds, Millis } from '../clock/clockCtrl';
import RoundController from '../ctrl';

export interface CorresClockData {
  daysPerTurn: number;
  increment: Seconds;
  white: Seconds;
  black: Seconds;
  showBar: boolean;
}

export interface CorresClockController {
  root: RoundController;
  data: CorresClockData;
  timePercent(color: Color): number;
  update(white: Seconds, black: Seconds): void
  tick(color: Color): void
  millisOf(color: Color): Millis;
}

interface Times {
  white: Millis;
  black: Millis;
  lastUpdate: Millis;
}

export function ctrl(root: RoundController, data: CorresClockData, onFlag: () => void): CorresClockController {

  const timePercentDivisor = 0.1 / data.increment;

  function timePercent(color: Color): number {
    return Math.max(0, Math.min(100, times[color] * timePercentDivisor));
  }

  let times: Times;

  function update(white: Seconds, black: Seconds): void {
    times = {
      white: white * 1000,
      black: black * 1000,
      lastUpdate: Date.now()
    };
  };
  update(data.white, data.black);

  function tick(color: Color): void {
    const now = Date.now();
    times[color] -= now - times.lastUpdate;
    times.lastUpdate = now;
    if (times[color] <= 0) onFlag();
  }

  function millisOf(color: Color): Millis {
    return Math.max(0, times[color]);
  }

  return {
    root,
    data,
    timePercent,
    millisOf,
    update,
    tick
  };
}
