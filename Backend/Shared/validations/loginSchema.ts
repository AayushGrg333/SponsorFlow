import {z} from 'zod';
import {passwordValidation} from './signupSchema'

export const loginSchema = z.object({
     identifier : z.string() .min(3).max(50),
     password : passwordValidation,
     usertype : z.enum(["influencer","company"])
})