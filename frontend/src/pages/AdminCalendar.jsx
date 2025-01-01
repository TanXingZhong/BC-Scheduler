import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useChangeUserFromSchedule } from "../hooks/Calendar/useChangeUserFromSchedule";
import { useRemoveUserFromSchedule } from "../hooks/Calendar/useRemoveUserFromSchedule";

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
  const [transformedDataArray, setTransformedDataArray] = useState([]);
  const [filteredDataArray, setFilteredData] = useState([]);
  const { changeUser } = useChangeUserFromSchedule();
  const { removeUser } = useRemoveUserFromSchedule();

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
    const data = schedule.map((data) => {
      // Find all users scheduled for this slot
      const filledSlots = scheduleAndUsers
        .filter((x) => x.schedule_id === data.schedule_id)
        .map((slot) => ({
          id: slot.id,
          employee: slot.name,
          role: slot.role_name,
        }));

      // Calculate the number of empty slots based on vacancie
      const emptySlots = Array(data.vacancy)
        .fill()
        .map(() => ({
          id: "",
          employee: "EMPTY",
          role: "EMPTY"
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

    setTransformedDataArray(data);
    setFilteredData(data);
  }, [schedule, scheduleAndUsers]);

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
    // if filters is empty, set filteredData to transformedDataArray
    if (Object.keys(filters).length === 0) {
      setFilteredData(transformedDataArray);
      return;
    } else {

      for (const column of Object.keys(filters)) {
        if(column === "employee") {
          uniqueValuesByColumn[column] = transformedDataArray
            .flatMap((row) => row["array"])
            .reduce((unique, current) => {
              // Check if the current object is already in the unique array based on custom comparison
              if (!unique.some((item) => item.id === current.id)) {
                unique.push(current); // Add it if not already included
              }
              return unique;
            }, []);
        } else if (column === "role") {
          uniqueValuesByColumn[column] = transformedDataArray
            .flatMap((row) => row["array"])
            .reduce((unique, current) => {
              // Check if the current object is already in the unique array based on custom comparison
              if (!unique.some((item) => item.role === current.role)) {
                unique.push(current); // Add it if not already included
              }
              return unique;
            }, []);
        } else {
          uniqueValuesByColumn[column] = [
            ...new Set(transformedDataArray.flatMap((row) => row[column])),
          ];
        }
      }
      setUniqueValues(uniqueValuesByColumn);
    }

    // only filters outletname and start_time, if the the chosen employees are in the event, it will be kept
    const fisrtFilter = transformedDataArray.filter((event) => {
      return Object.keys(filters).every((column) => {
        // If the filter applies to an array column (like 'employee'), we need to check the array of objects
        if (column === "employee") {
          return (
            !filters[column].length ||
            event.array.some((slot) => filters["employee"].includes(slot.employee))
          );
        }
        if (column === "role") {
          return (
            !filters[column].length ||
            event.array.some((slot) => filters["role"].includes(slot.role))
          );
        }
        // Otherwise, apply the filter on the main column
        return (
          !filters[column].length || filters[column].includes(event[column])
        );
      });
    });

    // filter employee
    if (filters["employee"] === undefined) {
      setFilteredData([]);
      return;
    } 
    const secondFilter = fisrtFilter.map((event) => {
      const filteredArray = event.array.filter((slot) =>
        filters["employee"].includes(slot.employee)
      );
      return {
        ...event,
        array: filteredArray,
      };
    });

    // filter role
    if (filters["role"] === undefined) {
      setFilteredData([]);
      return;
    }
    const thirdFilter = secondFilter.map((event) => {
      const filteredArray = event.array.filter((slot) =>
        filters["role"].includes(slot.role)
      );
      return {
        ...event,
        array: filteredArray,
      };
    });

    console.log(thirdFilter);
    console.log(filters);

    setFilteredData(thirdFilter);
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

  const categories = [
    { label: "employee", name: "Employee" },
    { label: "outlet_name", name: "Outlet" },
    { label: "start_time", name: "Shifts" },
    { label: "role", name: "Role" },
  ];

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
  const handleRemoveUser = async (user_id) => {
    await removeUser(scheduleInfo.schedule_id, user_id);
    onLoad(getMonthRange(currentDate));
    setOpenAllocateSchedule(false);
  };

  const handleChangeUser = async (user_id, new_id) => {
    await changeUser(scheduleInfo.schedule_id, user_id, new_id);
    onLoad(getMonthRange(currentDate));
    setOpenAllocateSchedule(false);
  };
  const handleCardClick = useCallback((event, x) => {
    setScheduleInfo(event);
    setOpenAllocateSchedule(true);
  }, []);

  const handleNavigate = useCallback((newDate) => {
    handleClearFilters();
    setSchedule([]);
    setScheduleAndUsers([]);
    setSelectedSlot([]);
    selectedSlotsRef.current = [];
    setCurrentDate(newDate); // Update the visible date
    if (isDeleteButtonVisible) {
      setDeleteButtonVisible(false);
    }
  }, []);

  const handleShowMore = (events, date) => {
    setSelectedDateEvents(events);
    setModalOpen(true);
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
              width: "99%",
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
        overflowX: "auto",
      }}
    >
      <Grid2 container spacing={2} sx={{ marginBottom: "10px" }}>
        {categories.map((x, index) => (
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
          {uniqueValues[currentFilterColumn]?.map((value) => {
            // Check if value is an object (not an array)
            if (typeof value === "object" && currentFilterColumn === "employee" && value !== null) {
              return (
                <FormControlLabel
                  key={`${currentFilterColumn}-${value.employee}`} // Assuming value has an 'id' field for uniqueness
                  control={
                    <Checkbox
                      checked={filters[currentFilterColumn]?.includes(
                        value.employee
                      )} // Use value.id or another unique identifier
                      onChange={() =>
                        handleCheckboxChange(
                          currentFilterColumn,
                          value.employee
                        )
                      }
                      name={value.employee} // Or another unique property of the object
                    />
                  }
                  label={`${value.employee}`} // Assuming the object has a 'name' field
                />
              );
            }
            
            if (typeof value === "object" && currentFilterColumn === "role" && value !== null) {
              return (
                <FormControlLabel
                  key={`${currentFilterColumn}-${value.role}`} // Assuming value has an 'id' field for uniqueness
                  control={
                    <Checkbox
                      checked={filters[currentFilterColumn]?.includes(
                        value.role
                      )} // Use value.id or another unique identifier
                      onChange={() =>
                        handleCheckboxChange(
                          currentFilterColumn,
                          value.role
                        )
                      }
                      name={value.role} // Or another unique property of the object
                    />
                  }
                  label={`${value.role}`} // Assuming the object has a 'name' field
                />
              );
            }


            // Default behavior when value is not an object
            return (
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
            );
          })}
        </>
      )}
      {openAllocateSchedule && (
        <AllocateSchedule
          open={openAllocateSchedule}
          handleClose={() => setOpenAllocateSchedule(false)}
          scheduleInfo={scheduleInfo}
          allUsersInfo={names}
          refresh={handleRefresh}
          handleChangeUser={handleChangeUser}
          handleRemoveUser={handleRemoveUser}
        />
      )}
      <Calendar
        localizer={localizer}
        events={filteredDataArray}
        defaultView="month"
        style={{ height: "100%" }}
        views={["agenda", "month"]}
        onSelectSlot={(slotInfo) => {
          const { start, end, slots } = slotInfo;
          const selectedEvents = filteredDataArray.filter(
            (event) =>
              new Date(event.start) >= new Date(start) &&
              new Date(event.end) <= new Date(end)
          );
          setSelectedSlot(slots); // Update selected slot
          selectedSlotsRef.current = selectedEvents; // Keep a reference to selected events
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
        showAllEvents={true}
      />

      <Publish
        open={openPublish}
        handleClose={handleClosePublish}
        names={names}
        refresh={handleRefresh}
      />
    </Box>
  );
}
