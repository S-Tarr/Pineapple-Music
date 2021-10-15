import React from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ImageIcon from '@mui/icons-material/Image';

export const NavbarData = [
    {
        title: "Home",
        icon: <HomeRoundedIcon />,
        link: "/"
    },

    {
        title: "Search",
        icon: <AddRoundedIcon />,
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
        icon: <ImageIcon />,
        link: "/song"
    },

    {
        title: "Visualizer",
        icon: <ImageIcon />,
        link: "/visual"
    }
];
