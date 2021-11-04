import React from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import AlbumIcon from '@mui/icons-material/Album';

export const NavbarData = [
    {
        title: "Home",
        icon: <HomeRoundedIcon />,
        link: "/Pineapple-Music"
    },

    {
        title: "Search",
        icon: <SearchIcon />,
        link: "/search"
    },

    {
        title: "Group Session",
        icon: <AddRoundedIcon />,
        link: "/creategroup"
    },

    {
        title: "My Account",
        icon: <PersonIcon />,
        link: "/myaccount"
    },

    {
        title: "Profile",
        icon: <ImageIcon />,
        link: "/profilepicture"
    },

    {
        title: "Song",
        icon: <AlbumIcon />,
        link: "/song"
    }
];
