import { Container, CssBaseline } from "@material-ui/core";
import React from "react";

const UnAuthorized = () => {
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <h1 style={{ color: "#3F51B5", textAlign: "center" }}>Unauthorized</h1>
      <h4 style={{ color: "#3F51B5", textAlign: "center" }}>
        Create New Asset - No permission to view this page
      </h4>
    </Container>
  );
};

export default UnAuthorized;
