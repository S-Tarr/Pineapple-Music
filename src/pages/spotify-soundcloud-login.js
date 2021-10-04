import React from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

return (
  <Grid container>
    <Grid item xs>
        <Button variant="contained">Contained</Button>
    </Grid>
    <Divider orientation="vertical" flexItem>
    </Divider>
    <Grid item xs>
        <Button variant="contained">Contained</Button>
    </Grid>
  </Grid>
);
