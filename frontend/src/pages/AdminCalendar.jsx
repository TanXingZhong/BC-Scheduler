import React, { useState, useEffect, useRef } from "react";
import {
  Grid2,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Publish from "../components/Publish";
import { useGetCalendar } from "../hooks/Calendar/useGetCalendar";
import { useGetNames } from "../hooks/Calendar/useGetNames";
import { toSGTimeShort } from "../../config/convertTimeToSGT";
import { dateTimeToDBDate } from "../../config/convertDateToDB";
import AllocateSchedule from "../components/AllocateSchedule";
import { useDeleteSchedule } from "../hooks/Calendar/useDeleteSchedule";

export default function AdminCalendar() {
  const localizer = momentLocalizer(moment);
  const { fetchNames } = useGetNames();
  const { fetchSchedule, isLoading, error } = useGetCalendar();
  const [names, setNames] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [scheduleAndUsers, setScheduleAndUsers] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    deleteSchedule,
    isLoading: isLoadingDelete,
    error: errorDelete,
  } = useDeleteSchedule();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const selectedSlotsRef = useRef([]);
  const [isDeleteButtonVisible, setDeleteButtonVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState([]);
  const onLoad = async (start) => {
    try {
      const [scheduleData, namesData] = await Promise.all([
        fetchSchedule(start),
        fetchNames(),
      ]);
      setSchedule(scheduleData.rows);
      setScheduleAndUsers(scheduleData.rowsplus);
      setNames(namesData);
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

  const handleNavigate = (newDate) => {
    setSchedule([]);
    setScheduleAndUsers([]);
    setSelectedSlot([]);
    selectedSlotsRef.current = [];
    setCurrentDate(newDate); // Update the visible date
    if (isDeleteButtonVisible) {
      setDeleteButtonVisible(false);
    }
  };

  // Transform the schedule data into the format that the calendar can use
  const transformedDataArray = schedule.map((data) => {
    // Find all users scheduled for this slot
    const filledSlots = scheduleAndUsers
      .filter((x) => x.schedule_id === data.schedule_id)
      .map((slot) => ({
        id: slot.id,
        employee: slot.name,
      }));

    // Calculate the number of empty slots based on vacancie
    const emptySlots = Array(data.vacancy)
      .fill()
      .map(() => ({
        id: "",
        employee: "EMPTY",
      }));

    // Combine filled and empty slots
    const combinedSlots = [...filledSlots, ...emptySlots];

    return {
      schedule_id: data.schedule_id,
      title: `${data.outlet_name}, ${toSGTimeShort(
        data.start_time
      )} - ${toSGTimeShort(data.end_time)}`,
      outlet_name: data.outlet_name,
      start: new Date(data.start_time),
      end: new Date(data.end_time),
      start_time: toSGTimeShort(data.start_time),
      end_time: toSGTimeShort(data.end_time),
      vacancy: data.vacancy,
      array: combinedSlots,
    };
  });
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
        ...new Set(transformedDataArray.flatMap((row) => row[column])),
      ];
    }
    setUniqueValues(uniqueValuesByColumn);
  }, [filters]);

  // Handle filter column selection (toggle filters)
  const handleFilterColumnClick = (column) => {
    setShowFilterOptions(true);
    setCurrentFilterColumn(column);
    setFilters((prevFilters) => {
      if (prevFilters[column]) {
        return prevFilters; // Don't update if already exists
      }

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

  // Filtered data based on selected filters
  const filteredDataArray = transformedDataArray.filter((event) => {
    return Object.keys(filters).every((column) => {
      // If the filter applies to an array column (like 'employee'), we need to check the array of objects
      if (column === "employee") {
        return (
          !filters[column].length ||
          event.array.some((slot) => filters[column].includes(slot.employee))
        );
      }
      // Otherwise, apply the filter on the main column
      return !filters[column].length || filters[column].includes(event[column]);
    });
  });

  const categories = [
    { label: "outlet_name", name: "Outlet" },
    { label: "start_time", name: "Shifts" },
    { label: "employee", name: "Employee" },
  ];

  const handleShowMore = (events, date) => {
    setSelectedDateEvents(events);
    setModalOpen(true);
  };
  const handleDelete = async () => {
    try {
      const deletionPromises = selectedSlotsRef.current.map((x) =>
        deleteSchedule(x.schedule_id)
      );
      await Promise.all(deletionPromises);
      selectedSlotsRef.current = [];
      if (isDeleteButtonVisible) {
        setDeleteButtonVisible(false);
      }
      onLoad(getMonthRange(currentDate));
    } catch (error) {
      console.error("Error deleting schedules", error);
    }
  };
  const [openAllocateSchedule, setOpenAllocateSchedule] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState({});
  const [assigned, setAssigned] = useState([]);
  const handleCardClick = (event, x) => {
    setScheduleInfo(event);
    setAssigned(x);
    setOpenAllocateSchedule(true);
  };
  const handleRefresh = () => {
    onLoad(getMonthRange(currentDate));
  };
  const CustomEventWrapper = ({ event, onCardClick }) => {
    const title = event.title;
    const arr = event.array;
    return (
      <div>
        {arr.map((x, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              fontSize: "10px",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                transform: "scale(1.05)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              },
            }}
            onClick={() => onCardClick(event, x)} // Pass the event and the item to the callback
          >
            <Typography
              sx={{
                fontSize: "10px",
                color: x.employee == "EMPTY" ? "red" : "green",
                textAlign: "center",
              }}
            >
              {`${x.employee} - ${title}`} {/* Combine title with each item */}
            </Typography>
          </Card>
        ))}
      </div>
    );
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        height: "100vh",
        overflowY: "scroll",
        scrollbarWidth: "none",
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

        <Grid2 sx={{ marginLeft: "auto" }}>
          {isDeleteButtonVisible && (
            <Button onClick={handleDelete} variant="outlined">
              Delete
            </Button>
          )}
          <Button
            onClick={handleClickOpenPublish}
            variant="outlined"
            sx={{ marginLeft: "10px" }} // Adds space between buttons
          >
            Publish
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

      {openAllocateSchedule && (
        <AllocateSchedule
          open={openAllocateSchedule}
          handleClose={() => setOpenAllocateSchedule(false)}
          scheduleInfo={scheduleInfo}
          allUsersInfo={names}
          assigned={assigned}
          refresh={handleRefresh}
        />
      )}

      <Calendar
        localizer={localizer}
        events={filteredDataArray}
        defaultView="month"
        style={{ height: "100%" }}
        views={["month", "agenda"]}
        onSelectSlot={(slotInfo) => {
          const { start, end, slots } = slotInfo;
          const selectedEvents = filteredDataArray.filter(
            (event) =>
              new Date(event.start) >= new Date(start) &&
              new Date(event.end) <= new Date(end)
          );
          setSelectedSlot(slots);
          selectedSlotsRef.current = selectedEvents;
          if (selectedEvents.length > 0) {
            setDeleteButtonVisible(true);
          } else {
            setDeleteButtonVisible(false);
          }
        }}
        dayPropGetter={(date) => {
          const isSelected = selectedSlot.some((slot) =>
            moment(slot).isSame(date, "day")
          );
          return {
            style: {
              border: isSelected ? "0.1px solid #1890ff" : undefined,
            },
          };
        }}
        components={{
          eventWrapper: (props) => (
            <CustomEventWrapper {...props} onCardClick={handleCardClick} />
          ),
        }}
        selectable
        onNavigate={handleNavigate}
        onShowMore={handleShowMore}
      />

      <Publish
        open={openPublish}
        handleClose={handleClosePublish}
        names={names}
        refresh={handleRefresh}
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
