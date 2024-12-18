import { useState } from "react";
import { useDeleteUser } from "../hooks/useDeleteUser";

const Delete = () => {
  const [username, setUsername] = useState("");

  const { deleteUser, error, isLoading } = useDeleteUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await deleteUser(username);
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Delete</h3>

      <label>Username:</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />

      <button disabled={isLoading}>Submit</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Delete;
