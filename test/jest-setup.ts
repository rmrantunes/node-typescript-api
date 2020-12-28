// Responsável por inicializar o servidor para todos os testes funcionais
import { SetupServer } from "@src/server";
import supertest from "supertest";

// vai rodar antes de todos os testes da aplicação
let server: SetupServer;
beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => await server.close());
