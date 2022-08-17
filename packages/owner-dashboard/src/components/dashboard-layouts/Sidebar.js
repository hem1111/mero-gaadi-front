import React, { useContext } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, CarOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(() => {
  return {
    sidebar: {
      "& .ant-layout-sider-zero-width-trigger": {
        top: "1px",
      },
    },
  };
});

const { Sider } = Layout;

const Sidebar = ({ defaultKey }) => {
  const classes = useStyles();
  const nav = useNavigate();

  const { setOwnerId, setAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    setOwnerId("");
    setAuthenticated(false);
    nav("/login");
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="0" className={classes.sidebar}>
      <Menu theme="dark" mode="inline" selectedKeys={[defaultKey]}>
        <Menu.Item
          key="1"
          icon={<UserOutlined />}
          onClick={() => nav("/profile")}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<CarOutlined />}
          onClick={() => nav("/vehicles")}
        >
          My Vehicles
        </Menu.Item>
        <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export { Sidebar };
