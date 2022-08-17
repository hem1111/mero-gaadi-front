import React, { useEffect, useState, useContext } from "react";
import { Layout } from "antd";
import { createUseStyles } from "react-jss";
import { useLocation } from "react-router-dom";
import { routes } from "../../utils/Routes";

const useStyles = createUseStyles(() => {
  return {
    roomie: {
      minHeight: "100vh",
    },
  };
});

export default function Home() {
  const classes = useStyles();
  const location = useLocation();

  const [page, setPage] = useState("/");

  useEffect(() => {
    setPage(location.pathname);
  }, [location]);

  return (
    <Layout className={classes.roomie}>
      {routes.map((item) => {
        if (item.key === page) {
          return item.page;
        }
      })}
    </Layout>
  );
}
