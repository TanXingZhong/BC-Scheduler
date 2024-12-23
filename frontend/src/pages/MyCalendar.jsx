import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useGetCalendar } from "../hooks/Calendar/useGetCalendar";
import { useGetNames } from "../hooks/Calendar/useGetNames";
import { toSGTime } from "../../config/convertTimeToSGT";
import { Grid2, Checkbox, FormControlLabel } from "@mui/material";
import Publish from "../components/Publish";

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
    const onLoad = async () => {
      try {
        const val = await fetchSchedule();
        setSchedule(val);
      } catch (err) {
        console.error("Error loading schedules:", err);
      }
    };
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

  // Update unique values when filters are toggled
  useEffect(() => {
    const uniqueValuesByColumn = {};
    for (const column of Object.keys(filters)) {
      uniqueValuesByColumn[column] = [
        ...new Set(schedule.map((row) => row[column])),
      ];
    }
    setUniqueValues(uniqueValuesByColumn);
  }, [filters, schedule]);

  // Handle filter column selection (toggle filters)
  const handleFilterColumnClick = (column) => {
    if (currentFilterColumn === column) {
      // If the same filter is clicked, toggle the visibility
      setShowFilterOptions((prev) => !prev);
      return;
    }

    setShowFilterOptions(true);
    setCurrentFilterColumn(column);

    if (!filters[column]) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [column]: uniqueValues[column] || [], // Initialize with all values selected
      }));
    }
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

  // Filtered events for calendar
  const filteredDataArray = transformedDataArray.filter((event) =>
    Object.keys(filters).every(
      (column) =>
        !filters[column]?.length || filters[column].includes(event[column])
    )
  );

  const [openPublish, setOpenPublish] = useState(false);
  const handleClosePublish = () => {
    setOpenPublish(false);
  };
  const handleClickOpenPublish = () => {
    setOpenPublish(true);
  };

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
          <Grid2 item>
            <Button
              variant={filters["schedule_id"] ? "contained" : "outlined"}
              onClick={() => handleFilterColumnClick("schedule_id")}
            >
              Schedule ID
            </Button>
          </Grid2>
          <Grid2 item>
            <Button
              variant={filters["outlet_name"] ? "contained" : "outlined"}
              onClick={() => handleFilterColumnClick("outlet_name")}
            >
              Outlet
            </Button>
          </Grid2>
          <Grid2 item>
            <Button
              variant={filters["start"] ? "contained" : "outlined"}
              onClick={() => handleFilterColumnClick("start")}
            >
              Start
            </Button>
          </Grid2>
          <Grid2 item>
            <Button variant="outlined" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Grid2>
          <Grid2 item sx={{ marginLeft: "auto" }}>
            <Button onClick={handleClickOpenPublish} variant="outlined">
              Publish
            </Button>
          </Grid2>
        </Grid2>
      </Box>

      {showFilterOptions && (
        <Box sx={{ marginBottom: "20px" }}>
          {Object.keys(filters).map((column) =>
            uniqueValues[column]?.map((value) => (
              <FormControlLabel
                key={`${column}-${value}`}
                control={
                  <Checkbox
                    checked={filters[column]?.includes(value)}
                    onChange={() => handleCheckboxChange(column, value)}
                    name={value}
                  />
                }
                label={`${value}`}
              />
            ))
          )}
        </Box>
      )}

      <Calendar
        localizer={localizer}
        events={filteredDataArray}
        defaultView="month"
        style={{ height: "90%" }}
        views={["month"]}
      />
      <Publish open={openPublish} handleClose={handleClosePublish} />
    </Box>
  );
}
