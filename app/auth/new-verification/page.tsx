"use client";

import { useSearchParams } from "next/navigation";



const NewVerification = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    return ( <>Bienvenue sur la page de vérification{token}</> );
}
 
export default NewVerification;