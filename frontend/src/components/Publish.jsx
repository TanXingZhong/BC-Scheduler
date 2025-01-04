import { useState, useEffect } from "react";
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
  Switch,
  Box,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import CircularProgress from "@mui/material/CircularProgress";

function Publish({ open, handleContinue, handleClose, names }) {
  const [loading, setLoading] = useState(false);
  const [defaultError, setDefaultError] = useState({
    error: false,
    message: "",
  });
  const [errorState, setErrorState] = useState({
    outlet_name: defaultError,
    vacancy: defaultError,
    date: defaultError,
    start_time: defaultError,
    end_time: defaultError,
    cycleStart: defaultError,
    cycleEnd: defaultError,
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
  const [show, setShow] = useState(false);

  useEffect(() => {
    setRepeat("Never");
    setSelectedDays([]);
    setCycleStart("");
    setCycleEnd("");
    setEmployee;
  }, []);

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
      }
      if (document.getElementById("vacancy").value <= 0) {
        setError("vacancy", true, "Vacancy should be more then 1.");
        isValid = false;
      } else {
        if (document.getElementById("vacancy").value >= 6) {
          setError("vacancy", true, "Vacancy should not be more then 5.");
          isValid = false;
        }
      }

      if (employee.length > 0) {
        if (document.getElementById("vacancy").value < employee.length) {
          setError(
            "vacancy",
            true,
            "Vacancy should be more than the number of employees assigned."
          );
          isValid = false;
        }
      }
    });
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    const outletName = document.getElementById("outlet_name").value.trim();
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("start_time").value;
    const endTime = document.getElementById("end_time").value;
    const vacancy = parseInt(document.getElementById("vacancy").value);
    const dateObj = new Date(date);
    const formattedDate = dateObj.toISOString().split("T")[0];
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

    await handleContinue(
      outletName,
      formattedDate,
      startTime,
      endTime,
      vacancy,
      validDays,
      startDateObj,
      endDateObj,
      diffInDays,
      interval,
      employee,
      show
    );
    setLoading(false);
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
        handleClose();
      }}
      aria-labelledby="create-role-dialog-title"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle id="create-role-dialog-title">
        Create Schedule{" "}
        <Box
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ marginRight: 1 }}>Show</Typography>
          <Switch
            name="goat"
            onChange={(x) => setShow(x.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase": { color: "gray" }, // Default color
              "& .MuiSwitch-switchBase.Mui-checked": { color: "blue" }, // Checked color
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "blue",
              }, // Checked track color
              "& .MuiSwitch-track": { backgroundColor: "gray" }, // Default track color
            }}
          />
        </Box>
      </DialogTitle>
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
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Box sx={{ m: 1, position: "relative" }}>
          <Button variant="contained" disabled={loading} type="submit">
            Create
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: green[500],
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

Publish.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Publish;
