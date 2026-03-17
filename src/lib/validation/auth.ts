import { z} from "zod";

const strongPassword = z
.string()
.min(6, "Password must be at least 6 characters")
.max(100, "Password must be less than 100 characters")
.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
.regex(/[a-z]/, "Password must contain at least one lowercase letter")
.regex(/[0-9]/, "Password must contain at least one number")
.regex(/[^A-Za-z0-9]/, "Add at least one special character")
.refine((v) => !/\s/.test(v), "Password must not contain spaces");

export const signInSchema = z.object({
    email: z.email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})


export const signUpBaseSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.email('Enter a valid email'),
    password: strongPassword,
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