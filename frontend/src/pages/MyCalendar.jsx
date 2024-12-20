import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from "@mui/material/Box";
const localizer = momentLocalizer(moment);

const calendarEvents = [
  {
    title: "Math",
    allDay: false,
    start: new Date("2024-12-20T17:00:21.817Z"),
    end: new Date("2024-12-20T23:00:21.817Z"),
  },
  {
    title: "Math2",
    allDay: false,
    start: new Date("2024-12-20T23:00:21.817Z"),
    end: new Date("2024-12-21T04:00:21.817Z"),
  },
  {
    title: "Math22",
    allDay: false,
    start: new Date("2024-12-20T23:00:21.817Z"),
    end: new Date("2024-12-21T04:00:21.817Z"),
  },
  {
    title: "Math2",
    allDay: false,
    start: new Date("2024-12-20T23:00:21.817Z"),
    end: new Date("2024-12-21T04:00:21.817Z"),
  },
  {
    title: "Math2",
    allDay: false,
    start: new Date("2024-12-20T23:00:21.817Z"),
    end: new Date("2024-12-21T04:00:21.817Z"),
  },
  {
    title: "Math2",
    allDay: false,
    start: new Date("2024-12-20T23:00:21.817Z"),
    end: new Date("2024-12-21T04:00:21.817Z"),
  },
];

export default function MyCalendar() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px", height: "100vh" },
      }}
    >
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        defaultView="day"
        style={{ height: "100%" }}
        views={["day", "week", "month"]}
      />
    </Box>
  );
}
