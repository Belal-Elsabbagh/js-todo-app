declare namespace User {
   /**
    * User token data
    */
   export interface UserTokenData {
       id: string;
       email: string;
       role: string;
   }
}

declare namespace Express {
    export interface Request {
       tokenData?: User.UserTokenData;
    }
 }