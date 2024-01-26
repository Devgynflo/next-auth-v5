"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
// Schemas
import { NewPasswordSchema } from "@/schemas";
// Actions
import { newPassword } from "@/actions/new-password";
// Components
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


export const NewPasswordForm = () => {
  const token = useSearchParams().get('token')
  
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  

  /* Soumission du formulaire */
  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token).then((response) => {
        if(response) {
          if (!response.success) {
          setError(response.message);
          setSuccess("");
        } else {
          setError("");
          setSuccess(response.message);
        }
      }
    }); 
  });
};

  return (
    <CardWrapper
      headerLabel="Enter your new password ?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Gestion des erreurs */}
          {error && (<FormError message={error}/>)}
          {/* Gestion du succès du submit */}
          {success && <FormSuccess message={success} />}

          <Button disabled={isPending} className="w-full">
            Reset your password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
