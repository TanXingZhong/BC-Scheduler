import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import "../../index.css";

export default function LeaveApproval() {
  const rows = [
    { id: 1, name: "Aaron", date: "2024-12-25" },
    { id: 2, name: "Halim", date: "2024-12-26" },
    { id: 3, name: "Colin", date: "2024-12-27" },
    { id: 4, name: "Nirdesh", date: "2024-12-28" },
    { id: 5, name: "Yuumi", date: "2024-12-28" },
  ];

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      width: 100, // default width for mobile
      cellClassName: "name-column",
    },
    { field: "date", headerName: "Date", width: 100 },
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

  const handlePageSizeChange = (newPageSize) => {
    if (newPageSize !== 4) {
      // Reset to 4 rows per page
      this.setState({ pageSize: 4 });
    }
  };

  return (
    <div style={{ height: 320, width: "100%", margin: "0 auto" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={4}
        rowsPerPageOptions={[4]}
        pagination
        disableSelectionOnClick
        hideFooterSelectedRowCount
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
