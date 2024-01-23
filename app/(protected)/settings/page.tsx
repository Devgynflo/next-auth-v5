import { signOut, auth } from "@/auth";

const SettingsPage = async () => {
  const session = await auth();

  return (
    <div>
      <div>{JSON.stringify(session)}</div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button>Sign out</button>
      </form>
    </div>
  );
};

export default SettingsPage;
