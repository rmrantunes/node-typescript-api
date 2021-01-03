import { ForecastPoint } from "@src/clients/stormGlass";
import { Beach, GeoPosition } from "@src/models/beach";

const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waist: {
    min: 1.0,
    max: 2.0,
  },
  overhead: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(protected beach: Beach) {}
  public getRatingBasedOnWindAndWavePositions(
    wavePosition: GeoPosition,
    windPosition: GeoPosition,
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

  public getRatingForSwellSize(swellHeightInMeters: number): number {
    const height = swellHeightInMeters;
    if (
      height >= waveHeights.ankleToKnee.min &&
      height < waveHeights.ankleToKnee.max
    )
      return 2;
    if (height >= waveHeights.waist.min && height < waveHeights.waist.max)
      return 3;
    if (height >= waveHeights.overhead.min) return 5;
    return 1;
  }

  public getPositionFromLocation(degrees: number): GeoPosition {
    if (degrees >= 315 || (degrees < 45 && degrees >= 0))
      return GeoPosition.N;
    if (degrees >= 45 && degrees < 135) return GeoPosition.E;
    if (degrees >= 135 && degrees < 225) return GeoPosition.S;
    return GeoPosition.W;
  }

  public getForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection = this.getPositionFromLocation(point.windDirection);

    const windAndWaveRating = this.getRatingBasedOnWindAndWavePositions(
      swellDirection,
      windDirection,
    );
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);

    const finalRating =
      (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;

    return Math.round(finalRating);
  }

  private isWindOffShore(
    wavePosition: GeoPosition,
    windPosition: GeoPosition,
  ): boolean {
    return (
      (wavePosition === GeoPosition.N &&
        windPosition === GeoPosition.S &&
        this.beach.position === GeoPosition.N) ||
      (wavePosition === GeoPosition.S &&
        windPosition === GeoPosition.N &&
        this.beach.position === GeoPosition.S) ||
      (wavePosition === GeoPosition.E &&
        windPosition === GeoPosition.W &&
        this.beach.position === GeoPosition.E) ||
      (wavePosition === GeoPosition.W &&
        windPosition === GeoPosition.E &&
        this.beach.position === GeoPosition.W)
    );
  }
}
