import React, { useContext } from "react";
import { Typography } from "antd";
import { createUseStyles } from "react-jss";
import { AuthContext } from "../../utils/AuthContext";
import { useLocation, Navigate } from "react-router-dom";

const { Title } = Typography;

const useStyles = createUseStyles(() => {
  return {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      background: "#E5F7F6",
      height: "100vh",
    },
    contentWrapper: {
      marginTop: 200,
      minWidth: 200,
    },
    code: {
      display: "flex",
      justifyContent: "center",
      color: "red",
      fontSize: 60,
      fontWeight: 600,
    },
  };
});

export default function NotFound() {
  const classes = useStyles();

  const { authenticated } = useContext(AuthContext);
  const location = useLocation();

  if (location.pathname == "/") {
    if (authenticated) {
      return <Navigate to="/profile" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.contentWrapper}>
        <Typography className={classes.code}>404</Typography>
        <Title>Page Not Found!</Title>
      </div>
    </div>
  );
}
