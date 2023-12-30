import {Box, LinearProgress, Typography } from "@material-ui/core"
export const ProgressBarWithLabel = (props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.progress
        )}%`}</Typography>
      </Box>
    </Box>
  );
};
