import { AppError } from "./../../../../errors/AppError";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { IUsersRepositories } from "../../repositories/IUsersRepository";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository") private userRepository: IUsersRepositories
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect!");
    }

    const checkIfPasswordsMatches = compare(user.password, password);

    if (!checkIfPasswordsMatches) {
      throw new AppError("Email or password incorrect!");
    }

    const token = sign({}, "a7e071b3de48cec1dd24de6cbe6c7bf1", {
      subject: user.id,
      expiresIn: "1d",
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
