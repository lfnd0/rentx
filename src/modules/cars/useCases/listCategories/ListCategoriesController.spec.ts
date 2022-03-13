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
      `INSERT INTO USERS(id, name, email, password, driver_license, "isAdmin", created_at) values('${id}', 'admin', 'admin@email.com.br', '${password}', '99029905039', true, 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to list all categories.", async () => {
    const reponseToken = await request(app).post("/sessions").send({
      email: "admin@email.com.br",
      password: "admin",
    });

    const { token } = reponseToken.body;

    await request(app)
      .post("/categories")
      .send({
        name: "Category Supertest name",
        description: "Category Supertest description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toEqual("Category Supertest name");
  });
});
