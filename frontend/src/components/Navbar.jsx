import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  const handleClickDashBoard = () => {
    console.log("dashboard");
  };

  const handleClickSchedule = () => {
    console.log("schedule");
  };

  const handleClickReport = () => {
    console.log("report");
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>BURNT CONE</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <button onClick={handleClickDashBoard}>Dashboard</button>
              <button onClick={handleClickSchedule}>Schedule</button>
              <button onClick={handleClickReport}>Report</button>
              <span>{user.email}</span>
              <Link to="/signup">Create new account</Link>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
