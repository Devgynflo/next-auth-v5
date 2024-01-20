"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Backbuttonprops {
  label: string;
  href: string;
}

export const BackButton = ({ label, href }: Backbuttonprops) => {
  return (
    <Button
      variant={"link"}
      className="font-normal w-full "
      size={"sm"}
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
