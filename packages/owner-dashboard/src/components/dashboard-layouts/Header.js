import React from "react";
import { createUseStyles } from "react-jss";
import { Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const useStyles = createUseStyles(() => {
  return {
    header: {
      minHeight: 80,
    },
    title: {
      color: "#FFF",
      fontSize: 32,
      marginLeft: 30,
      paddingTop: 7,
      cursor: "pointer",
      maxWidth: "min-content",
    },
  };
});

const HeaderLayout = () => {
  const classes = useStyles();
  const nav = useNavigate();

  return (
    <Header className={classes.header} style={{ padding: 0 }}>
      <Typography className={classes.title} onClick={() => nav("/")}>
        Roomie
      </Typography>
    </Header>
  );
};

export { HeaderLayout };
