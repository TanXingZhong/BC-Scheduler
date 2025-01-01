import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PasswordIcon from "@mui/icons-material/Password";

import { Link } from "react-router-dom";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, path: "/" },
  { text: "Calendar", icon: <CalendarMonthIcon />, path: "/calendar" },
  {
    text: "Edit Schedule",
    icon: <EditCalendarIcon />,
    path: "/edit-schedule",
  },
  { text: "Leaves", icon: <FreeBreakfastIcon />, path: "/leaves" },
  { text: "Users", icon: <PeopleRoundedIcon />, path: "/users" },
  { text: "Create Account", icon: <PersonAddIcon />, path: "/signup" },
  { text: "Roles", icon: <AccessibilityIcon />, path: "/roles" },
  { text: "Change Password", icon: <PasswordIcon />, path: "/change-password" },

];

export default function MenuContent() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              href={item.path}
              to={item.path}
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
