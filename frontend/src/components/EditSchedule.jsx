import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import { forumToSGTime, forumToSGDate } from "../../config/convertTimeToSGT";
import { useEditSchedule } from "../hooks/Calendar/useEditSchedule";
import { dateToDBDate, dateTimeToDBDate } from "../../config/convertDateToDB";

function EditSchedule({ open, handleClose, scheduleInfo, refresh }) {
  const { editSchedule, isLoading, error } = useEditSchedule();
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (scheduleInfo) {
      setFormData(scheduleInfo);
    }
  }, [scheduleInfo]);

  const [errorState, setErrorState] = useState({
    employee_id: { error: false, message: "" },
  });
  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = () => {
    let isValid = true;
    // if (!formData.employee_id) {
    //   setError("employee_id", true, "Employee is required.");
    //   isValid = false;
    // } else {
    //   setError("employee_id", false, "");
    // }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    console.log(
      formData.schedule_id,
      formData.outlet_name,
      dateToDBDate(formData.start) + " " + formData.start_time,
      dateToDBDate(formData.start) + " " + formData.end_time,
      formData.vacancy
    );
    await editSchedule(
      formData.schedule_id,
      formData.outlet_name,
      dateToDBDate(formData.start) + " " + formData.start_time,
      dateToDBDate(formData.start) + " " + formData.end_time,
      formData.vacancy
    );
    refresh();
    handleClose();
  };

  const formFieldsLeft = [
    {
      id: "outlet_name",
      label: "Outlet",
      defaultValue: scheduleInfo.outlet_name,
      error: errorState.employee_id.error,
      helperText: errorState.employee_id.message,
    },
    {
      id: "start_time",
      label: "Shift Start",
      type: "time",
      value: forumToSGTime(scheduleInfo.start),
      defaultValue: forumToSGTime(scheduleInfo.start),
      error: errorState.employee_id.error,
      helperText: errorState.employee_id.message,
    },
    {
      id: "vacancy",
      label: "Vacancy",
      defaultValue: scheduleInfo.vacancy,
      error: errorState.employee_id.error,
      helperText: errorState.employee_id.message,
    },
  ];
  const formFieldsRight = [
    {
      id: "start",
      label: "Date",
      type: "Date",
      value: forumToSGDate(scheduleInfo.start),
      defaultValue: forumToSGDate(scheduleInfo.start),
      error: errorState.employee_id.error,
      helperText: errorState.employee_id.message,
    },

    {
      id: "end_time",
      label: "Shift Ends",
      type: "time",
      value: forumToSGTime(scheduleInfo.end),
      defaultValue: forumToSGTime(scheduleInfo.end),
      error: errorState.employee_id.error,
      helperText: errorState.employee_id.message,
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
      aria-labelledby="edit-shift-dialog-title"
    >
      <DialogTitle
        id="edit-shift-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Edit Shift
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography>
          Current Assigned: {scheduleInfo.employee} || {scheduleInfo.vacancy}{" "}
          Empty
        </Typography>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            {formFieldsLeft.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                {field.type == "select" ? (
                  <TextField
                    id={field.id}
                    name={field.id}
                    select
                    defaultValue={field.defaultValue}
                    value={field.value}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    fullWidth
                    error={field.error}
                    helperText={field.helperText}
                    color={field.error ? "error" : "primary"}
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
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
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
                  id={field.id}
                  fullWidth
                  variant="outlined"
                  defaultValue={field.defaultValue}
                  type={field.type}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.id]: e.target.value })
                  }
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
        <Button variant="contained" onClick={handleSubmit}>
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditSchedule.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditSchedule;
