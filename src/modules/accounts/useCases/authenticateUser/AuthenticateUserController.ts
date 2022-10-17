import { container } from "tsyringe";
import { Request, Response } from "express";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

class AuthenticateUserControler {
  async handle(req: Request, res: Response): Promise<Response> {
    const { password, email } = req.body;
    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);
    const token = await authenticateUserUseCase.execute({
      password,
      email,
    });

    return res.json(token);
  }
}

export { AuthenticateUserControler };
