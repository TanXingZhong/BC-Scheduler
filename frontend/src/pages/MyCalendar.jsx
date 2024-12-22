import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useState } from "react";
const localizer = momentLocalizer(moment);

const calendarEvents = [
  {
    title: "Math",
    allDay: false,
    start: new Date("2024-12-20T17:00:21.817Z"),
    end: new Date("2024-12-20T23:00:21.817Z"),
  },
  {
    title: "Math",
    allDay: false,
    start: new Date("2024-12-20T17:00:21.817Z"),
    end: new Date("2024-12-20T23:00:21.817Z"),
  },
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  const handleShowMore = (events, date) => {
    setSelectedDateEvents(events);
    setModalOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        height: "100vh",
      }}
    >
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        defaultView="month"
        style={{ height: "100%" }}
        views={["month"]}
        onShowMore={handleShowMore}
      />
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          <h2>
            Events on{" "}
            {selectedDateEvents.length > 0 &&
              moment(selectedDateEvents[0]?.start).format("MMMM Do YYYY")}
          </h2>
          <ul>
            {selectedDateEvents.map((event, index) => (
              <li key={index}>
                <strong>{event.title}</strong>:{" "}
                {moment(event.start).format("h:mm A")} -{" "}
                {moment(event.end).format("h:mm A")}
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
