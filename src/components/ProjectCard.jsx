import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";

const ProjectCard = ({ header, body }) => {
  return (
    <Card sx={{ p: 0, maxWidth: 345, maxHeight: 80, overflow: "auto" }} >
      <CardHeader
        titleTypographyProps={{
          fontSize: 12,
          fontWeight: "bold",
          paddingBottom: 0,
        }}
        title={header}
      />
      <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}} 
      >
        <Typography sx={{ml:2}}>{body}</Typography>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
