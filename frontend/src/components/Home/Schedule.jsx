import { useState, useEffect, Fragment } from "react";
import {
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  Card,
} from "@mui/material";
import { useGetSingleUserInfo } from "../../hooks/useGetSingleUserInfo";
import { useUserInfo } from "../../hooks/useUserInfo";
import {
  toSGTimeShort,
  toSGDate,
  timePrettier,
} from "../../../config/convertTimeToSGT";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

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
        maxHeight: 700, // Adjusted to fit approximately 10 items
        overflowY: "auto", // Enable vertical scrolling
      }}
    >
      {items.length > 0 ? (
        items.map((item, index) => (
          <Fragment key={item.id}>
            <Card
              sx={{
                marginBottom: 2, // Add margin between items
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center", // Align items vertically in the center
                    gap: 1, // Add some space between the icon and text
                  }}
                >
                  <CalendarMonthIcon />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {new Date(
                      item.date.split("/").reverse().join("-")
                    ).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center", // Align items vertically in the center
                    gap: 1, // Add some space between the icon and text
                  }}
                >
                  <LocationOnIcon />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    {item.location}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center", // Align items vertically in the center
                    gap: 1, // Add some space between the icon and text
                  }}
                >
                  <AccessAlarmIcon />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    {timePrettier(item.start, item.end)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            {index < items.length - 1 && <Divider variant="inset" />}
          </Fragment>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          You have no shifts
        </Typography>
      )}
    </Box>
  );
}
