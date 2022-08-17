import React, { useContext } from "react";
import { AuthContext } from "../../utils/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Spin,
  notification,
  Typography,
  Divider,
  Layout,
} from "antd";
import { createUseStyles } from "react-jss";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;

const useStyles = createUseStyles(() => {
  return {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      paddingBottom: 60,
    },
    title: {
      paddingBottom: 30,
      display: "flex",
      justifyContent: "center",
    },
    form: {
      marginTop: 150,
      maxWidth: 900,
      minWidth: 400,
      margin: "auto",
      padding: "0 20px",
      "@media (max-width:400px)": {
        minWidth: 200,
        width: "100%",
      },
    },
    btnStyle: {
      width: "100%",
    },
    forgotPassword: {
      color: "#1877f2",
      fontSize: 14,
      fontWeight: 500,
      display: "flex",
      justifyContent: "center",
      cursor: "pointer",
    },
    createAccountBtn: {
      marginLeft: "15%",
      width: "70%",
    },
  };
});

export default function Login() {
  const classes = useStyles();
  const { loading, authenticated, setAuthenticated } = useContext(AuthContext);
  const nav = useNavigate();

  if (loading) {
    return <Spin size="large" />;
  }

  if (authenticated) {
    return <Navigate to="/profile" />;
  }

  const onFinish = (values) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/owners/login`, {
        email: values.email,
        password: values.password,
        role: "owner",
      })
      .then((res) => {
        localStorage.setItem("ownerToken", res.data.idToken);
        setAuthenticated(true);
        nav("/profile");
      })
      .catch((err) => {
        let message = "Something is wrong! Please try again later.";
        if (err.response.data.status < 500) {
          message = err.response.data.error;
        }
        notification["error"]({
          message: "Error Occured",
          description: message,
        });
      });
  };

  return (
    <Content className={classes.wrapper}>
      <Form
        name="login"
        layout="vertical"
        labelCol={{
          span: 8,
        }}
        onFinish={onFinish}
        autoComplete="off"
        className={classes.form}
      >
        <Title className={classes.title}>Login</Title>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Required",
            },
            {
              type: "email",
              message: "Invalid Email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Required",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={classes.btnStyle}>
            Login
          </Button>
        </Form.Item>
        <Typography
          className={classes.forgotPassword}
          onClick={() => nav("/forgot-password")}
        >
          Forgot Password?
        </Typography>
        <Divider />
        <Button
          className={classes.createAccountBtn}
          onClick={() => nav("/sign-up")}
        >
          Create new account
        </Button>
      </Form>
    </Content>
  );
}
