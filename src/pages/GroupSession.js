import React from "react";
import { Grid, Typography } from "@material-ui/core";

import GroupSessionCard from "../components/GroupSessionCard";

function GroupSession() {
  var date = new Date();
  var dateTime = date.toLocaleDateString();
  const props = {
    title: "group session1",
    imageUrl:
      "https://image.spreadshirtmedia.com/image-server/v1/mp/products/T1459A839MPA3861PT28D1023062364FS1458/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/pineapple-listening-to-music-cartoon-sticker.jpg",
    username: "username1",
    createdAt: dateTime,
    sessionId: 1234,
  };

  const cards = [props, props, props];

  return (
    <div>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Group Listening
      </Typography>
      <Grid container spacing={4}>
        {cards.map((card) => (
          <Grid item md={3}>
            <GroupSessionCard props={card} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default GroupSession;
