// import { useUser } from "../lib/hooks";

const Profile = () => {
  // const user = useUser({ redirectTo: "/login" });

  return (
    <div>
      <h1>Profile</h1>
      {user && <p>Your session: {JSON.stringify(user)}</p>}
    </div>
  );
};

export default Profile;
