import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("Should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Name car",
      description: "Description car",
      daily_rate: 100,
      license_plate: "FGH-0987",
      fine_amount: 60,
      brand: "Brand car",
      category_id: "Category car",
    });

    expect(car).toHaveProperty("id");
  });

  it("Should not be able to create a car with exists license plate", () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: "Name car 1",
        description: "Description car 1",
        daily_rate: 80,
        license_plate: "FGH-0987",
        fine_amount: 40,
        brand: "Brand car 1",
        category_id: "Category car 1",
      });

      await createCarUseCase.execute({
        name: "Name car 2",
        description: "Description car 2",
        daily_rate: 80,
        license_plate: "FGH-0987",
        fine_amount: 40,
        brand: "Brand car 2",
        category_id: "Category car 2",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to create a car with available true by default", async () => {
    const car = await createCarUseCase.execute({
      name: "Car available",
      description: "Description car available",
      daily_rate: 60,
      license_plate: "CVB-9876",
      fine_amount: 20,
      brand: "Brand car available",
      category_id: "Category car available",
    });

    expect(car.available).toBe(true);
  });
});
