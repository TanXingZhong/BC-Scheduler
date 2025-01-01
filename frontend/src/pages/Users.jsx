import { useEffect, useState, useCallback, useMemo } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { CircularProgress, Typography, Box, IconButton } from "@mui/material";
import { useGetUsersInfo } from "../hooks/useGetUsersInfo";
import { useUserContext } from "../hooks/useUserContext";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import Comfirmation from "../components/Comfirmation";
import UpdateUser from "../components/UpdateUser";
import { toSGDate } from "../../config/convertTimeToSGT";
import { dateTimeToDBDate } from "../../config/convertDateToDB";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    error: errorDelete,
  } = useDeleteUser();
  const {
    updateUser,
    isLoading: isLoadingUpdateUser,
    error: errorUpdateUser,
  } = useUpdateUser();

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
      valueFormatter: (params) => (params == 1 ? "True" : "False"),
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
      width: 100,
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
  const [userInfo, setUserInfo] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const rowsMemoized = useMemo(
    () => (user ? user.allDatas || [] : []),
    [user?.allDatas]
  );
  const [selectedEmail, setSelectedEmail] = useState("");

  const onLoad = async () => {
    try {
      await getUsersInfo();
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const handleClickOpenDelete = (x) => {
    setSelectedEmail(x);
    setOpenDelete(true);
  };
  const [loading, setLoading] = useState(false); // To track if data is loading
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

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length > 0 && allRoles.length > 0) {
      setOpenUpdate(true);
    }
  }, [userInfo, allRoles]);

  const handleClose = () => {
    setOpenDelete(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleUpdateUserInfo = async (data) => {
    try {
      data.dob = dateTimeToDBDate(data.dob);
      data.joinDate = dateTimeToDBDate(data.joinDate);
      await updateUser(data);
      await onLoad();
    } catch (err) {
      console.error(err);
    }
  };

  const handleContinue = async (email) => {
    try {
      await deleteUser(email);
      await onLoad();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
    setOpenDelete(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        All Users
      </Typography>
      <Comfirmation
        open={openDelete}
        handleClose={handleClose}
        handleContinue={handleContinue}
        email={selectedEmail}
      />
      {/* Conditionally render UpdateUser only when userInfo and allRoles are set */}
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
    </Box>
  );
};

export default Users;
