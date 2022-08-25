const { JWT_SECRET_KEY } = process.env;
import jsonwebtoken from "jsonwebtoken";
import { NotAuthenticatedError } from "./errors";
export default async (userToken: string) => {
    try {
        if(!userToken) throw new NotAuthenticatedError('No token provided')
        if(!JWT_SECRET_KEY) throw new Error('JWT_SECRET_KEY is not defined')
        let data = jsonwebtoken.verify(userToken, JWT_SECRET_KEY);
        return data;
    } catch (err) {
        throw new NotAuthenticatedError("A token is required for authentication")
    }
}