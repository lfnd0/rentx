import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe("List cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it("Should be able to list all available cars.", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car 1",
      description: "Car description 1",
      daily_rate: 100,
      license_plate: "HJG-4412",
      fine_amount: 50,
      brand: "Car brand 1",
      category_id: "aa513028-a5a9-4fc2-93ef-ddb04fa26f62",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by name.", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car 2",
      description: "Car description 2",
      daily_rate: 100,
      license_plate: "BVC-7788",
      fine_amount: 50,
      brand: "Car brand 2",
      category_id: "aa513028-a5a9-4fc2-93ef-ddb04fa26f62",
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car 2",
    });

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by brand.", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car 3",
      description: "Car description 3",
      daily_rate: 100,
      license_plate: "AEF-4361",
      fine_amount: 50,
      brand: "Car brand 3",
      category_id: "aa513028-a5a9-4fc2-93ef-ddb04fa26f62",
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Car brand 3",
    });

    expect(cars).toEqual([car]);
  });

  it("Should be able to list all available cars by category.", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car 3",
      description: "Car description 3",
      daily_rate: 100,
      license_plate: "AEF-4361",
      fine_amount: 50,
      brand: "Car brand 3",
      category_id: "aa513028-a5a9-4fc2-93ef-ddb04fa26f62",
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "aa513028-a5a9-4fc2-93ef-ddb04fa26f62",
    });

    expect(cars).toEqual([car]);
  });
});
