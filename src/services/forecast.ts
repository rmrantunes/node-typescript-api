import { ForecastPoint, StormGlass } from "@src/clients/stormGlass";
import logger from "@src/logger";
import { Beach } from "@src/models/beach";
import { InternalError } from "@src/util/errors/internal-errors";

export interface BeachForecast extends Omit<Beach, "user">, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingIternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[],
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    logger.info(`Preparing the forecas for ${beaches.length} beaches`);
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichBeachData(points, beach);
        pointsWithCorrectSources.push(...enrichedBeachData);
      }
      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error) {
      logger.error(error);
      throw new ForecastProcessingIternalError(error.message);
    }
  }

  private enrichBeachData(
    points: ForecastPoint[],
    beach: Beach,
  ): BeachForecast[] {
    return points.map((point) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find(
        (forecast) => forecast.time === point.time,
      );
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({ time: point.time, forecast: [point] });
      }
    }
    return forecastByTime;
  }
}
