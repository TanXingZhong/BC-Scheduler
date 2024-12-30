import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";

import { useUserInfo } from "../../hooks/useUserInfo";
import {
  toSGTimeShort,
  toSGDate,
  timePrettier,
} from "../../../config/convertTimeToSGT";

export default function Schedule() {
  const { name, email, role_id, admin, userShifts } = useUserInfo();
  console.log(userShifts);
  const items = userShifts
    .map((x) => ({
      id: x.schedule_id,
      location: x.outlet_name,
      date: toSGDate(x.start_time),
      start: toSGTimeShort(x.start_time),
      end: toSGTimeShort(x.end_time),
      startDateTime: new Date(x.start_time),
      endDateTime: new Date(x.end_time),
    }))
    .sort((a, b) => a.startDateTime - b.startDateTime) // Sort by start date
    .filter((item) => item.endDateTime > new Date()); // Filter items after the current time

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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    Location: {item.location}
                  </Typography>
                  <br />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    Time: {timePrettier(item.start, item.end)}
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
