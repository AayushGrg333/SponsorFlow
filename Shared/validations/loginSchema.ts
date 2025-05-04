import {z} from 'zod';
import {usernameValidation,passwordValidation} from './signupSchema'

const emailSchema = z.object({
     email : z.string().email({message: "Invalid email format"})
})

const usernameSchema = z.object({
     username : usernameValidation
})
const identifierSchema = z.union([usernameSchema,emailSchema])

export const influencerLoginSchema = z.object({
     identifier : identifierSchema,
     password : passwordValidation,
     usertype : z.enum(["influencer","company"])
})