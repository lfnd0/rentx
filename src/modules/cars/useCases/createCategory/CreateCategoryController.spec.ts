import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("Create category controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, driver_license, "isAdmin", created_at)
      values('${id}', 'admin', 'admin@email.com.br', '${password}', '99029905039', true, 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new category.", async () => {
    const reponseToken = await request(app).post("/sessions").send({
      email: "admin@email.com.br",
      password: "admin",
    });

    const { token } = reponseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest name",
        description: "Category Supertest description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a new category with name exists.", async () => {
    const reponseToken = await request(app).post("/sessions").send({
      email: "admin@email.com.br",
      password: "admin",
    });

    const { token } = reponseToken.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest name",
        description: "Category Supertest description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
