import { useState, useEffect, Fragment } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useGetSingleUserInfo } from "../../hooks/useGetSingleUserInfo";
import { useUserInfo } from "../../hooks/useUserInfo";
import {
  toSGTimeShort,
  toSGDate,
  timePrettier,
} from "../../../config/convertTimeToSGT";

export default function Schedule() {
  const { getUserById, isLoading, error } = useGetSingleUserInfo();
  const [userShifts, setUserShifts] = useState([]);
  const { user_id } = useUserInfo();
  const onLoad = async () => {
    const data = await getUserById(user_id);
    if (data) setUserShifts(data.userShifts);
  };

  useEffect(() => {
    onLoad();
  }, []);

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
    <Box
      sx={{
        maxHeight: 500, // Adjusted to fit approximately 10 items
        overflowY: "auto", // Enable vertical scrolling
      }}
    >
      <List>
        {items.length > 0 ? (
          items.map((item, index) => (
            <Fragment key={item.id}>
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
            </Fragment>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            You have no shifts
          </Typography>
        )}
      </List>
    </Box>
  );
}
