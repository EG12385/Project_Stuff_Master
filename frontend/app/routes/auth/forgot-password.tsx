import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation, useResetPasswordMutation } from "@/hooks/use-auths";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigDown, ArrowLeft, CheckCircle, Loader, Loader2, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import background from "../../components/images/block4.jpg"
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/schema";


type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
   const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
     email:"",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message;
        console.log(error);
        toast.error(errorMessage);
      },
    });
  };

useEffect( () => {document.body.style.backgroundImage =`url(${background})`})
  return <div
className="min-h-screen flex flex-col items-center justify-center bg-muted/40 ml-80 mr-80"
>
  <div className="w-full max-w-md space-y-6">
  
      
      <Card className="max-w-full w-md shadow-xl">
        
        {<CardHeader  className="text-center mb-5">
           <CardTitle className='text-2xl font-bold'>Forgot Password</CardTitle>
                  <Link to="/sign-in" className="flex items-center mt-3">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to sign in</span>
                  </Link>

        </CardHeader>}

        <CardContent className="space-y-6">
        
            {isSuccess ? (
               <div className="flex flex-col items-center justify-center py-2 ">
                <CheckCircle className="w-15 h-15 text-green-500 mb-8" />
                <h1 className="text-lg font-bold">Password reset email sent</h1>
                <p className="text-muted-foreground">
                  Check your email for a link to reset your password
                </p>
          
             </div>
            ) :  (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    name="email"
                    control={form.control}
                      render={({ field }) => (
                        <FormItem>
                                    <CardTitle className="text-sm text-gray-800 mb-4">
                                     Enter your email to recieve a password reset link
                                    </CardTitle>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                  />


                  <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send Password Reset Mail"
                    )}
                  </Button>
                </form>
              </Form>
              
            )}
          </CardContent>
        </Card>
      </div>
    </div>
};


export default ForgotPassword;