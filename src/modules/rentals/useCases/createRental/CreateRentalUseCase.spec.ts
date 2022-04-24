import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayJsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;

describe("Create rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayJsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("Should be able to create a new rental.", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car name",
      description: "Car description",
      daily_rate: 100,
      license_plate: "BVC-7788",
      fine_amount: 40,
      category_id: "9330",
      brand: "Car brand",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "4123",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("Should not be able to create a new rental if there is another open to the same user.", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "4123",
      car_id: "9001",
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "4123",
        car_id: "9330",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it("Should not be able to create a new rental if there is another open to the same car.", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "4123",
      car_id: "4120",
      expected_return_date: dayAdd24Hours,
    });

    expect(
      createRentalUseCase.execute({
        user_id: "3221",
        car_id: "4120",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car is unavailable!"));
  });

  it("Should not be able to create a new rental with invalid return time.", async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: "6532",
        car_id: "4120",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError("Invalid return time!"));
  });
});
