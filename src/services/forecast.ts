import { ForecastPoint, StormGlass } from "@src/clients/stormGlass";
import logger from "@src/logger";
import _ from "lodash";
import { Beach } from "@src/models/beach";
import { InternalError } from "@src/util/errors/internal-errors";
import { Rating } from "./rating";

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
  constructor(
    protected stormGlass = new StormGlass(),
    protected RatingService: typeof Rating = Rating,
  ) {}

  public async processForecastForBeaches(
    beaches: Beach[],
  ): Promise<TimeForecast[]> {
    logger.info(`Preparing the forecast for ${beaches.length} beaches`);
    try {
      const beachForecast = await this.calculateRating(beaches);
      const timeForecast = this.mapForecastByTime(beachForecast);
      return timeForecast.map((t) => ({
        time: t.time,
        // TODO: Allow ordering to be dynamic
        // Sorts the beaches by its ratings
        forecast: _.orderBy(t.forecast, ["rating"], ["desc"]),
      }));
    } catch (error) {
      logger.error(error);
      throw new ForecastProcessingIternalError(error.message);
    }
  }

  private async calculateRating(beaches: Beach[]): Promise<BeachForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    logger.info(`Preparing the forecast for ${beaches.length} beaches`);
    for (const beach of beaches) {
      const rating = new this.RatingService(beach);
      // TODO someone to make this in parallel
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = this.enrichBeachData(points, beach, rating);
      pointsWithCorrectSources.push(...enrichedBeachData);
    }
    return pointsWithCorrectSources;
  }

  private enrichBeachData(
    points: ForecastPoint[],
    beach: Beach,
    rating: Rating,
  ): BeachForecast[] {
    return points.map((point) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getForPoint(point),
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
