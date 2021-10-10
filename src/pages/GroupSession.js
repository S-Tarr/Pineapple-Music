import React from "react";

import {
    Button,
    Card,
    CardActions,
    CardContent,
  } from "@material-ui/core";

function Register() {
    return (
        <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image="https://image.spreadshirtmedia.com/image-server/v1/mp/products/T1459A839MPA3861PT28D1023062364FS1458/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/pineapple-listening-to-music-cartoon-sticker.jpg"
          alt="group session image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Name of your group session
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Group session explanation
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Join</Button>
          <Button size="small">Session ID</Button>
        </CardActions>
      </Card>
    );
}

export default Register;
