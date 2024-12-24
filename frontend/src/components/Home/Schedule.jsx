import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Schedule() {
  const items = [
    {
      id: 1,
      location: "NUS",
      date: "10-03-2024",
      start: "2:00pm",
      end: "3:00pm",
    },
    {
      id: 2,
      location: "Macdonads",
      date: "10-03-2024",
      start: "2:00pm",
      end: "3:00pm",
    },
    {
      id: 3,
      location: "Toiletbowl",
      date: "10-03-2024",
      start: "2:00pm",
      end: "3:00pm",
    },
  ];

  return (
    <List>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <ListItem
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: "#f0f0f0" },
              marginBottom: 2, // Add margin between items
            }}
          >
          <ListItemText
            primary={
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {item.date}
              </Typography>
            }
            secondary={
              <>
                <Typography variant="body2" color="text.secondary" component="span">
                  Location: {item.location}
                </Typography><br/>
                <Typography variant="body2" color="text.secondary" component="span">
                  Time: {item.start} - {item.end}
                </Typography>
              </>
            }
          />
          </ListItem>
          {index < items.length - 1 && <Divider variant="inset" />}
        </React.Fragment>
      ))}
    </List>
  );
}
