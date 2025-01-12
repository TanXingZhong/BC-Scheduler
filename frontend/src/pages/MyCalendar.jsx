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
  IconButton,
  Snackbar,
} from "@mui/material";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useGetCalendar } from "../hooks/Calendar/useGetCalendar";
import { useGetMonthLeaveOffs } from "../hooks/useGetMonthLeaveOffs";
import ViewLeaves from "../components/ViewLeaves";
import { toSGTimeShort } from "../../config/convertTimeToSGT";
import { dateTimeToDBDate } from "../../config/convertDateToDB";
import ApplySchedule from "../components/ApplySchedule";
import { useUserInfo } from "../hooks/useUserInfo";
import CloseIcon from "@mui/icons-material/Close";
const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const userInfo = useUserInfo();
  const { fetchSchedule, isLoading, error } = useGetCalendar();
  const { monthLeaveOffs, error: LeaveOffsErrror } = useGetMonthLeaveOffs();
  const [schedule, setSchedule] = useState([]);
  const [scheduleAndUsers, setScheduleAndUsers] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [transformedDataArray, setTransformedDataArray] = useState([]);
  const [filteredDataArray, setFilteredData] = useState([]);
  const [monthLeaveOffsData, setmonthLeaveOffsData] = useState([]);

  const onLoad = async (start) => {
    try {
      const [scheduleData] = await Promise.all([fetchSchedule(start)]);
      const [LeaveData] = await Promise.all([monthLeaveOffs(start)]);
      setSchedule(scheduleData.rows);
      setScheduleAndUsers(scheduleData.rowsplus);
      setmonthLeaveOffsData(LeaveData);
    } catch (err) {
      console.error("Error loading schedules: ", err);
    }
  };

  useEffect(() => {
    var data = [];
    if (schedule) {
      data = schedule.flatMap((data) => {
        // Find all users scheduled for this slot
        const filledSlots = scheduleAndUsers
          .filter((x) => x.schedule_id === data.schedule_id)
          .map((slot) => ({
            id: slot.id,
            employee: slot.name,
            role: slot.role_name,
            color: slot.color,
            type: "filled", // Mark as a filled slot
          }));

        // Calculate the number of empty slots based on vacancies
        const emptySlots = Array(data.vacancy)
          .fill()
          .map(() => ({
            id: "",
            employee: "EMPTY",
            role: "NONE",
            color: "#FF5733", // Placeholder color for empty slots
            type: "empty", // Mark as an empty slot
          }));

        // Combine filled and empty slots into individual slots
        const allSlots = [...filledSlots, ...emptySlots];

        // Structure each individual slot separately
        const individualSlots = allSlots.map((slot) => ({
          schedule_id: data.schedule_id,
          title: `${data.outlet_name}, ${toSGTimeShort(
            data.start_time
          )} - ${toSGTimeShort(data.end_time)}`,
          outlet_name: data.outlet_name,
          start: moment(data.start_time).startOf("day"),
          end: moment(data.end_time).startOf("day"),
          start_time: toSGTimeShort(data.start_time),
          end_time: toSGTimeShort(data.end_time),
          vacancy: data.vacancy,
          slot: slot,
          array: allSlots,
          published: data.published,
          type: "work",
        }));

        return individualSlots;
      });
    }
    var temp = [];

    // Update temp structure to match data's format
    if (monthLeaveOffsData) {
      temp = monthLeaveOffsData.map((data) => {
        return {
          title: "View Leave/Offs",
          start: data.date,
          end: data.date,
          people: data.user_info,
          type: "holiday",
        };
      });
    }

    // Merge data and temp
    const mergedData = [...data, ...temp];

    setTransformedDataArray(mergedData);
    setFilteredData(mergedData);
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
      // Generate unique values for each filter column (employee, role, etc.)
      for (const column of Object.keys(filters)) {
        if (column === "employee") {
          uniqueValuesByColumn[column] = transformedDataArray
            .filter((event) => event.type === "work")
            .flatMap((row) => row["array"])
            .reduce((unique, current) => {
              if (!unique.some((item) => item.id === current.id)) {
                unique.push(current);
              }
              return unique;
            }, []);
        } else if (column === "role") {
          uniqueValuesByColumn[column] = transformedDataArray
            .filter((event) => event.type === "work")
            .flatMap((row) => row["array"])
            .reduce((unique, current) => {
              if (!unique.some((item) => item.role === current.role)) {
                unique.push(current);
              }
              return unique;
            }, []);
        } else {
          uniqueValuesByColumn[column] = [
            ...new Set(
              transformedDataArray
                .filter((event) => event.type === "work")
                .flatMap((row) => row[column])
            ),
          ];
        }
      }
      setUniqueValues(uniqueValuesByColumn);
    }

    const filteredData = transformedDataArray
      .filter((event) => event.type === "work" || event.type === "holiday") // Keep both work and holiday events
      .filter((event) => {
        if (event.type === "holiday") {
          return true;
        }

        return Object.keys(filters).every((column) => {
          if (column === "employee") {
            return (
              !filters[column] ||
              !filters[column].length ||
              event.array.filter((slot) =>
                filters["employee"].includes(slot.employee)
              ).length > 0
            );
          }
          if (column === "role") {
            return (
              !filters[column] ||
              !filters[column].length ||
              event.array.some((slot) => filters["role"].includes(slot.role))
            );
          }
          return (
            !filters[column] ||
            !filters[column].length ||
            filters[column].includes(event[column])
          );
        });
      })
      .map((event) => {
        if (event.type === "holiday") {
          return event;
        }

        const filteredArray = event.array.filter((slot) => {
          const isEmployeeMatch =
            !filters["employee"] ||
            !filters["employee"].length ||
            filters["employee"].includes(slot.employee);
          const isRoleMatch =
            !filters["role"] ||
            !filters["role"].length ||
            filters["role"].includes(slot.role);
          return isEmployeeMatch && isRoleMatch;
        });

        return {
          ...event,
          array: filteredArray,
        };
      })
      .filter((event) => {
        if (event.type === "holiday") {
          return true;
        }
        return event.array.length > 0;
      });

    setFilteredData(filteredData);
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
    setUniqueValues({});
    setShowFilterOptions(false);
    setCurrentFilterColumn(null);
    setFilteredData(transformedDataArray);
  };

  const categories = [
    { label: "employee", name: "Employee" },
    { label: "outlet_name", name: "Outlet" },
    { label: "start_time", name: "Shifts" },
    { label: "role", name: "Role" },
  ];

  const [openApplySchedule, setApplySchedule] = useState(false);
  const [openLeave, setOpenLeave] = useState(false);
  const [leaveData, setLeaveData] = useState("");
  const [leaveDataDate, setLeaveDataDate] = useState("");
  const [scheduleInfo, setScheduleInfo] = useState([]);

  const handleCardClick = useCallback((event) => {
    setScheduleInfo(event);
    setApplySchedule(true);
  }, []);

  const handleLeaveClick = useCallback((event, leaveData, leaveDataDate) => {
    setLeaveData(leaveData);
    setLeaveDataDate(leaveDataDate);
    setOpenLeave(true);
  }, []);

  const handleCloseLeave = () => {
    setOpenLeave(false);
  };

  const handleCloseApplySchedule = () => {
    setApplySchedule(false);
  };

  const CustomEventWrapper = ({ event, onCardClick, onLeaveClick }) => {
    const title = event.title;
    const isWorkType = event.type === "work";
    const userLeaveData = event.people;
    const leaveDataDate = event.start;

    return (
      <div>
        {isWorkType ? (
          <Box
            variant="outlined"
            sx={{
              fontSize: "10px",
              marginBottom: "1px",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: event.slot.color,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "grey",
                transform: "scale(1.05)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              },
            }}
            onClick={() => onCardClick(event)} // Pass the event and the item to the callback
          >
            <Typography
              sx={{
                fontSize: "10px",
                color: "white",
                textAlign: "center",
              }}
            >
              {`${event.slot.employee} - ${title}`}{" "}
              {/* Combine title with each item */}
            </Typography>
          </Box>
        ) : (
          <Box
            variant="outlined"
            sx={{
              fontSize: "10px",
              cursor: "pointer",
              alignItems: "center",
              border: "1px solid grey",
              justifyContent: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                transform: "scale(1.05)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              },
            }}
            onClick={(event) =>
              onLeaveClick(event, userLeaveData, leaveDataDate)
            }
          >
            <Typography
              sx={{
                fontSize: "10px",
                color: "grey",
                textAlign: "center",
              }}
            >
              {`${title}`} {/* Combine title with each item */}
            </Typography>
          </Box>
        )}
      </div>
    );
  };

  const handleNavigate = useCallback((newDate) => {
    setSchedule([]);
    setmonthLeaveOffsData([]);
    setScheduleAndUsers([]);
    setCurrentDate(newDate); // Update the visible date
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        height: "150vh",
        overflowX: "auto",
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
          {uniqueValues[currentFilterColumn]?.map((value) => {
            // Check if value is an object (not an array)
            if (
              typeof value === "object" &&
              currentFilterColumn === "employee" &&
              value !== null
            ) {
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

            if (
              typeof value === "object" &&
              currentFilterColumn === "role" &&
              value !== null
            ) {
              return (
                <FormControlLabel
                  key={`${currentFilterColumn}-${value.role}`} // Assuming value has an 'id' field for uniqueness
                  control={
                    <Checkbox
                      checked={filters[currentFilterColumn]?.includes(
                        value.role
                      )} // Use value.id or another unique identifier
                      onChange={() =>
                        handleCheckboxChange(currentFilterColumn, value.role)
                      }
                      name={value.role} // Or another unique property of the object
                    />
                  }
                  label={`${value.role}`} // Assuming the object has a 'name' field
                />
              );
            }

            if (
              typeof value === "object" &&
              currentFilterColumn === "role" &&
              value !== null
            ) {
              return (
                <FormControlLabel
                  key={`${currentFilterColumn}-${value.role}`} // Assuming value has an 'id' field for uniqueness
                  control={
                    <Checkbox
                      checked={filters[currentFilterColumn]?.includes(
                        value.role
                      )} // Use value.id or another unique identifier
                      onChange={() =>
                        handleCheckboxChange(currentFilterColumn, value.role)
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
      {openApplySchedule && (
        <ApplySchedule
          open={openApplySchedule}
          handleClose={handleCloseApplySchedule}
          scheduleInfo={scheduleInfo}
          userInfo={userInfo}
        />
      )}
      {openLeave && (
        <ViewLeaves
          open={openLeave}
          handleClose={handleCloseLeave}
          data={leaveData}
          date={leaveDataDate}
        />
      )}

      <Calendar
        localizer={localizer}
        events={filteredDataArray.sort((a, b) => {
          function parseTime(timeString) {
            const [hours, minutes] = timeString.split(":").map(Number);
            return hours * 60 + minutes; // Convert time to total minutes
          }

          if (a.type === "work" && b.type === "work") {
            // First, compare by outlet name
            const outletComparison = a.outlet_name.localeCompare(b.outlet_name);
            if (outletComparison !== 0) {
              return outletComparison;
            }

            // Then, compare by start time
            const startComparison =
              parseTime(a.start_time) - parseTime(b.start_time);
            if (startComparison !== 0) {
              return startComparison;
            }

            // If start times are the same, compare by end time
            const endComparison = parseTime(a.end_time) - parseTime(b.end_time);
            if (endComparison !== 0) {
              return endComparison;
            }

            // Finally, compare by slot employee, with "EMPTY" coming first
            if (a.slot.employee === "EMPTY" && b.slot.employee !== "EMPTY") {
              return -1; // a comes before b
            } else if (
              a.slot.employee !== "EMPTY" &&
              b.slot.employee === "EMPTY"
            ) {
              return 1; // b comes before a
            }

            // If both are "EMPTY" or neither are "EMPTY", no further sorting is needed
            return 0;
          }

          return 0;
        })}
        defaultView="month"
        style={{ height: "100%" }}
        views={["month"]}
        components={{
          eventWrapper: (props) => (
            <CustomEventWrapper
              {...props}
              onCardClick={handleCardClick}
              onLeaveClick={handleLeaveClick}
            />
          ),
        }}
        onNavigate={handleNavigate}
        showAllEvents={true}
      />
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      ></Dialog>
    </Box>
  );
}
