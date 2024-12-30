import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import { Link } from "react-router-dom";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, path: "/" },
  { text: "Calendar", icon: <PeopleRoundedIcon />, path: "/calendar" },
  {
    text: "Edit Schedule",
    icon: <PeopleRoundedIcon />,
    path: "/edit-schedule",
  },
  { text: "Leaves", icon: <PeopleRoundedIcon />, path: "/leaves" },
  { text: "Users", icon: <AnalyticsRoundedIcon />, path: "/users" },
  { text: "Create Account", icon: <PeopleRoundedIcon />, path: "/signup" },
  { text: "Roles", icon: <PeopleRoundedIcon />, path: "/roles" },
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
