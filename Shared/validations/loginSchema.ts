import {z} from 'zod';
import {usernameValidation,passwordValidation, companyNameValidation} from './signupSchema'

const emailSchema = z.object({
     email : z.string().email({message: "Invalid email format"})
})

const usernameSchema = z.object({
     username : usernameValidation
})
const influencerIdentifierSchema = z.union([usernameSchema,emailSchema])

export const influencerLoginSchema = z.object({
     identifier : influencerIdentifierSchema,
     password : passwordValidation,
     usertype : z.enum(["influencer","company"])
})

export const companyNameSchema = z.object({
     companyName : companyNameValidation
})

const CompanyidentifierSchema = z.union([companyNameSchema,emailSchema])

export const CompanyLoginSchema = z.object({
     identifier : CompanyidentifierSchema,
     password : passwordValidation,
     usertype : z.enum(["influencer","company"])
})