import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import "@shared/container";

import { AppError } from "@shared/errors/AppError";
import { router } from "@shared/infra/http/routes";

import swaggerFile from "../../../swagger.json";
import createConnection from "../typeorm";

const app = express();

createConnection();

app.use(express.json());

app.use(router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error: ${error.message}`,
    });
  }
);

export { app };
