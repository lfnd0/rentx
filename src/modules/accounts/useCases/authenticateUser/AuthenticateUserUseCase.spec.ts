import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UserTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokenRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokenRepositoryInMemory: UserTokensRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let dayJsDateProvider: DayjsDateProvider;

describe("Authenticate user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokenRepositoryInMemory = new UserTokensRepositoryInMemory();
    dayJsDateProvider = new DayjsDateProvider();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokenRepositoryInMemory,
      dayJsDateProvider
    );
  });

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      email: "robbie@email.com",
      driver_license: "09453112350",
      name: "Robbie",
      password: "yuiop",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("Should not be able to authenticate an nonexistent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "scotty@email.com",
        password: "lkjhg",
      })
    ).rejects.toEqual(new AppError("E-mail or password incorrect!"));
  });

  it("Should not be able to authenticate with incorrect password", async () => {
    const user: ICreateUserDTO = {
      email: "mary@email.com",
      driver_license: "69652182311",
      name: "Mary",
      password: "mnbvc",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: "mary@email.com",
        password: "vcxz",
      })
    ).rejects.toEqual(new AppError("E-mail or password incorrect!"));
  });
});
