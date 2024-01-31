"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';


import { settings } from "@/actions/settings";
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCurrentUser } from '@/hooks/use-current-user';
import { SettingsSchema } from '@/schemas';
import { UserRole } from '@prisma/client';





const SettingsPage =  () => {
  const [error,setError] = useState<string | undefined>();
  const [success,setSuccess] = useState<string | undefined>();
  const currentUser = useCurrentUser();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver:zodResolver(SettingsSchema),
    defaultValues: {
      name: currentUser?.name || undefined,
      email: currentUser?.email || undefined,
      isTwoFactorEnabled: currentUser?.isTwoFactorEnabled || undefined,
      role: currentUser?.role || undefined,
      password: "",
      newPassword: "", 
    }
  });

  const [isPending, startTransition] = useTransition();
  const { update } = useSession();

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {


    startTransition(() => {
      settings(values).then((res) => {
        if (res.success) {
          setSuccess(res.message);
          update();
        } else {
          setError(res.message);
        }
      }).catch((_err) => setError("Something went wrong!"));
    })
  }

  return (
    <Card className="w-[600px]">
      <CardHeader className="text-2xl font-semibold text-center">❖ Settings</CardHeader>
      <CardContent>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
{/* Name field */}
            <div className="space-y-4">
              <FormField control={form.control} name='name' render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" disabled={isPending}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
              {!currentUser?.isOAuth && (<>
{/* Email Field */}
              <FormField control={form.control} name='email' render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="example@gmail.com" type='email' disabled={isPending}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>

{/* Password Field */}
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
                            value={field.value || ""}
                            
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
{/* New password Field */}
              <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="******"
                            type="password"
                            disabled={isPending}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </>)}

{/* Role Field */}
              <FormField control={form.control} name='role'  render={({field}) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role"/>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.USER}>User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>

                </FormItem>
              )}/>
              {!currentUser?.isOAuth && (<>
              {/* Switch Field two Authentication */}
              <FormField control={form.control} name='isTwoFactorEnabled'  render={({field}) => (
                <FormItem className='flex flex-row items-center justify-between rounde-lg border p-3 shadow-sm'>
                  <div className="space-y-0.5">
                    <FormLabel>Two Factor</FormLabel>
                    <FormDescription>Enable two factor authentication for your account</FormDescription>
                  </div>
                  <FormControl>
                    <Switch  disabled={isPending} checked={field.value} onCheckedChange={field.onChange}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
              </>)}

            </div>


            <FormSuccess message={success}/>
            <FormError message={error}/>
            <Button type='submit' disabled={isPending}>Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
