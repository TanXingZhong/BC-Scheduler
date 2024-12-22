import * as React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function Search() {
  return (
    <OutlinedInput
      size="small"
      id="search"
      placeholder="Search…"
      sx={{ flexGrow: 1 }}
      startAdornment={
        <InputAdornment position="start" sx={{ color: "text.primary" }}>
          <SearchRoundedIcon fontSize="small" />
        </InputAdornment>
      }
      inputProps={{
        "aria-label": "search",
      }}
    />
  );
}
