import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid2";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";

export default function ScheduleApproval() {
  const rows = [
    {
      id: 1,
      name: "Aaron",
      role: "NOOB",
      date: "2024-12-25",
      start: "12:00pm",
      end: "11:59pm",
    },
    {
      id: 2,
      name: "Aaron",
      role: "NOOB",
      date: "2024-12-25",
      start: "12:00pm",
      end: "11:59pm",
    },
    {
      id: 3,
      name: "Aaron",
      role: "NOOB",
      date: "2024-12-25",
      start: "12:00pm",
      end: "11:59pm",
    },
    {
      id: 4,
      name: "Aaron",
      role: "NOOB",
      date: "2024-12-25",
      start: "12:00pm",
      end: "11:59pm",
    },
    {
      id: 5,
      name: "Aaron",
      role: "NOOB",
      date: "2024-12-25",
      start: "12:00pm",
      end: "11:59pm",
    },
  ];

  const columns = [
    { field: "name", headerName: "Name", width: 100 },
    { field: "role", headerName: "Role", width: 100 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "start", headerName: "Start", width: 100 },
    { field: "end", headerName: "End", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ marginRight: 1 }}
            onClick={() => handleAccept(params.row.id)}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleReject(params.row.id)}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  const handleAccept = (id) => {
    console.log(`Accepted row with id: ${id}`);
    // Add logic for accepting the row
  };

  const handleReject = (id) => {
    console.log(`Rejected row with id: ${id}`);
    // Add logic for rejecting the row
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
