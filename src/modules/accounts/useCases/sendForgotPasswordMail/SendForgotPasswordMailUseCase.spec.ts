import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UserTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokenRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokenRepositoryInMemory: UserTokensRepositoryInMemory;
let dayJsDateProvider: DayjsDateProvider;
let mailProviderInMemory: MailProviderInMemory;

describe("Send forgot mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokenRepositoryInMemory = new UserTokensRepositoryInMemory();
    dayJsDateProvider = new DayjsDateProvider();
    mailProviderInMemory = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokenRepositoryInMemory,
      dayJsDateProvider,
      mailProviderInMemory
    );
  });

  it("Should be able to send a forgot password mail to user.", async () => {
    const sendMail = jest.spyOn(mailProviderInMemory, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "916811",
      email: "puufahak@jocvez.bn",
      name: "Henrietta Curry",
      password: "8280",
    });

    await sendForgotPasswordMailUseCase.execute("puufahak@jocvez.bn");

    expect(sendMail).toHaveBeenCalled();
  });

  it("Should not ne able to send an email if user does not exists.", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("elava@abe.gu")
    ).rejects.toEqual(new AppError("User does not exists!"));
  });

  it("Should be able to create an user token.", async () => {
    const generateTokenMail = jest.spyOn(
      usersTokenRepositoryInMemory,
      "create"
    );

    usersRepositoryInMemory.create({
      driver_license: "743928",
      email: "winnur@ucvazor.ml",
      name: "Kathryn Harmon",
      password: "7588",
    });

    await sendForgotPasswordMailUseCase.execute("winnur@ucvazor.ml");

    expect(generateTokenMail).toBeCalled();
  });
});
