import { signUpSchema } from '@/lib/schema';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver} from '@hookform/resolvers/zod';
import { 
  Card, 
  CardContent,  
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import background from '@/components/images/block4.jpg';
//import sky from '@/components/images/sky.png';
import { 
  Form, 
  FormControl,  
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
//import {useLoginMutation } from "@hooks/use-auth";
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
//import { Loader2 } from 'lucide-react';
import { useSignUpMutation } from '@/hooks/use-auths';
import { toast } from 'sonner';

export type SignupFormData = z.infer<typeof signUpSchema>


const SignUp = () => {
const navigate = useNavigate();
const form = useForm<SignupFormData>({
  resolver: zodResolver(signUpSchema),
  defaultValues: {
    name:"",
    email: "",
    password: "",
    confirmPassword:"",

  },
});

const {mutate, isPending} = useSignUpMutation();

useEffect( () => {document.body.style.backgroundImage =`url(${background})`})

const handleOnSubmit = (values: SignupFormData) => {
  mutate(values, {
    onSuccess: () => {
      toast.success("Email Verification Required", {
        description: 
        "Please check your email for a verification link. If you don't see it, please check your spam folder"
      });
      form.reset();
      navigate("./sign-in");
    },
        onError: (error: any) => {
        const errorMessage =
        error.response?.data?.message || "An error occurred";
        console.log(error);
        toast.error(errorMessage);
    },
  });
};

return<div
className="min-h-screen flex flex-col items-center justify-center bg-muted/40 ml-80 mr-80"
>
 
  <Card className="max-w-full w-md shadow-xl">
    <CardHeader  className="text-center mb-5">
      <CardTitle className='text-2xl font-bold'>Create Your Account</CardTitle>
      <CardTitle className="text-sm">
      Complete all the required fields
      </CardTitle>
    {/*<CardDescription className="text-sm text-muted-foreground">Sign into your account to continue</CardDescription>*/}
    </CardHeader>
    <CardContent>
      <Form {...form}>
        <form 
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Valid Email</FormLabel>
                <FormControl>            
                  <Input 
                  type="email" 
                  placeholder='example@email.com' 
                  {...field} 
                  />         
                </FormControl>
                <FormMessage/>
              </FormItem>
              
            )}
           />
            <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <div className="flex items-center justify-between">
                <FormLabel>Provide Secure Password</FormLabel>

                </div>
                <FormControl>
                  <Input 
                  type="password" 
                  placeholder='*********' 
                  {...field} 
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>             
            )}
           />
                     <FormField
            control={form.control}
            name="confirmPassword"
            render={({field}) => (
              <FormItem>
                <div className="flex items-center justify-between">
                <FormLabel>Confirm Your Password</FormLabel>

                </div>
                <FormControl>
                  <Input 
                  type="password" 
                  placeholder='*********' 
                  {...field} 
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>             
            )}
           />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing up..." : "Sign up"}
              </Button>
          
        </form>

      </Form>
      <CardFooter className="flex items-center justify-center mt-6">
      <div className="flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account? <Link to="/sign-in" className="text-blue-600">Sign In</Link>
              </p>
            </div>
      </CardFooter>
    </CardContent>

  </Card>
</div> 

}

export default SignUp;