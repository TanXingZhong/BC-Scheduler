import { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Chip,
  OutlinedInput,
  Select,
  TextField,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import { useCreateSchedule } from "../hooks/Calendar/useCreateSchedule";
import { useCreateAdd } from "../hooks/Calendar/useCreateAdd";

function Publish({ open, handleClose, names, refresh }) {
  const [errorState, setErrorState] = useState({
    outlet_name: { error: false, message: "" },
    vacancy: { error: false, message: "" },
    date: { error: false, message: "" },
    start_time: { error: false, message: "" },
    end_time: { error: false, message: "" },
    cycleStart: { error: false, message: "" },
    cycleEnd: { error: false, message: "" },
  });
  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };
  const [repeat, setRepeat] = useState("Never");
  const [selectedDays, setSelectedDays] = useState([]);
  const [cycleStart, setCycleStart] = useState("");
  const [cycleEnd, setCycleEnd] = useState("");
  const [employee, setEmployee] = useState([]);
  const { createSchedule, error, isLoading } = useCreateSchedule();

  const reset = () => {
    setRepeat("Never");
    setSelectedDays([]);
    setCycleStart("");
    setCycleEnd("");
    setEmployee([]);
  };
  const {
    createAdd,
    error: createAddError,
    isLoading: createAddLoading,
  } = useCreateAdd();

  const handleChange = (event) => {
    setEmployee(event.target.value);
  };

  const handleDaySelection = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const transformDataForUserInfo = names.map((x) => {
    return {
      value: x.id,
      label: `${x.name} (${x.role_name})`,
    };
  });

  const validateInputs = () => {
    const fields = [
      { id: "outlet_name", errorMessage: "Outlet name is required." },
      { id: "vacancy", errorMessage: "Vacancy is required." },
      { id: "date", errorMessage: "Date is required." },
      { id: "start_time", errorMessage: "Start time is required." },
      { id: "end_time", errorMessage: "End time is required." },
    ];

    let isValid = true;

    fields.forEach((field) => {
      const element = document.getElementById(field.id);
      if (!element || !element.value || element.value.length < 1) {
        setError(field.id, true, field.errorMessage);
        isValid = false;
      } else {
        setError(field.id, false, "");
      }
      const startDateObj = new Date(cycleStart);
      const endDateObj = new Date(cycleEnd);
      const diffInDays = Math.floor(endDateObj - startDateObj);
      const startTime = document.getElementById("start_time").value;
      const endTime = document.getElementById("end_time").value;
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      if (repeat !== "Never") {
        if (!cycleStart || cycleStart.length < 1) {
          setError("cycleStart", true, "Date is required.");
          isValid = false;
        } else {
          setError("cycleStart", false, "");
        }
        if (!cycleEnd || cycleEnd.length < 1) {
          setError("cycleEnd", true, "Date is required.");
          isValid = false;
        } else {
          setError("cycleEnd", false, "");
        }
        if (diffInDays < 0) {
          setError("cycleEnd", true, "Date should be after cycle start date.");
          isValid = false;
        }
        if (startTotalMinutes > endTotalMinutes) {
          setError("end_time", true, "End time should be after start time.");
          isValid = false;
        }
      }
      if (document.getElementById("vacancy").value <= 0) {
        setError("vacancy", true, "Vacancy should be more then 1.");
        isValid = false;
      }
      if (document.getElementById("vacancy").value < employee.length) {
        setError(
          "vacancy",
          true,
          "Vacancy should be more than the number of employees assigned."
        );
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }

    const schedulePromisesArr = [];
    const outletName = document.getElementById("outlet_name").value.trim();
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("start_time").value;
    const endTime = document.getElementById("end_time").value;
    const vacancy = parseInt(document.getElementById("vacancy").value);

    const dateObj = new Date(date);
    const formattedDate = dateObj.toISOString().split("T")[0];
    if (employee.length > 0) {
      schedulePromisesArr.push(
        createAdd(
          outletName,
          `${formattedDate} ${startTime}`,
          `${formattedDate} ${endTime}`,
          vacancy,
          employee
        )
      );
    } else {
      schedulePromisesArr.push(
        createSchedule(
          outletName,
          `${formattedDate} ${startTime}`,
          `${formattedDate} ${endTime}`,
          vacancy
        )
      );
    }

    const dayMapping = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    const validDays = selectedDays.map((day) => dayMapping[day]);
    const startDateObj = new Date(cycleStart);
    const endDateObj = new Date(cycleEnd);

    const diffInDays = Math.floor(
      (endDateObj - startDateObj) / (1000 * 60 * 60 * 24)
    );
    const interval =
      repeat === "Every Week"
        ? 7
        : repeat === "Every 2 Weeks"
        ? 14
        : repeat === "Every 3 Weeks"
        ? 21
        : 1;
    for (let i = 0; i <= diffInDays; i += interval) {
      for (let j = i; j < i + 7 && j <= diffInDays; j++) {
        const currentDay = new Date(startDateObj);
        currentDay.setDate(currentDay.getDate() + j);
        if (
          !validDays.includes(currentDay.getDay()) ||
          currentDay.toISOString() == dateObj.toISOString()
        ) {
          continue;
        }
        const currentFormattedDate = currentDay.toISOString().split("T")[0];
        if (employee.length > 0) {
          schedulePromisesArr.push(
            createAdd(
              outletName,
              `${currentFormattedDate} ${startTime}`,
              `${currentFormattedDate} ${endTime}`,
              vacancy,
              employee
            )
          );
        } else {
          schedulePromisesArr.push(
            createSchedule(
              outletName,
              `${currentFormattedDate} ${startTime}`,
              `${currentFormattedDate} ${endTime}`,
              vacancy
            )
          );
        }
      }
    }
    try {
      await Promise.all(schedulePromisesArr);
      await refresh();
      reset();
      handleClose();
    } catch (error) {
      console.error("Error creating schedules:", error);
    }
  };

  const formFieldsLeft = [
    {
      id: "outlet_name",
      label: "Outlet",
      error: errorState.outlet_name.error,
      helperText: errorState.outlet_name.message,
    },
    {
      id: "start_time",
      label: "Shift Start",
      type: "time",
      error: errorState.start_time.error,
      helperText: errorState.start_time.message,
    },
    {
      id: "assign",
      label: "Employee",
      type: "select",
      value: employee,
      options: transformDataForUserInfo,
      error: errorState.end_time.error,
      helperText: errorState.end_time.message,
    },
  ];
  const formFieldsRight = [
    {
      id: "date",
      label: "Date",
      type: "date",
      error: errorState.date.error,
      helperText: errorState.date.message,
    },
    {
      id: "end_time",
      label: "Shift Ends",
      type: "time",
      error: errorState.end_time.error,
      helperText: errorState.end_time.message,
    },
    {
      id: "vacancy",
      label: "Vacancy",
      placeholder: "1",
      type: "number",
      error: errorState.vacancy.error,
      helperText: errorState.vacancy.message,
    },
  ];
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        reset();
        handleClose();
      }}
      aria-labelledby="create-role-dialog-title"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle id="create-role-dialog-title">Create Schedule</DialogTitle>
      <DialogContent sx={{ gap: 2 }}>
        <Grid container spacing={5}>
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            {formFieldsLeft.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                {field.type === "select" ? (
                  <Select
                    size="auto"
                    labelId={field.id}
                    id={field.id}
                    multiple
                    value={field.value}
                    onChange={handleChange}
                    input={
                      <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((id) => {
                          const selectedOption = field.options.find(
                            (option) => option.value === id
                          );
                          return (
                            <Chip
                              key={id}
                              label={selectedOption ? selectedOption.label : id}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <TextField
                    autoComplete={field.id}
                    name={field.id}
                    id={field.id}
                    fullWidth
                    variant="outlined"
                    defaultValue={field.defaultValue}
                    type={field.type}
                    placeholder={field.placeholder}
                    error={field.error}
                    helperText={field.helperText}
                    color={field.error ? "error" : "primary"}
                  />
                )}
              </FormControl>
            ))}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {formFieldsRight.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                <TextField
                  autoComplete={field.id}
                  name={field.id}
                  fullWidth
                  defaultValue={field.defaultValue}
                  options={field.options}
                  type={field.type}
                  id={field.id}
                  placeholder={field.placeholder}
                  error={field.error}
                  helperText={field.helperText}
                  color={field.error ? "error" : "primary"}
                />
              </FormControl>
            ))}
          </Grid>
        </Grid>
        <FormControl fullWidth>
          <FormLabel>Repeat</FormLabel>
          <TextField
            select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
          >
            <MenuItem value="Never">Never</MenuItem>
            <MenuItem value="Every Week">Every Week</MenuItem>
            <MenuItem value="Every 2 Weeks">Every 2 Weeks</MenuItem>
            <MenuItem value="Every 3 Weeks">Every 3 Weeks</MenuItem>
          </TextField>
        </FormControl>

        {repeat !== "Never" && (
          <>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Days of the Week</FormLabel>
              <Grid container spacing={1}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <Grid key={day}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedDays.includes(day)}
                            onChange={() => handleDaySelection(day)}
                          />
                        }
                        label={day}
                      />
                    </Grid>
                  )
                )}
              </Grid>
            </FormControl>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormLabel>Cycle Start</FormLabel>
                <TextField
                  type="date"
                  fullWidth
                  error={errorState.cycleStart.error}
                  helperText={errorState.cycleStart.message}
                  value={cycleStart}
                  onChange={(e) => setCycleStart(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormLabel>Cycle End</FormLabel>
                <TextField
                  type="date"
                  fullWidth
                  error={errorState.cycleEnd.error}
                  helperText={errorState.cycleEnd.message}
                  value={cycleEnd}
                  onChange={(e) => setCycleEnd(e.target.value)}
                />
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button
          onClick={() => {
            reset();
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Publish.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Publish;
