import React from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

function GroupSessionCard({
  props: { title, imageUrl, username, createdAt, sessionId },
}) {
  
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
        <Button size="small" onClick={copyId}>
          Session ID: {sessionId}
        </Button>
      </CardActions>
    </Card>
  );
}

export default GroupSessionCard;
