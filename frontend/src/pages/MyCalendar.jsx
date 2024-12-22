import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useGetCalendar } from "../hooks/Calendar/useGetCalendar";
import { toSGTime } from "../../config/convertTimeToSGT";
const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const events = [
    {
      id: 7,
      title: "Lunch",
      start: new Date(2024, 11, 12, 12, 0, 0, 0),
      end: new Date(2024, 11, 12, 12, 12, 0, 0),
      desc: "Power lunch",
    },
  ];
  const [myEvents, setEvents] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const onLoad = async () => {
    try {
      const val = await fetchSchedule();
      console.log(val);
      setSchedule(val);
    } catch (err) {
      console.error("Error loading schedules:", err);
    }
  };
  useEffect(() => {
    onLoad();
  }, []);

  const transformedDataArray = schedule.map((data) => {
    const descString = ` Outlet: ${data.outlet_name} ${toSGTime(
      data.start_time
    )} - ${toSGTime(data.end_time)}, Vacancy: ${data.vacancy}`;
    return {
      title: descString,
      start: new Date(data.start_time),
      end: new Date(data.end_time),
      desc: descString,
    };
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const { fetchSchedule, isLoading, error } = useGetCalendar();

  const handleShowMore = (events, date) => {
    setSelectedDateEvents(events);
    setModalOpen(true);
  };

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const title = window.prompt("New Event name");
      if (title) {
        setEvents((prev) => [...prev, { start, end, title }]);
      }
    },
    [setEvents]
  );

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );

  const CustomEventWrapper = ({ event, children }) => {
    return (
      <div
        style={{
          border: "1px solid #007bff",
        }}
      >
        <strong>{event.title}</strong>
      </div>
    );
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
        events={transformedDataArray}
        defaultView="month"
        style={{ height: "100%" }}
        views={["month"]}
        onShowMore={handleShowMore}
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        components={{
          eventWrapper: CustomEventWrapper,
        }}
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
