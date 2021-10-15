import React from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ImageIcon from '@mui/icons-material/Image';

export const NavbarData = [
    {
        title: "Home",
        icon: <HomeRoundedIcon />,
        link: "/Pineapple-Music"
    },

    {
        title: "Search",
        icon: <ImageIcon />,
        link: "/Pineapple-Music/search"
    },

    {
        title: "Group Session",
        icon: <AddRoundedIcon />,
        link: "/Pineapple-Music/creategroup"
    },

    {
        title: "My Account",
        icon: <PersonIcon />,
        link: "/Pineapple-Music/myaccount"
    },

    {
        title: "Profile",
        icon: <ImageIcon />,
        link: "/Pineapple-Music/profilepicture"
    },

    {
        title: "Song",
        icon: <ImageIcon />,
        link: "/Pineapple-Music/song"
    },

    {
        title: "Visualizer",
        icon: <ImageIcon />,
        link: "/Pineapple-Music/visual"
    }
];
