import React from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Popover,
} from "@mui/material";

function GroupSessionCard({
  props: { title, imageUrl, username, createdAt, sessionId },
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const copyId = () => {
    navigator.clipboard.writeText(sessionId);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt="group session image"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Owner: {username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created at: {createdAt}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Join</Button>
        <Button
          size="small"
          onClick={(event) => {
            copyId();
            handleClick(event);
          }}
        >
          Session ID: {sessionId}
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Typography sx={{ p: 2 }}>Session ID copied.</Typography>
        </Popover>
      </CardActions>
    </Card>
  );
}

export default GroupSessionCard;
