import PropTypes from "prop-types";
import Badge, { badgeClasses } from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogout } from "../hooks/useLogout";

function LogoutButton({ showBadge = false, ...props }) {
  const { logout } = useLogout();

  const handleClick = () => {
    logout();
  };

  return (
    <Badge
      onClick={handleClick}
      color="error"
      variant="dot"
      invisible={!showBadge}
      sx={{ [`& .${badgeClasses.badge}`]: { right: 2, top: 2 } }}
    >
      <IconButton size="small" {...props}>
        <LogoutIcon />
      </IconButton>
    </Badge>
  );
}

LogoutButton.propTypes = {
  showBadge: PropTypes.bool,
};

export default LogoutButton;
