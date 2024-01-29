"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
//import { currentUserRole } from "@/lib/auth";

const AdminPage = () => {

    const onClickOnServerAction = () => {
        admin().then((res) => {
            if(res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        })
    };

    const onClickOnApiRoute = () => {
        fetch("/api/admin").then((res) => {
            if(res.ok) {
                toast.success("Admin API route succeeded");
            } else {
                toast.error("Admin API route failed");
            }
        } )
    };
    
    
    return (  <Card className="w-[600px]">
        <CardHeader>
            <p className="text-2xl font-semibold text-center">🔑 Admin</p>
        </CardHeader>
        <CardContent className="space-y-4">
            <RoleGate allowedRoles={UserRole.ADMIN}> 
                <FormSuccess message="You are an admin" />
            </RoleGate>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
                <p className="text-sm font-medium">
                    ADMIN-ONLY API routes
                </p>
                <Button onClick={onClickOnApiRoute}>Click to test</Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
                <p className="text-sm font-medium">
                    ADMIN-ONLY Server Actions
                </p>
                <Button onClick={onClickOnServerAction}>Click to test</Button>
            </div>
        </CardContent>
    </Card>);
}
 
export default AdminPage;