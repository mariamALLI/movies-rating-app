import { z} from "zod";

export const signInSchema = z.object({
    email: z.email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})


export const signUpBaseSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
})

export const signUpSchema = signUpBaseSchema.refine((data) => data.password === data.confirmPassword, {
   path: ['confirmPassword'],
   message: 'Passwords do not match', 
})

export const signUpApiSchema = signUpBaseSchema.pick({
    name: true,
    email: true,
    password: true,
})


export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignUpApiInput = z.infer<typeof signUpApiSchema>;