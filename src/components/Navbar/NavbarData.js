import React from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

export const NavbarData = [
    {
        title: "Home",
        icon: <HomeRoundedIcon />,
        link: "/"
    },

    {
        title: "Create Group",
        icon: <AddRoundedIcon />,
        link: "/creategroup"
    },

    {
        title: "My Account",
        icon: <PersonIcon />,
        link: "/myaccount"
    }
];
