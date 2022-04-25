import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";

interface IUsersTokensRepository {
  create({
    user_id,
    expire_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens>;
}

export { IUsersTokensRepository };
