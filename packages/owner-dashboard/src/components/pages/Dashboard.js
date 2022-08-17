import React, { useEffect, useState, useContext } from "react";
import { Layout } from "antd";
import { createUseStyles } from "react-jss";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../dashboard-layouts/Sidebar";
import { HeaderLayout } from "../dashboard-layouts/Header";
import { ownerRoutes } from "../../utils/Routes";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";

const { Content } = Layout;

const useStyles = createUseStyles(() => {
  return {
    roomie: {
      minHeight: "100vh",
    },
    contentWrapper: {
      margin: "24px 16px",
      padding: 24,
    },
  };
});

export default function Dashboard() {
  const classes = useStyles();
  const location = useLocation();

  const [page, setPage] = useState("/");
  const [defaultKey, setDefaultKey] = useState("");

  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    setPage(location.pathname);
    if (location.pathname.startsWith("/profile")) setDefaultKey("1");
    else setDefaultKey("2");
  }, [location]);

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout className={classes.roomie}>
      <HeaderLayout />
      <Layout>
        <Sidebar defaultKey={defaultKey} />
        <Content className={classes.contentWrapper}>
          {ownerRoutes.map((item) => {
            if (item.key === page) {
              return item.page;
            }
          })}
        </Content>
      </Layout>
    </Layout>
  );
}
