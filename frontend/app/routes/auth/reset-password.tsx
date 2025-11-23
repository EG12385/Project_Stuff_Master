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
import { useResetPasswordMutation } from "@/hooks/use-auths";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBigDown, ArrowLeft, CheckCircle, Loader, Loader2, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import background from "../../components/images/block4.jpg"
import { resetPasswordSchema } from "@/lib/schema";


type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid token");
      return;
    }

    resetPassword(
      { ...values, token: token as string },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

useEffect( () => {document.body.style.backgroundImage =`url(${background})`})
  return <div
className="min-h-screen flex flex-col items-center justify-center bg-muted/40 ml-80 mr-80"
>
  <div className="w-full max-w-md space-y-6">
  
      
      <Card className="max-w-full w-md shadow-xl">
        
        {<CardHeader  className="text-center mb-5">
           <CardTitle className='text-2xl font-bold'>Reset Password</CardTitle>
                  <Link to="/sign-in" className="flex items-center mt-3">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to sign in</span>
                  </Link>

        </CardHeader>}

        <CardContent className="space-y-6">
        
            {isSuccess ? (
               <div className="flex flex-col items-center justify-center py-2 ">
                <CheckCircle className="w-15 h-15 text-green-500 mb-8" />
                <h1 className="text-lg font-bold">Password reset successful</h1>
          
             </div>
            ) :  (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <CardTitle className="text-sm text-gray-800 mb-4">
                         Enter your new password below
                        </CardTitle>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input  {...field} type="password" placeholder="********" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" placeholder="********" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Reset Password"
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

export default ResetPassword;