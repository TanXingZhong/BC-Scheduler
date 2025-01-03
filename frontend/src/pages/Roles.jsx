import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  CircularProgress,
  Typography,
  Button,
  Box,
  IconButton,
  FormControl,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { useGetRoles } from "../hooks/Roles/useGetRoles";
import CorfirmationToDeleteRole from "../components/CorfirmationToDeleteRole";
import { useDeleteRole } from "../hooks/Roles/useDeleteRole";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ViewMember from "../components/ViewMember";
import EditRole from "../components/EditRole";
import { useEditRole } from "../hooks/Roles/useEditRole";
import CreateRole from "../components/CreateRole";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const Roles = () => {
  const { fetchRoles, isLoading, error } = useGetRoles(); // Use the custom hook
  const {
    editRole,
    isLoading: isLoadingEditRole,
    error: errorEditRole,
    success: successEditRole,
  } = useEditRole();
  const {
    deleteRole,
    isLoading: isLoadingDeleteRole,
    error: errorDeleteRole,
    success: successDeleteRole,
  } = useDeleteRole();
  const columns = [
    {
      field: "color",
      headerName: "Color",
      width: 70,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              backgroundColor: params.value,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              border: "1px solid #ccc",
            }}
          />
        </Box>
      ),
    },
    { field: "role_name", headerName: "Roles", editable: false, width: 250 },
    {
      field: "user_count",
      headerName: "Members",
      editable: false,
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Center horizontally within the Box
            alignItems: "center", // Center vertically within the Box
            width: "100%",
            gap: 1, // Adds space between the number and the icon
          }}
        >
          <span
            onClick={() => handleViewMembers(params.row)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px", // Adds space between the number and the icon
            }}
          >
            <span>{params.row.user_count}</span> {/* User count */}
            <PeopleRoundedIcon
              sx={{
                fontSize: 18, // Adjust icon size
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.2)", // Slightly enlarge the icon on hover
                },
              }}
            />
          </span>
        </Box>
      ),
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
            onClick={() => handleClickOpenEditRole(params.row)}
          >
            <EditIcon fontSize="small" sx={{ color: "blue" }} />
          </IconButton>
          <IconButton
            sx={{
              border: "none",
              borderRadius: "50%",
            }}
            aria-label="delete"
            onClick={() => handleClickOpenRoleDelete(params.row.role_name)}
          >
            <DeleteIcon fontSize="small" sx={{ color: "red" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const [openRoleDelete, setOpenRoleDelete] = useState(false);
  const [role_name, setRole_name] = useState("");
  const [data, setData] = useState([]);
  const [openViewMember, setOpenViewMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [openEditRole, setOpenEditRole] = useState(false);
  const [roleInfo, setRoleInfo] = useState([]);
  const [openCreateRole, setOpenCreateRole] = useState(false);
  const [openSB, setOpenSB] = useState(false);
  const [updateSB, setUpdateSB] = useState(false);

  const handleCloseSB = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSB(false);
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      sx={{
        border: "none",
        borderRadius: "50%",
      }}
      onClick={handleCloseSB}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const handleCloseUpdateSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setUpdateSB(false);
  };

  const actionUpdate = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      sx={{
        border: "none",
        borderRadius: "50%",
      }}
      onClick={handleCloseUpdateSnackbar}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const onLoad = async () => {
    const val = await fetchRoles();
    setData(val);
  };
  useEffect(() => {
    onLoad();
  }, []);

  const handleCloseEditRole = () => {
    setOpenEditRole(false);
  };

  const handleCloseRoleDelete = () => {
    setOpenRoleDelete(false);
  };

  const handleCloseViewMember = () => {
    setOpenViewMember(false);
  };

  const handleCloseCreateRole = () => {
    setOpenCreateRole(false);
  };

  const handleClickOpenRoleDelete = (x) => {
    setOpenRoleDelete(true);
    setRole_name(x);
  };

  const handleViewMembers = (x) => {
    setMembers(x);
    setOpenViewMember(true);
  };

  const handleContinueRoleDelete = async (x) => {
    await deleteRole(x);
    setOpenRoleDelete(false);
    setOpenSB(true);
    await onLoad();
  };

  const [loading, setLoading] = useState(false);
  const handleClickOpenEditRole = (x) => {
    setLoading(true);
    setRoleInfo({});
    setTimeout(() => {
      setRoleInfo(x);
      setLoading(false);
    }, 0);
  };

  const handleClickOpenCreateRole = () => {
    setOpenCreateRole(true);
  };

  const handleRefresh = () => {
    onLoad();
  };

  const handleContinueEditRole = async (x) => {
    await editRole(x);
    setUpdateSB(true);
    await onLoad();
  };
  useEffect(() => {
    if (roleInfo && Object.keys(roleInfo).length > 0) {
      setOpenEditRole(true);
    }
  }, [roleInfo]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        minHeight: "100vh",
      }}
    >
      <CorfirmationToDeleteRole
        open={openRoleDelete}
        handleClose={handleCloseRoleDelete}
        handleContinue={handleContinueRoleDelete}
        role_name={role_name}
      />
      <CreateRole
        open={openCreateRole}
        handleClose={handleCloseCreateRole}
        handleRefresh={handleRefresh}
      />
      <ViewMember
        open={openViewMember}
        handleClose={handleCloseViewMember}
        data={members}
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
            Loading role informations...
          </Typography>
          <CircularProgress sx={{ ml: 2 }} />
        </Box>
      ) : roleInfo ? (
        <EditRole
          open={openEditRole}
          handleClose={handleCloseEditRole}
          handleContinue={handleContinueEditRole}
          roleInfo={roleInfo}
        />
      ) : (
        <>
          {openEditRole && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              Failed to load role data. Please try again later.
            </Typography>
          )}
        </>
      )}

      <Box
        sx={{
          width: "100%",
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ flex: 1 }}></FormControl>
        <Button
          type="submit"
          variant="contained"
          onClick={() => handleClickOpenCreateRole()}
          sx={{
            ml: 2,
          }}
        >
          Create Roles
        </Button>
      </Box>

      <Snackbar
        open={updateSB}
        autoHideDuration={6000}
        onClose={handleCloseUpdateSnackbar}
        message={successEditRole ? successEditRole : errorEditRole}
        action={actionUpdate}
      />

      <Snackbar
        open={openSB}
        autoHideDuration={6000}
        onClose={handleCloseSB}
        message={successDeleteRole ? successDeleteRole : errorDeleteRole}
        action={action}
      />

      <DataGrid
        rows={data}
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

export default Roles;
