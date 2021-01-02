import { Beach, BeachPosition } from "@src/models/beach";

const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waist: {
    min: 1.0,
    max: 2.0,
  },
  overHead: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(protected beach: Beach) {}
  public getRatingBasedOnWindAndWavePositions(
    wavePosition: BeachPosition,
    windPosition: BeachPosition,
  ): number {
    if (wavePosition === windPosition) return 1;
    if (this.isWindOffShore(wavePosition, windPosition)) return 5;
    return 3;
  }

  public getRatingForSwellPeriod(swellPeriodInSeconds: number): number {
    const period = swellPeriodInSeconds;
    if (period >= 7 && period < 10) return 2;
    if (period >= 10 && period < 14) return 4;
    if (period >= 14) return 5;
    return 1;
  }

  public getRatingForSwellSize(swellSizeInMeters: number): number {
    const height = swellSizeInMeters;
    if (
      height >= waveHeights.ankleToKnee.min &&
      height < waveHeights.ankleToKnee.max
    )
      return 2;
    if (height >= waveHeights.waist.min && height < waveHeights.waist.max)
      return 3;
    if (height >= waveHeights.overHead.min) return 5;
    return 1;
  }

  public getPositionFromLocation(degrees: number): BeachPosition {
    if (degrees >= 315 || (degrees < 45 && degrees >= 0))
      return BeachPosition.N;
    if (degrees >= 45 && degrees < 135) return BeachPosition.E;
    if (degrees >= 135 && degrees < 225) return BeachPosition.S;
    return BeachPosition.W;
  }

  private isWindOffShore(
    wavePosition: BeachPosition,
    windPosition: BeachPosition,
  ): boolean {
    return (
      (wavePosition === BeachPosition.N &&
        windPosition === BeachPosition.S &&
        this.beach.position === BeachPosition.N) ||
      (wavePosition === BeachPosition.S &&
        windPosition === BeachPosition.N &&
        this.beach.position === BeachPosition.S) ||
      (wavePosition === BeachPosition.E &&
        windPosition === BeachPosition.W &&
        this.beach.position === BeachPosition.E) ||
      (wavePosition === BeachPosition.W &&
        windPosition === BeachPosition.E &&
        this.beach.position === BeachPosition.W)
    );
  }
}
