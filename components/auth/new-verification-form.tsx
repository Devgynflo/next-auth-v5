"use client";


import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from 'react-spinners';
// Actions
import { newVerification } from "@/actions/new-verification";
// Components
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";


export const NewVerificationForm = () => {
    const token = useSearchParams().get("token");
    const router = useRouter();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    
    const onSubmit = useCallback(async () => {
        if(success || error) return;

        if(!token) {
            setError("No token provided");
            setTimeout(() => {
            router.push("/auth/login")
            },2000)
            return;
        };

        newVerification(token).then((res) => {
            if(res.success) {
            setSuccess(res.message);
            setError(undefined);
            } else {
            setError(res.message);
            setSuccess(undefined)
            }
        }); 
        }, [token,error,success,router]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    

    
    return (
    <CardWrapper headerLabel="Confirming your verification" backButtonLabel="Back to login" backButtonHref="/auth/login">
        <div className="flex flex-col w-full items-center justify-center gap-y-2">
        {!error && !success && (<BeatLoader/>)}
        <div>
        {error && (< FormError message={error}/>)}
        {success && (<FormSuccess message={success}/>)}
        </div>
        
        
        </div>
    </CardWrapper>);
}