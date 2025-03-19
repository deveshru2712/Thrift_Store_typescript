import { RequestHandler } from "express";
import { z } from "zod";

interface AuthSchema {
  username?: string;
  email: string;
  password: string;
}

const authValidate = (schema: z.ZodSchema<AuthSchema>): RequestHandler => {
  return async (req, res, next) => {
    try {
      const parsedBody = await schema.parseAsync(req.body);
      req.body = parsedBody;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authValidate;
