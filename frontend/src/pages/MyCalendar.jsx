import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect, useState, useCallback } from "react";
import { useGetCalendar } from "../hooks/Calendar/useGetCalendar";
import { useGetNames } from "../hooks/Calendar/useGetNames";
import { toSGTime } from "../../config/convertTimeToSGT";
import { Grid2, Checkbox, FormControlLabel } from "@mui/material";

const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const { fetchSchedule, isLoading, error } = useGetCalendar();
  const { fetchNames } = useGetNames();
  const [schedule, setSchedule] = useState([]);
  const [names, setNames] = useState([]);

  // Load schedule data when the component mounts
  const onLoad = async () => {
    try {
      const schedules = await fetchSchedule();
      const names = await fetchNames();

      setSchedule(schedules);
      setNames(names);
    } catch (err) {
      console.error("Error loading schedules:", err);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);
  // Transform the schedule data into a format that the Calendar accepts
  const transformedDataArray = schedule.reduce((acc, data) => {
    // create new event objects based on vacancies and number of employees

    const emptySlots = Array(data.vacancy).fill(
      {
        title: `${toSGTime(data.start_time)} - ${toSGTime(data.end_time)}, ${data.outlet_name}, EMPTY`,
        start: new Date(data.start_time),
        end: new Date(data.end_time),
        desc: `Vacancy: ${data.vacancy}`,
        schedule_id: data.schedule_id,
        outlet_name: data.outlet_name,
      }
    );
    
    const filledSlots = data.employee_ids.body.map((id) => {
      const employee = names.find((employee) => employee.id === id);

      if(!employee) {
        return {};
      }

      return {
        title: `${toSGTime(data.start_time)} - ${toSGTime(data.end_time)}, ${data.outlet_name}, ${employee.name}`,
        start: new Date(data.start_time),
        end: new Date(data.end_time),
        desc: `Vacancy: ${data.vacancy}`,
        schedule_id: data.schedule_id,
        outlet_name: data.outlet_name,
      };
    })
    return [...acc, ...emptySlots, ...filledSlots];
  }, []);

  // const transformedDataArray = schedule.map((data) => {
  //   console.log(data);
  //   const descString = `${toSGTime(data.start_time)} - ${toSGTime(
  //     data.end_time
  //   )}, Vacancy: ${data.vacancy}`;
  //   return {
  //     title: descString,
  //     start: new Date(data.start_time),
  //     end: new Date(data.end_time),
  //     desc: descString,
  //     schedule_id: data.schedule_id, // Added for filtering
  //     outlet_name: data.outlet_name, // Added for filtering
  //   };
  // });

  // Handle clicking on a day with events
  const handleShowMore = (events, date) => {
    setSelectedDateEvents(events);
    setModalOpen(true);
  };

  // Handle selecting an event
  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );

  // Custom event wrapper for better event display
  const CustomEventWrapper = ({ children, event }) => (
    <div
      style={{
        fontSize: "10px",
      }}
    >
      {children}
    </div>
  );

  // Filter state and logic
  const [filters, setFilters] = useState({ column: "", values: [] });
  const [uniqueValues, setUniqueValues] = useState([]);
  const [showFilterOptions, setShowFilterOptions] = useState(false); // To control the dropdown visibility

  useEffect(() => {
    if (filters.column) {
      const unique = [...new Set(schedule.map((row) => row[filters.column]))];
      setUniqueValues(unique);
      setFilters((prevFilters) => ({
        ...prevFilters,
        values: unique, // Automatically check all filter options by default
      }));
    } else {
      setUniqueValues([]);
    }
  }, [filters.column, schedule]);

  const handleCheckboxChange = (value) => {
    setFilters((prevFilters) => {
      const newValues = prevFilters.values.includes(value)
        ? prevFilters.values.filter((v) => v !== value)
        : [...prevFilters.values, value];
      return { ...prevFilters, values: newValues };
    });
  };

  const handleClearFilters = () => {
    setFilters({ column: "", values: [] });
    setShowFilterOptions(false); // Hide options when filters are cleared
  };

  const handleFilterColumnClick = (column) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      column,
      values: [], // Reset values for new filter column
    }));
    setShowFilterOptions(true); // Show filter options when a column is selected
  };

  // Filtered data based on the selected filter and its values
  const filteredDataArray = filters.column
    ? filters.values.length === 0
      ? [] // Show no data if no filter values are selected
      : transformedDataArray.filter((event) =>
          filters.values.includes(event[filters.column])
        )
    : transformedDataArray;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        height: "100vh",
      }}
    >
      <Box sx={{ marginBottom: "10px" }}>
        <Grid2 container spacing={2} justifyContent="space-between">
          <Grid2>
            <Button
              variant={
                filters.column === "schedule_id" ? "contained" : "outlined"
              }
              onClick={() => handleFilterColumnClick("schedule_id")}
            >
              Schedule ID
            </Button>
          </Grid2>
          <Grid2>
            <Button
              variant={
                filters.column === "outlet_name" ? "contained" : "outlined"
              }
              onClick={() => handleFilterColumnClick("outlet_name")}
            >
              Outlet Name
            </Button>
          </Grid2>
          <Grid2>
            <Button
              variant={filters.column === "start" ? "contained" : "outlined"}
              onClick={() => handleFilterColumnClick("start")}
            >
              Start
            </Button>
          </Grid2>
          <Grid2>
            <Button variant="outlined" onClick={handleClearFilters}>
              Clear Filter
            </Button>
          </Grid2>

          {/* Extreme Right Button */}
          <Grid2 sx={{ marginLeft: "auto" }}>
            <Button variant="outlined">Publish</Button>
          </Grid2>
        </Grid2>
      </Box>

      {/* Show Available Filter Options as Checkboxes */}
      {showFilterOptions && filters.column && (
        <Box sx={{ marginBottom: "20px" }}>
          <Grid2 container spacing={2}>
            {uniqueValues.map((value) => (
              <Grid2 item key={value}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.values.includes(value)}
                      onChange={() => handleCheckboxChange(value)}
                      name={value}
                    />
                  }
                  label={value}
                />
              </Grid2>
            ))}
          </Grid2>
        </Box>
      )}

      {/* Calendar Component */}
      <Calendar
        localizer={localizer}
        events={filteredDataArray} // Use filtered data
        defaultView="month"
        style={{ height: "90%" }}
        views={["month"]}
        onShowMore={handleShowMore}
        onSelectEvent={handleSelectEvent}
        components={{
          eventWrapper: CustomEventWrapper,
        }}
      />
    </Box>
  );
}
