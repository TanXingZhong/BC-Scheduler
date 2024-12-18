import { useState } from "react";
import { useUpdateUser } from "../hooks/useUpdateUser";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState("");

  const { updateUser, error, isLoading } = useUpdateUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateUser(username, password, roles, true);
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Update User</h3>

      <label>Username:</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <label>Role:</label>
      <input
        type="text"
        onChange={(e) => setRoles(e.target.value)}
        value={roles}
      />

      <button disabled={isLoading}>Submit</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Admin;
