"use client";

import { useSearchParams } from "next/navigation";

const NewPasswordPage = () => {
    const token = useSearchParams().get('token');

    return ( <>{token}</> );
}
 
export default NewPasswordPage;