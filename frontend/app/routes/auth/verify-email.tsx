import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CheckCircle, Loader, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useVerifyEmailMutation } from '@/hooks/use-auths';
import background from "../../components/images/block4.jpg"

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending: isVerifying} = useVerifyEmailMutation();
  useEffect( () => {document.body.style.backgroundImage =`url(${background})`})
  useEffect(() => {
    if (token) {
      mutate(
        { token },
        {
          onSuccess: () => {
            setIsSuccess(true);
          },
          onError: (error: any) => {
            const errorMessage =
              error.response?.data?.message || "An error occurred";
            setIsSuccess(false);
            console.log(error);

            toast.error(errorMessage);
          },
        }
      );
    }
  }, [searchParams]);

  return <div
className="min-h-screen flex flex-col items-center justify-center bg-muted/40 ml-80 mr-80"
>
  
      
      <Card className="max-w-full w-md shadow-xl">
        
        {<CardHeader  className="text-center mb-5">
           <CardTitle className='text-2xl font-bold'>Verifying  Email</CardTitle>
          <CardTitle className="text-sm text-gray-500">
               Please wait while we verify your email...
          </CardTitle>
        </CardHeader>}

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-2 ">
            {isVerifying ? (
              <>
                <Loader className="w-10 h-10 text-gray-500 animate-spin" />
                <h3 className="text-lg font-semibold">Verifying email...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify your email.
                </p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-15 h-15 text-green-500 mb-8" />
                <h3 className="text-lg font-semibold">Email Verified</h3>
                <p className="text-sm text-gray-500">
                  Email verified successfully.
                </p>

              </>
            ) : (
              <>
                <XCircle className="w-15 h-15 text-red-500 mb-8" />
                <h3 className="text-lg font-semibold">
                  Email Verification Failed
                </h3>
                <p className="text-sm text-gray-500">
                  Your email verification failed. Please try again.
                </p>

                <Link to="/sign-in" className="flex items-center gap-2 text-sm" >
                           <Button type="submit" className="w-full mt-5" >
                            Back to Sign In
                           </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>

};

export default VerifyEmail;