"use client";

import { FormError } from "@/components/form-error";
import { useCurrentUserRole } from "@/hooks/use-current-user-role";
import { UserRole } from "@prisma/client";

export const revalidate = 0;

interface RoleGateProps {
    children: React.ReactNode;
    allowedRoles: UserRole;
}

export const RoleGate = ({children, allowedRoles}:RoleGateProps) => {
    const role = useCurrentUserRole();

    if(allowedRoles !== role) return <FormError message="You don&apos;t have permission to see this component" />

    return (
        <>{children}</>
    )

}