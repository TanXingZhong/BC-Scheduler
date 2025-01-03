import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  IconButton,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import { forumToSGTime, forumToSGDate } from "../../config/convertTimeToSGT";
import { useEditSchedule } from "../hooks/Calendar/useEditSchedule";
import { dateToDBDate, dateTimeToDBDate } from "../../config/convertDateToDB";
import CloseIcon from "@mui/icons-material/Close";

function EditSchedule({ open, handleClose, scheduleInfo, refresh }) {
  const { editSchedule, isLoading, error, success } = useEditSchedule();
  const [openEditSB, setOpenEditSB] = useState(false);
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (scheduleInfo) {
      setFormData(scheduleInfo);
    }
  }, [scheduleInfo]);

  const handleCloseEditSB = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenEditSB(false);
  };

  const actionEdit = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleCloseEditSB}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const [errorState, setErrorState] = useState({
    outlet_name: { error: false, message: "" },
    start_time: { error: false, message: "" },
    vacancy: { error: false, message: "" },
    start: { error: false, message: "" },
    end_time: { error: false, message: "" },
  });
  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const validateInputs = () => {
    let isValid = true;
    if (!formData.outlet_name) {
      setError("outlet_name", true, "Outlet is required.");
      isValid = false;
    } else {
      setError("outlet_name", false, "");
    }
    if (!formData.start_time) {
      setError("start_time", true, "Shift start is required.");
      isValid = false;
    } else {
      setError("start_time", false, "");
    }

    if (!formData.start) {
      setError("start", true, "Date is required.");
      isValid = false;
    } else {
      setError("start", false, "");
    }
    if (!formData.end_time) {
      setError("end_time", true, "Shift end is required.");
      isValid = false;
    } else {
      setError("end_time", false, "");
    }

    if (parseInt(formData.vacancy) < 0) {
      setError("vacancy", true, "Vacancy should be more then 1.");
      isValid = false;
    } else {
      if (parseInt(formData.vacancy) >= 6) {
        setError("vacancy", true, "Vacancy should not be more then 5.");
        isValid = false;
      } else {
        setError("vacancy", false, "");
      }
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    await editSchedule(
      formData.schedule_id,
      formData.outlet_name,
      dateToDBDate(formData.start) + " " + formData.start_time,
      dateToDBDate(formData.start) + " " + formData.end_time,
      formData.vacancy
    );
    setOpenEditSB(true);
    refresh();
  };

  const formFieldsLeft = [
    {
      id: "outlet_name",
      label: "Outlet",
      defaultValue: scheduleInfo.outlet_name,
      error: errorState.outlet_name.error,
      helperText: errorState.outlet_name.message,
    },
    {
      id: "start_time",
      label: "Shift Start",
      type: "time",
      value: scheduleInfo.start_time,
      defaultValue: scheduleInfo.start_time,
      error: errorState.start_time.error,
      helperText: errorState.start_time.message,
    },
    {
      id: "vacancy",
      label: "Vacancy",
      type: "number",
      defaultValue: scheduleInfo.vacancy,
      error: errorState.vacancy.error,
      helperText: errorState.vacancy.message,
    },
  ];
  const formFieldsRight = [
    {
      id: "start",
      label: "Date",
      type: "Date",
      value: forumToSGDate(scheduleInfo.start),
      defaultValue: forumToSGDate(scheduleInfo.start),
      error: errorState.start.error,
      helperText: errorState.start.message,
    },

    {
      id: "end_time",
      label: "Shift Ends",
      type: "time",
      value: scheduleInfo.end_time,
      defaultValue: scheduleInfo.end_time,
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
      <Snackbar
        open={openEditSB}
        autoHideDuration={6000}
        onClose={handleCloseEditSB}
        message={success ? success : error}
        action={actionEdit}
      />
    </Dialog>
  );
}

EditSchedule.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditSchedule;
