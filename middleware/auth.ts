import verifyUserToken from './verifyUserToken';
export default async (req: any, res: any, next: any) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        req.tokenData = await verifyUserToken(token);
        next();
    } catch (err) {
        next(err);
    }
}
