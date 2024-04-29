import React from "react";
import { Card, CardHeader, CardContent, Typography, Grid } from "@mui/material";

const ProjectCard = ({ header, body }) => {
  return (
    <Card sx={{ p: 0, maxWidth: 345, maxHeight: 100, overflow: "auto" }} >

      <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}} 
      >
        <Grid container spacing={1} sx={{p:0}}>
          <Grid item xs={12} alignItems='center'>
          <Typography sx={{ml:2}} fontSize={12} fontWeight='bold' color='#0070BB'> {header}</Typography>
          </Grid>
          <Grid item xs={6} alignContent='center'>
          <Typography fontSize={11} fontWeight='bold'> Project Incharge :</Typography>  
          <Typography fontSize={10} fontWeight='medium'> Aman singh</Typography>
          </Grid>
          <Grid item xs={6} alignContent='center'>
          <Typography fontSize={11} fontWeight='bold'> Budget:</Typography>  
          <Typography fontSize={10} fontWeight='medium'> 2000 /-</Typography>
          </Grid>
          <Grid item xs={6} alignContent='center'>
          <Typography fontSize={11} fontWeight='bold'>Area of project:</Typography>  
          <Typography fontSize={10} fontWeight='medium'> 200 acre</Typography>
          </Grid>
          <Grid item xs={6} alignContent='center'>
          <Typography fontSize={11} fontWeight='bold'>Entity Name:</Typography>  
          <Typography fontSize={10} fontWeight='medium'> Ganesh Naik</Typography>
          </Grid>
        </Grid>
        {/* <Typography sx={{ml:2}}>{body}</Typography> */}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
