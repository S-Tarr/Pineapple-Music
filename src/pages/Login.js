import React from "react";

import {
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";

function Login() {
  const AppIcon =
    "https://image.spreadshirtmedia.com/image-server/v1/mp/products/T1459A839MPA3861PT28D1023062364FS1458/views/1,width=378,height=378,appearanceId=839,backgroundColor=F2F2F2/pineapple-listening-to-music-cartoon-sticker.jpg";
  const loading = "hi";

  return (
    <Grid container>
      <Grid item sm />
      <Grid item sm>
        <img src={AppIcon} alt="pineapple" />
        <Typography variant="h3">Login</Typography>
        <form noValidate>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            fullWidth
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            fullWidth
          />
          <br />
          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Login
          </Button>
          <br />
          <small>
            Don't have an account yet? <Link to="/register">Register here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}

export default Login;
