import { useEffect, useState, useCallback, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Box, Link } from "@mui/material";
import { useGetUsersInfo } from "../hooks/useGetUsersInfo";
import { useUserContext } from "../hooks/useUserContext";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import Comfirmation from "../components/Comfirmation";
import UpdateUser from "../components/UpdateUser";
import { toSGDate } from "../../config/convertTimeToSGT";
import { dateToDBDate, joinDateToDBDate } from "../../config/convertDateToDB";

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
    { field: "id", headerName: "User ID", editable: false, width: 70 },
    { field: "name", headerName: "Name", editable: false, width: 150 },
    { field: "nric", headerName: "NRIC", editable: true, width: 120 },
    { field: "email", headerName: "Email", editable: false, width: 150 },
    { field: "roles", headerName: "Role", editable: false, width: 100 },
    {
      field: "phonenumber",
      headerName: "Phone Number",
      editable: false,
      width: 120,
    },
    { field: "sex", headerName: "Sex", editable: false, width: 70 },
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Center horizontally within the Box
            alignItems: "center", // Center vertically within the Box
            width: "100%",
          }}
        >
          <Link
            component="button"
            onClick={() => handleClickOpenUpdate(params.row)}
            variant="body2"
            underline="hover"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              textAlign: "center", // Center the text inside the link
              display: "flex", // Set Link to use flexbox
              justifyContent: "center", // Center the content of Link
              alignItems: "center", // Center vertically
              padding: 1, // Optional: add padding inside Link for better spacing
            }}
          >
            Edit
          </Link>
          <Link
            component="button"
            onClick={() => handleClickOpenDelete(params.row.email)}
            variant="body2"
            underline="hover"
            sx={{
              color: "error.main",
              fontWeight: "bold",
              textAlign: "center", // Center the text inside the link
              display: "flex", // Set Link to use flexbox
              justifyContent: "center", // Center the content of Link
              alignItems: "center", // Center vertically
              padding: 1, // Optional: add padding inside Link for better spacing
            }}
          >
            Delete
          </Link>
        </Box>
      ),
    },
  ];
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const rowsMemoized = useMemo(() => user || [], [user]);
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

  const handleClickOpenUpdate = useCallback((x) => {
    setUserInfo({});
    setTimeout(() => {
      setUserInfo(x);
    }, 0);
  });

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length > 0) {
      setOpenUpdate(true);
    }
  }, [userInfo]);

  const handleClose = () => {
    setOpenDelete(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleUpdateUserInfo = async (data) => {
    try {
      await updateUser(
        data.name,
        data.nric,
        data.email,
        data.phonenumber,
        data.sex,
        dateToDBDate(data.dob),
        data.bankName,
        data.bankAccountNo,
        data.address,
        data.workplace,
        data.occupation,
        data.driverLicense,
        data.firstAid,
        joinDateToDBDate(data.joinDate),
        data.roles,
        data.active
      );
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
      <Comfirmation
        open={openDelete}
        handleClose={handleClose}
        handleContinue={handleContinue}
        email={selectedEmail}
      />
      <UpdateUser
        open={openUpdate}
        handleClose={handleCloseUpdate}
        handleUpdateUserInfo={handleUpdateUserInfo}
        userInfo={userInfo}
      />
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        All Users
      </Typography>
      <DataGrid
        checkboxSelection
        rows={rowsMemoized}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
      />
    </Box>
  );
};

export default Users;
