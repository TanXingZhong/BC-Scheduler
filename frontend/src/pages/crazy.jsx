import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Box,
  Button,
} from "@mui/material";

const initialRows = [
  { id: 1, name: "Alice", age: 25, department: "Engineering" },
  { id: 2, name: "Bob", age: 30, department: "Marketing" },
  { id: 3, name: "Charlie", age: 35, department: "HR" },
  { id: 4, name: "Diana", age: 28, department: "Engineering" },
  { id: 5, name: "Eve", age: 22, department: "Marketing" },
  { id: 6, name: "Frank", age: 30, department: "Engineering" },
];

const crazy = () => {
  const [rows, setRows] = useState(initialRows);
  const [filters, setFilters] = useState({ column: "", values: [] });
  const [uniqueValues, setUniqueValues] = useState([]);

  // Update the list of unique values based on the selected column
  useEffect(() => {
    if (filters.column) {
      const unique = [
        ...new Set(initialRows.map((row) => row[filters.column])),
      ];
      setUniqueValues(unique);
    } else {
      setUniqueValues([]);
    }
  }, [filters.column]);

  // Apply filter based on the selected checkboxes
  const handleCheckboxChange = (value) => {
    setFilters((prevFilters) => {
      const newValues = prevFilters.values.includes(value)
        ? prevFilters.values.filter((v) => v !== value)
        : [...prevFilters.values, value];
      const filteredRows = initialRows.filter(
        (row) =>
          newValues.length === 0 || newValues.includes(row[filters.column])
      );
      setRows(filteredRows);
      return { ...prevFilters, values: newValues };
    });
  };

  // Reset filters and show all rows
  const handleClearFilters = () => {
    setFilters({ column: "", values: [] });
    setRows(initialRows);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Box mb={2}>
        <TextField
          select
          label="Select Column"
          value={filters.column}
          onChange={(e) => setFilters({ column: e.target.value, values: [] })}
          fullWidth
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="age">Age</MenuItem>
          <MenuItem value="department">Department</MenuItem>
        </TextField>
      </Box>

      {filters.column && (
        <Box mb={2}>
          <h4>Select Values to Display:</h4>
          {uniqueValues.map((value) => (
            <FormControlLabel
              key={value}
              control={
                <Checkbox
                  checked={filters.values.includes(value)}
                  onChange={() => handleCheckboxChange(value)}
                />
              }
              label={value}
            />
          ))}
        </Box>
      )}

      <Box mb={2}>
        <Button variant="outlined" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={[
          { field: "name", headerName: "Name", width: 150 },
          { field: "age", headerName: "Age", width: 150 },
          { field: "department", headerName: "Department", width: 150 },
        ]}
        pageSize={5}
      />
    </div>
  );
};

export default crazy;
