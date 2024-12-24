import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import { useCreateSchedule } from "../hooks/Calendar/useCreateSchedule";

function Publish({ open, handleClose }) {
  const [errorState, setErrorState] = useState({
    outlet_name: { error: false, message: "" },
    vacancy: { error: false, message: "" },
    start_date: { error: false, message: "" },
    end_date: { error: false, message: "" },
    start_time: { error: false, message: "" },
    end_time: { error: false, message: "" },
  });
  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = () => {
    const fields = [
      { id: "outlet_name", errorMessage: "Outlet name is required." },
      { id: "vacancy", errorMessage: "Vacancy is required." },
      { id: "start_date", errorMessage: "Start date is required." },
      { id: "end_date", errorMessage: "End date is required." },
      { id: "start_time", errorMessage: "Start time is required." },
      { id: "end_time", errorMessage: "End time is required." },
    ];

    let isValid = true;

    fields.forEach((field) => {
      const element = document.getElementById(field.id);
      if (!element.value || element.value.length < 1) {
        setError(field.id, true, field.errorMessage);
        isValid = false;
      } else {
        setError(field.id, false, "");
      }
    });

    return isValid;
  };
  const { createSchedule, error, isLoading } = useCreateSchedule();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }
    // const role_name = document.getElementById("role_name").value;
    const outlet_name = document.getElementById("outlet_name").value;
    const start_date = document.getElementById("start_date").value;
    const end_date = document.getElementById("end_date").value;
    const start_time = document.getElementById("start_time").value;
    const end_time = document.getElementById("end_time").value;
    const vacancy = document.getElementById("vacancy").value;
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    const amt = endDateObj - startDateObj;
    const diffInDays = amt / (1000 * 60 * 60 * 24);
    const schedulePromisesArr = [];
    for (let i = 0; i <= diffInDays; i++) {
      const date = new Date(start_date);
      date.setDate(date.getDate() + i);
      const formatted_date = date.toISOString().split("T")[0];
      const schedulePromise = createSchedule(
        outlet_name,
        formatted_date + " " + start_time,
        formatted_date + " " + end_time,
        vacancy
      );
      schedulePromisesArr.push(schedulePromise);
    }
    try {
      await Promise.all(schedulePromisesArr);
    } catch (error) {
      console.error("Error creating schedules:", error);
    }
    handleClose();
  };
  const formFieldsLeft = [
    {
      id: "outlet_name",
      label: "Outlet",
      error: errorState.outlet_name.error,
      helperText: errorState.outlet_name.message,
    },
    {
      id: "start_date",
      label: "Start",
      type: "date",
      error: errorState.start_date.error,
      helperText: errorState.start_date.message,
    },
    {
      id: "start_time",
      label: "Start",
      type: "time",
      error: errorState.start_time.error,
      helperText: errorState.start_time.message,
    },
  ];
  const formFieldsRight = [
    {
      id: "vacancy",
      label: "Vacancy",
      placeholder: "1",
      type: "number",
      error: errorState.vacancy.error,
      helperText: errorState.vacancy.message,
    },
    {
      id: "end_date",
      label: "End",
      type: "date",
      error: errorState.end_date.error,
      helperText: errorState.end_date.message,
    },
    {
      id: "end_time",
      label: "End",
      type: "time",
      error: errorState.end_time.error,
      helperText: errorState.end_time.message,
    },
  ];
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        // Prevent closing on backdrop click or escape
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        handleClose;
      }}
      aria-labelledby="create-role-dialog-title"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle id="create-role-dialog-title">Create Schedule</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            {formFieldsLeft.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                {field.type == "select" ? (
                  <TextField
                    required
                    id={field.id}
                    name={field.id}
                    select
                    value={field.value}
                    onChange={(e) => setSex(e.target.value)}
                    fullWidth
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
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
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
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
