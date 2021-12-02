import { React, useState } from 'react'
import { Typography, InputBase } from '@mui/material'
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));
  
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 0, 1, 0),
        // // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
    },
  }));

function Bookmarks() {
    const [searchStr, setSearchStr] = useState("");
    return (
        <div className="Page" align="center">
            <Typography
                sx={{ fontWeight: "bold", pt: 3}}
                variant="h3"
                component="div"
                gutterBottom
            >
                Bookmarks
            </Typography>

            <Search>
                <SearchIconWrapper> <SearchIcon /> </SearchIconWrapper>
                <StyledInputBase
                    value={searchStr}
                    onChange={(e) => setSearchStr(e.target.value)}
                    placeholder="Search"
                    inputProps={{ "aria-label": "search" }}
                />
            </Search>
        </div>
    )
}

export default Bookmarks
