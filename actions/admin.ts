"use server";

import { currentUserRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const role = await currentUserRole();

  if (role !== UserRole.ADMIN) {
    return {
      success: false,
      message: "You are not authorized to access this API route.",
    };
  } else {
    return {
      success: true,
      message: "You are authorized to access this API route.",
    };
  }
};
