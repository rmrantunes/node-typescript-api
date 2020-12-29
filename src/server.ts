import "./util/module-alias";
import { Server } from "@overnightjs/core";
import bodyParser from "body-parser";
import { Application } from "express";
import { ForecastController } from "./controllers/forecast";
import * as database from "@src/database";
import { BeachesController } from "./controllers/beaches";

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    this.addControllers([forecastController, beachesController]);
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info(`Server listening on port ${this.port}`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}
