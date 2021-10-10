import React from "react";
//import { } from "@material-ui/core";

import GroupSessionCard from "../components/GroupSessionCard";

function GroupSession() {
  var date = new Date();
  var dateTime = date.getDate();
  const props = {title: "group session1", imageUrl: "https://image.spreadshirtmedia.com/image-server/v1/mp/products/T1459A839MPA3861PT28D1023062364FS1458/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/pineapple-listening-to-music-cartoon-sticker.jpg", username: "username1", createdAt: dateTime, sessionId: 1234};
  return (
    <GroupSessionCard props={props}/>
  );
}

export default GroupSession;
