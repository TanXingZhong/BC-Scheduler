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
    try {
      const data = await userApplications(user_id);
      setUser_Applications(data);
    } catch (err) {
      console.error("Error loading schedules: ", err);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  const rows = user_Applications;

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
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <div>
            {status === "accepted" || status === "rejected" ? (
              <button onClick={() => handleClear(params.row.id)}>Clear</button>
            ) : (
              <span>No actions</span>
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
        rows={rows}
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
      />
    </Box>
  );
}
