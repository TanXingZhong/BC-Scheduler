import { useEffect, useState, useCallback, useMemo, Fragment } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { useGetUsersInfo } from "../hooks/useGetUsersInfo";
import { useUserContext } from "../hooks/useUserContext";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useResetPassword } from "../hooks/useResetPassword";
import Comfirmation from "../components/Comfirmation";
import UpdateUser from "../components/UpdateUser";
import { toSGDate } from "../../config/convertTimeToSGT";
import { dateTimeToDBDate } from "../../config/convertDateToDB";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import LockResetIcon from "@mui/icons-material/LockReset";
import ResetPasswordForm from "../components/ResetPassword";
import Grid from "@mui/material/Grid2";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { useGetWorkingHours } from "../hooks/useGetWorkingHours";

const Users = () => {
  const { user } = useUserContext();
  const {
    getUsersInfo,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useGetUsersInfo();
  const {
    deleteUser,
    isLoading: isLoadingDelete,
    error: errorDeleteUser,
    success: successDeleteUser,
  } = useDeleteUser();
  const {
    updateUser,
    isLoading: isLoadingUpdateUser,
    error: errorUpdateUser,
    success: successUpdateUser,
  } = useUpdateUser();
  const {
    resetPasswordHook,
    isLoading: isLoadingResetPassword,
    error: errorResetPassword,
    success: successResetPassword,
  } = useResetPassword();

  const columns = [
    { field: "name", headerName: "Name", editable: false, width: 150 },
    { field: "nric", headerName: "NRIC", editable: true, width: 120 },
    { field: "email", headerName: "Email", editable: false, width: 150 },
    { field: "role_name", headerName: "Role", editable: false, width: 100 },
    {
      field: "phonenumber",
      headerName: "Phone Number",
      editable: false,
      width: 120,
    },
    { field: "sex", headerName: "Sex", editable: false, width: 70 },
    {
      field: "admin",
      headerName: "Admin Rights",
      valueFormatter: (params) => (params == 1 ? "True" : "False"),
      editable: false,
      width: 150,
    },
    {
      field: "leaves",
      headerName: "Leaves",
      editable: false,
      width: 80,
    },
    {
      field: "offs",
      headerName: "Offs",
      editable: false,
      width: 80,
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      editable: false,
      width: 110,
      valueFormatter: (params) => toSGDate(params),
    },
    { field: "bankName", headerName: "Bank Name", editable: false, width: 150 },
    {
      field: "bankAccountNo",
      headerName: "Bank Account No",
      editable: false,
      width: 150,
    },
    { field: "address", headerName: "Address", editable: false, width: 150 },
    {
      field: "workplace",
      headerName: "Workplace",
      editable: false,
      width: 150,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      editable: false,
      width: 150,
    },
    {
      field: "active",
      headerName: "Active",
      editable: false,
      valueFormatter: (params) => (params == 1 ? "True" : "False"),
    },
    {
      field: "driverLicense",
      headerName: "Driver License",
      editable: false,
      width: 120,
      valueFormatter: (params) => (params == 1 ? "True" : "False"),
    },
    {
      field: "firstAid",
      headerName: "First Aid",
      editable: false,
      width: 70,
    },
    {
      field: "joinDate",
      headerName: "Join Date",
      width: 110,
      editable: false,
      valueFormatter: (params) => toSGDate(params),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 125,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box>
          <IconButton
            sx={{
              border: "none",
              borderRadius: "50%",
            }}
            aria-label="edit"
            onClick={() => handleClickOpenUpdate(params.row)}
          >
            <EditIcon fontSize="small" sx={{ color: "blue" }} />
          </IconButton>

          <IconButton
            sx={{
              border: "none",
              borderRadius: "50%",
            }}
            aria-label="edit"
            onClick={() => handleClickOpenResetPassword(params.row)}
          >
            <LockResetIcon fontSize="small" sx={{ color: "green" }} />
          </IconButton>

          <IconButton
            sx={{
              border: "none",
              borderRadius: "50%",
            }}
            aria-label="delete"
            onClick={() => handleClickOpenDelete(params.row.email)}
          >
            <DeleteIcon fontSize="small" sx={{ color: "red" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const [resetPassword, setResetPassword] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
  const [openUpdateSnackbar, setOpenUpdateSnackbar] = useState(false);
  const [openResetPasswordSnackbar, setOpenResetPasswordSnackbar] =
    useState(false);

  const rowsMemoized = useMemo(
    () => (user ? user.allDatas || [] : []),
    [user?.allDatas]
  );
  const [selectedEmail, setSelectedEmail] = useState("");

  const onLoad = async () => {
    await getUsersInfo();
  };

  const handleClickOpenDelete = (x) => {
    setSelectedEmail(x);
    setOpenDelete(true);
  };
  const [loading, setLoading] = useState(false);
  const [isLoadingResetPW, setIsLoadingResetPW] = useState(false);

  const handleClickOpenUpdate = useCallback((x) => {
    setLoading(true); // Set loading to true when the dialog is opened
    setUserInfo({});
    setAllRoles([]);

    // Simulate data fetching or just set the data
    setTimeout(() => {
      setUserInfo(x);
      setAllRoles(user.allRoles);
      setLoading(false); // Once the data is set, set loading to false
    }, 0);
  });

  const handleClickOpenResetPassword = useCallback((x) => {
    setIsLoadingResetPW(true);
    setResetPassword({});

    const data = {
      user_id: x.id,
    };

    setTimeout(() => {
      setResetPassword(data);
      setIsLoadingResetPW(false);
    }, 0);
  });

  const handleClickReset = () => {
    setOpenResetPasswordSnackbar(true);
  };

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length > 0 && allRoles.length > 0) {
      setOpenUpdate(true);
    }
  }, [userInfo, allRoles]);

  useEffect(() => {
    if (resetPassword) {
      setOpenResetPassword(true);
    }
  }, [resetPassword]);

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleCloseResetPassword = () => {
    setOpenResetPassword(false);
  };

  const handleUpdateUserInfo = async (data) => {
    data.dob = dateTimeToDBDate(data.dob);
    data.joinDate = dateTimeToDBDate(data.joinDate);
    await updateUser(data);
    handleClickUpdate();
    await onLoad();
  };

  const handleResetPassword = async (data) => {
    await resetPasswordHook(data);
    handleClickReset();
    await onLoad();
    setOpenResetPassword(true);
  };

  const handleContinue = async (email) => {
    await deleteUser(email);
    handleClickDelete();
    await onLoad();
    setOpenDelete(false);
  };

  const handleClickUpdate = () => {
    setOpenUpdateSnackbar(true);
  };

  const handleCloseUpdateSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenUpdateSnackbar(false);
  };

  const handleCloseResetPasswordSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenResetPasswordSnackbar(false);
  };

  const actionUpdate = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseUpdateSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  const actionResetPassword = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleCloseResetPasswordSnackbar}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const handleClickDelete = () => {
    setOpenDeleteSnackbar(true);
  };

  const handleCloseDeleteSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteSnackbar(false);
  };

  const actionDelete = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseDeleteSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  // Working Report Functions and Constants
  const reportColumns = [
    { field: "name", headerName: "Name", editable: false, width: 150 },
    { field: "role", headerName: "Role", editable: false, width: 100 },
    { field: "email", headerName: "Email", editable: false, width: 150 },
    {
      field: "phonenumber",
      headerName: "Phone Number",
      editable: false,
      width: 120,
    },
    {
      field: "bankName",
      headerName: "Bank Name",
      editable: false,
      width: 100,
    },
    {
      field: "bankAccountNo",
      headerName: "Bank Account No",
      editable: false,
      width: 150,
    },
    {
      field: "total_shifts",
      headerName: "Total Shifts",
      editable: false,
      width: 100,
    },
    {
      field: "total_hours",
      headerName: "Hours",
      editable: false,
      width: 100,
    },
    {
      field: "total_minutes",
      headerName: "Minutes",
      editable: false,
      width: 100,
    },
  ];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorState, setErrorState] = useState({
    startDate: { error: false, message: "" },
    endDate: { error: false, message: "" },
  });

  const formFieldsLeft = [
    {
      id: "startDate",
      label: "Start Date",
      type: "date",
      error: errorState.startDate.error,
      helperText: errorState.startDate.message,
    },
  ];
  const formFieldsRight = [
    {
      id: "endDate",
      label: "End Date",
      type: "date",
      error: errorState.endDate.error,
      helperText: errorState.endDate.message,
    },
  ];

  const { getWorkingHours, error, isLoading, success } = useGetWorkingHours();
  const [allWorkingHours, setAllWorkingHours] = useState([]);

  const setError = (field, error, message) => {
    setErrorState((prevState) => ({
      ...prevState,
      [field]: { error, message },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateInputs();
    if (!isValid) {
      return;
    }

    let dbStartDate = startDate;
    let dbEndDate = endDate;

    dbEndDate = dateTimeToDBDate(new Date(dbEndDate).setHours(23, 59, 0, 0));
    dbStartDate = dateTimeToDBDate(new Date(dbStartDate).setHours(0, 0, 0, 0));

    const data = await getWorkingHours(dbStartDate, dbEndDate);

    if (data) setAllWorkingHours(data);
  };

  const handleDateChange = (field, value) => {
    if (field === "startDate") {
      setStartDate(value);
    } else if (field === "endDate") {
      setEndDate(value);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!endDate == null || endDate.length < 1) {
      setError("endDate", true, "End Date is required.");
      isValid = false;
    } else {
      setError("endDate", false, "");
    }

    if (!startDate == null || startDate.length < 1) {
      setError("startDate", true, "Start Date is required.");
      isValid = false;
    } else {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const check = endDateObj < startDateObj;

      if (check) {
        setError("startDate", true, "Start Date has to be before End Date.");
        isValid = false;
      } else {
        setError("startDate", false, "");
      }
    }

    return isValid;
  };

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {}, [resetPassword]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px", minHeight: "100vh" },
      }}
    >
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        All Users
      </Typography>
      <Comfirmation
        open={openDelete}
        handleClose={handleCloseUpdate}
        handleContinue={handleContinue}
        email={selectedEmail}
      />

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Loading user informations...
          </Typography>
          <CircularProgress sx={{ ml: 2 }} />
        </Box>
      ) : userInfo && allRoles.length > 0 ? (
        <UpdateUser
          open={openUpdate}
          handleClose={handleCloseUpdate}
          handleUpdateUserInfo={handleUpdateUserInfo}
          userInfo={userInfo}
          allRoles={allRoles}
        />
      ) : (
        <>
          {openUpdate && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              Failed to load user data or roles. Please try again later.
            </Typography>
          )}
        </>
      )}

      {!isLoadingResetPW && resetPassword && (
        <ResetPasswordForm
          open={openResetPassword}
          handleClose={handleCloseResetPassword}
          handleResetPassword={handleResetPassword}
          userId={resetPassword.user_id}
        />
      )}

      <DataGrid
        checkboxSelection
        rows={rowsMemoized}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "secondary.main",
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
      />
      <Snackbar
        open={openUpdateSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseUpdateSnackbar}
        message={successUpdateUser ? successUpdateUser : errorUpdateUser}
        action={actionUpdate}
      />
      <Snackbar
        open={openResetPasswordSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseResetPasswordSnackbar}
        message={
          successResetPassword ? successResetPassword : errorResetPassword
        }
        action={actionResetPassword}
      />
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseDeleteSnackbar}
        message={successDeleteUser ? successDeleteUser : errorDeleteUser}
        action={actionDelete}
      />

      <Typography component="h2" variant="h6" sx={{ mb: 2 }} marginTop={"20px"}>
        Working Hours Report
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: { xs: "100%", sm: "60%", lg: "40%" } }}
      >
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            {formFieldsLeft.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                <TextField
                  autoComplete="startDate"
                  name="startDate"
                  id="startDate"
                  fullWidth
                  variant="outlined"
                  type="date"
                  value={startDate} // Bind the value to state
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  } // Update state on change
                  error={errorState.startDate.error}
                  helperText={errorState.startDate.message}
                />
              </FormControl>
            ))}
          </Grid>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ marginTop: { xs: "-30px", md: "0px" } }}
          >
            {formFieldsRight.map((field) => (
              <FormControl key={field.id} fullWidth sx={{ marginBottom: 2 }}>
                <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
                <TextField
                  autoComplete="endDate"
                  name="endDate"
                  id="endDate"
                  fullWidth
                  variant="outlined"
                  type="date"
                  value={endDate} // Bind the value to state
                  onChange={(e) => handleDateChange("endDate", e.target.value)} // Update state on change
                  error={errorState.endDate.error}
                  helperText={errorState.endDate.message}
                />
              </FormControl>
            ))}
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained">
          Generate Report
        </Button>
        <div style={{ padding: "0px 0px 20px 0px" }} />
      </Box>
      <DataGrid
        checkboxSelection
        rows={allWorkingHours}
        columns={reportColumns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        getRowId={(row) => row.user_id}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "secondary.main",
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Box>
  );
};

export default Users;
