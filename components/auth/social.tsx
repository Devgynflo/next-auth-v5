"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");


  const onClick = (providers: "google" | "github") => {
    signIn(providers,  {callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT} );
  };
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        variant={"outline"}
        size={"lg"}
        className="w-full"
        onClick={() => {
          onClick("google");
        }}
      >
        <FcGoogle size={20} />
      </Button>
      <Button
        variant={"outline"}
        size={"lg"}
        className="w-full"
        onClick={() => {
          onClick("github");
        }}
      >
        <FaGithub size={20} />
      </Button>
    </div>
  );
};
