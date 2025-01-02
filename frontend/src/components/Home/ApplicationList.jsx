import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { toSGDate, toSGTimeShort } from "../../../config/convertTimeToSGT";
import { useGetUserApplications } from "../../hooks/Home/useGetUserApplications";
import { useUserInfo } from "../../hooks/useUserInfo";
import { useClearUserApplication } from "../../hooks/Home/useClearUserApplication";

export default function ApplicationList() {
  const { userApplications, isLoading, error } = useGetUserApplications();
  const [user_Applications, setUser_Applications] = useState([]);
  const { clearApplications } = useClearUserApplication();
  const { user_id } = useUserInfo();
  const onLoad = async () => {
    const data = await userApplications(user_id);
    if (data) setUser_Applications(data);
  };

  useEffect(() => {
    onLoad();
  }, []);

  const columns = [
    { field: "outlet_name", headerName: "Outlet", width: 150 },
    {
      field: "date",
      headerName: "Date",
      width: 100,
      valueFormatter: (params) => toSGDate(params),
    },
    {
      field: "start_time",
      headerName: "Start",
      width: 70,
      valueFormatter: (params) => toSGTimeShort(params),
    },
    {
      field: "end_time",
      headerName: "End",
      width: 70,
      valueFormatter: (params) => toSGTimeShort(params),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      valueFormatter: (params) => {
        if (params === "pending") {
          return "Pending";
        } else if (params == "accepted") {
          return "Accepted";
        } else {
          return "Unknown";
        }
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <div>
            {status === "accepted" || status === "rejected" ? (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleClear(params.row.id)}
              >
                Clear
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleClear(params.row.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleClear = async (id) => {
    await clearApplications(id, "clear");
    onLoad();
  };

  return (
    <Box style={{ height: 320, margin: "0 auto" }}>
      <DataGrid
        rows={user_Applications}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        pageSize={5}
        rowsPerPageOptions={[5]}
        hideFooterSelectedRowCount
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "secondary.main",
          },
        }}
      />
    </Box>
  );
}
