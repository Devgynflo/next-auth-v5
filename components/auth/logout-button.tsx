"use client";

import { logout } from "@/actions/logout";


interface LogoutButtonProps {
    children?: React.ReactNode
}

export const LogoutButton = ({children} : LogoutButtonProps) => {
    const handleClick = () => {
        logout();
    }

    return (<span className="cursor-pointer" onClick={handleClick}>{children}</span>)
}