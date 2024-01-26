"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
// Schema
import { LoginSchema } from "@/schemas";
// Action 
import { login } from "@/actions/login";
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


export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ?  "You already have an account with this email." : "";
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  

  /* Soumission du formulaire */
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((response) => {
        if(response) {
          if (!response.success) {
          setError(response.message);
          setSuccess("");
        } else {
          // TODO Add when we add 2FA 3:46
          setError("");
          setSuccess(response.message);
        }
        }
        
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@example.email.com"
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                    <Button size={"sm"} variant={"link"} asChild className="px-0 font-normal"><Link href={"/auth/reset"}>Forgot password ?</Link></Button>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Gestion des erreurs */}
          {error || urlError ? <FormError message={error || urlError} /> : null}
          {/* Gestion du succès du submit */}
          {success && <FormSuccess message={success} />}

          <Button disabled={isPending} className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
