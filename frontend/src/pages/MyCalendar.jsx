import { useState, useEffect, useCallback } from "react";
import {
  Grid2,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useGetCalendar } from "../hooks/Calendar/useGetCalendar";
import { toSGTimeShort } from "../../config/convertTimeToSGT";
import { dateTimeToDBDate } from "../../config/convertDateToDB";
import ApplySchedule from "../components/ApplySchedule";
import { useUserInfo } from "../hooks/useUserInfo";

const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const { fetchSchedule, isLoading, error } = useGetCalendar();
  const [schedule, setSchedule] = useState([]);
  const [scheduleAndUsers, setScheduleAndUsers] = useState([]);
  const userInfo = useUserInfo();
  const [currentDate, setCurrentDate] = useState(new Date()); // Track the visible month
  // Load schedule data when the component mounts
  const onLoad = async (start) => {
    try {
      const [scheduleData, namesData] = await Promise.all([
        fetchSchedule(start),
      ]);
      setSchedule(scheduleData.rows);
      setScheduleAndUsers(scheduleData.rowsplus);
    } catch (err) {
      console.error("Error loading schedules: ", err);
    }
  };

  useEffect(() => {
    const start = getMonthRange(currentDate);
    onLoad(start);
  }, [currentDate]);

  const getMonthRange = (date) => {
    const start = dateTimeToDBDate(
      new Date(date.getFullYear(), date.getMonth(), 1)
    );
    return start;
  };

  // Transform the schedule data into the format that the calendar can use
  const transformedDataArray = schedule.reduce((acc, data) => {
    const emptySlots = Array(data.vacancy)
      .fill()
      .map(() => ({
        title: `EMPTY, ${toSGTimeShort(data.start_time)} - ${toSGTimeShort(
          data.end_time
        )}, ${data.outlet_name}`,
        schedule_id: data.schedule_id,
        outlet_name: data.outlet_name,
        start: new Date(data.start_time),
        end: new Date(data.end_time),
        start_end_time: `${toSGTimeShort(data.start_time)} - ${toSGTimeShort(
          data.end_time
        )}`,
        vacancy: data.vacancy,
        employee: "EMPTY",
        employee_id: "",
      }));

    const filledSlots = scheduleAndUsers
      .filter((x) => x.schedule_id === data.schedule_id)
      .map((slot) => ({
        title: `${slot.name}, ${toSGTimeShort(
          data.start_time
        )} - ${toSGTimeShort(data.end_time)}, ${data.outlet_name}`,
        schedule_id: data.schedule_id,
        outlet_name: data.outlet_name,
        start: new Date(data.start_time),
        end: new Date(data.end_time),
        start_end_time: `${toSGTimeShort(data.start_time)} - ${toSGTimeShort(
          data.end_time
        )}`,
        vacancy: data.vacancy,
        employee: slot.name,
        employee_id: slot.id,
      }));

    return [...acc, ...emptySlots, ...filledSlots];
  }, []);

  // Handle selecting an event
  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );

  const [filters, setFilters] = useState({});
  const [uniqueValues, setUniqueValues] = useState({});
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [currentFilterColumn, setCurrentFilterColumn] = useState(null);
  useEffect(() => {
    const uniqueValuesByColumn = {};
    for (const column of Object.keys(filters)) {
      uniqueValuesByColumn[column] = [
        ...new Set(transformedDataArray.map((row) => row[column])),
      ];
    }
    setUniqueValues(uniqueValuesByColumn);
  }, [filters]);

  // Handle filter column selection (toggle filters)
  const handleFilterColumnClick = (column) => {
    // Only show filter options if not already showing
    setShowFilterOptions(true);
    setCurrentFilterColumn(column);

    // Only initialize the filter if it hasn't been set yet
    setFilters((prevFilters) => {
      if (prevFilters[column]) {
        // If the filter is already set, do not update it
        return prevFilters;
      }

      // Otherwise, initialize it with all values selected (if not already done)
      return {
        ...prevFilters,
        [column]: uniqueValues[column] || [], // Initialize with all values selected
      };
    });
  };

  // Handle checkbox changes for filters
  const handleCheckboxChange = (column, value) => {
    setFilters((prevFilters) => {
      const columnFilters = prevFilters[column] || [];
      const newFilters = columnFilters.includes(value)
        ? columnFilters.filter((v) => v !== value)
        : [...columnFilters, value];
      return { ...prevFilters, [column]: newFilters };
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({});
    setShowFilterOptions(false);
    setCurrentFilterColumn(null);
  };

  const filteredDataArray = transformedDataArray.filter((event) => {
    return Object.keys(filters).every(
      (column) =>
        !filters[column].length || filters[column].includes(event[column])
    );
  });

  const CustomEventWrapper = ({ event }) => {
    const isEventNameEmpty = event.employee === "EMPTY";
    const eventColor = isEventNameEmpty ? "red" : "green";

    const [openApplySchedule, setApplySchedule] = useState(false);
    const [scheduleInfo, setScheduleInfo] = useState([]);

    const handleCloseApplySchedule = () => {
      setApplySchedule(false);
    };

    const handleCardClick = () => {
      setApplySchedule(true);
      setScheduleInfo(event);
    };
    return (
      <>
        {openApplySchedule && (
          <ApplySchedule
            open={openApplySchedule}
            handleClose={handleCloseApplySchedule}
            scheduleInfo={scheduleInfo}
            userInfo={userInfo}
          />
        )}

        <Card
          variant="outlined"
          sx={{
            fontSize: "10px", // Set font size for Card
            cursor: "pointer", // Change cursor to pointer to indicate it's clickable
            alignItems: "center", // Vertically center the content
            justifyContent: "center", // Horizontally center the content

            transition: "all 0.3s ease", // Smooth transition for hover effect
            "&:hover": {
              backgroundColor: "#f0f0f0", // Change background on hover
              transform: "scale(1.05)", // Slightly enlarge the card on hover
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Add shadow on hover
            },
          }}
          onClick={handleCardClick} // Set the onClick handler
        >
          <Typography
            sx={{
              fontSize: "10px", // Set font size for Typography
              color: eventColor, // Change color based on event.employee status
              textAlign: "center", // Ensure text is centered horizontally
            }}
          >
            {event.title} {/* Display event title */}
          </Typography>
        </Card>
      </>
    );
  };

  const categories = [
    {
      label: "outlet_name",
      name: "Outlet",
    },
    {
      label: "start_end_time",
      name: "Shifts",
    },
    {
      label: "employee",
      name: "Employee",
    },
  ];
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  const handleShowMore = (events, date) => {
    setSelectedDateEvents(events);
    setModalOpen(true);
  };

  const handleNavigate = (newDate) => {
    setSchedule([]);
    setScheduleAndUsers([]);
    setCurrentDate(newDate); // Update the visible date
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        height: "100vh",
        overflowY: "hidden", // Disable vertical scrollbar
        overflowX: "auto", // Enable horizontal scrollbar if necessary
      }}
    >
      <Grid2 container spacing={2} sx={{ marginBottom: "10px" }}>
        {categories.map((x) => (
          <Grid2 key={x.label}>
            <Button
              variant={filters[x.label]?.length ? "contained" : "outlined"}
              onClick={() => handleFilterColumnClick(x.label)}
            >
              {x.name}
            </Button>
          </Grid2>
        ))}

        <Grid2>
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Grid2>
      </Grid2>

      {showFilterOptions && (
        <>
          {uniqueValues[currentFilterColumn]?.map((value) => (
            <FormControlLabel
              key={`${currentFilterColumn}-${value}`}
              control={
                <Checkbox
                  checked={filters[currentFilterColumn]?.includes(value)}
                  onChange={() =>
                    handleCheckboxChange(currentFilterColumn, value)
                  }
                  name={value}
                />
              }
              label={`${value}`}
            />
          ))}
        </>
      )}

      <Calendar
        localizer={localizer}
        events={filteredDataArray}
        defaultView="month"
        style={{ height: "100%" }}
        views={["month", "agenda"]}
        components={{
          eventWrapper: (props) => <CustomEventWrapper {...props} />,
        }}
        onNavigate={handleNavigate}
        onShowMore={handleShowMore}
      />
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <h2>
            Shifts on{" "}
            {selectedDateEvents.length > 0 &&
              moment(selectedDateEvents[0]?.start).format("MMMM Do YYYY")}
          </h2>
          <ul>
            {selectedDateEvents.map((event, index) => (
              <li key={index}>
                <Typography>{event.title}</Typography>
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
