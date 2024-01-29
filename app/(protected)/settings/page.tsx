"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";


const SettingsPage =  () => {
  
  const user = useCurrentUser();
  function handleLogout() {
    logout();
  }

  return (
    <div className="bg-white p-10 rounded-xl">
     <button onClick={handleLogout}>Sign out</button>
    </div>
  );
};

export default SettingsPage;
