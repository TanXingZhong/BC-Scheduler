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
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, path: "/" },
  { text: "Calendar", icon: <PeopleRoundedIcon />, path: "/calendar" },
  {
    text: "Edit Schedule",
    icon: <PeopleRoundedIcon />,
    path: "/edit-schedule",
  },
  { text: "Users", icon: <AnalyticsRoundedIcon />, path: "/users" },
  { text: "Create Account", icon: <PeopleRoundedIcon />, path: "/signup" },
  { text: "Admin", icon: <PeopleRoundedIcon />, path: "/admin" },
];

const secondaryListItems = [
  //empty for now
];

export default function MenuContent() {
  const [selectedIndex, setSelectedIndex] = useState(0); // State to track the selected item

  const handleListItemClick = (index) => {
    setSelectedIndex(index); // Update the selected item index
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={item.path ? Link : "div"}
              to={item.path || undefined}
              selected={selectedIndex === index} // Highlight the selected item
              onClick={() => handleListItemClick(index)} // Handle click to set selected
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
