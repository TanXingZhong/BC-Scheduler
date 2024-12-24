import { useState, useEffect, useCallback } from "react";
import {
  Grid2,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  Typography,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Publish from "../components/Publish";
import { useGetCalendar } from "../hooks/Calendar/useGetCalendar";
import { useGetNames } from "../hooks/Calendar/useGetNames";
import { toSGTimeShort } from "../../config/convertTimeToSGT";
import AllocateSchedule from "../components/AllocateSchedule";

const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const { fetchNames } = useGetNames();
  const { fetchSchedule, isLoading, error } = useGetCalendar();
  const [names, setNames] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // Load schedule data when the component mounts
  const onLoad = async () => {
    try {
      const schedules = await fetchSchedule();
      const namesData = await fetchNames();
      setSchedule(schedules);
      setNames(namesData);
    } catch (err) {
      console.error("Error loading schedules:", err);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  // Transform the schedule data into the format that the calendar can use
  const transformedDataArray = schedule.reduce((acc, data) => {
    const emptySlots = Array(data.vacancy).fill({
      title: `EMPTY, ${toSGTimeShort(data.start_time)} - ${toSGTimeShort(
        data.end_time
      )}, ${data.outlet_name}`,
      outlet_name: data.outlet_name,
      start: new Date(data.start_time),
      end: new Date(data.end_time),
      start_end_time: `${toSGTimeShort(data.start_time)} - ${toSGTimeShort(
        data.end_time
      )}`,
      vacancy: data.vacancy,
      schedule_id: data.schedule_id,
      employee: "EMPTY",
    });

    const filledSlots = data.employee_ids.body.map((id) => {
      const employee = names.find((employee) => employee.id === id);
      if (!employee) {
        return {};
      }
      return {
        title: `${employee.name}, ${toSGTimeShort(
          data.start_time
        )} - ${toSGTimeShort(data.end_time)}, ${data.outlet_name}`,
        outlet_name: data.outlet_name,
        start: new Date(data.start_time),
        end: new Date(data.end_time),
        start_end_time: `${toSGTimeShort(data.start_time)} - ${toSGTimeShort(
          data.end_time
        )}`,
        vacancy: data.vacancy,
        schedule_id: data.schedule_id,
        employee: employee.name,
      };
    });

    return [...acc, ...emptySlots, ...filledSlots];
  }, []);

  // Handle selecting an event
  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );

  // Handle category toggle (to filter by category)

  // Publish logic (for modal or other purposes)
  const [openPublish, setOpenPublish] = useState(false);
  const handleClickOpenPublish = () => {
    setOpenPublish(true);
  };
  const handleClosePublish = () => {
    setOpenPublish(false);
  };

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

    const [openAllocateSchedule, setAllocateSchedule] = useState(false);
    const [scheduleInfo, setScheduleInfo] = useState([]);

    const handleCloseAllocateSchedule = () => {
      setAllocateSchedule(false);
    };

    const handleCardClick = () => {
      setAllocateSchedule(true);
      setScheduleInfo(event);
    };

    return (
      <>
        {openAllocateSchedule && (
          <AllocateSchedule
            open={openAllocateSchedule}
            handleClose={handleCloseAllocateSchedule}
            scheduleInfo={scheduleInfo}
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

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        height: "100vh",
      }}
    >
      <Box sx={{ marginBottom: "10px" }}>
        <Grid2 container spacing={2}>
          {categories.map((x) => (
            <Grid2 item key={x.label}>
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

          <Grid2 item sx={{ marginLeft: "auto" }}>
            <Button onClick={handleClickOpenPublish} variant="outlined">
              Publish
            </Button>
          </Grid2>
        </Grid2>
      </Box>

      {showFilterOptions && (
        <Box sx={{ marginBottom: "20px" }}>
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
        </Box>
      )}

      <Calendar
        localizer={localizer}
        events={filteredDataArray}
        defaultView="month"
        style={{ height: "90%" }}
        views={["week", "month"]}
        components={{
          eventWrapper: (props) => <CustomEventWrapper {...props} />,
        }}
      />
      <Publish open={openPublish} handleClose={handleClosePublish} />
    </Box>
  );
}
