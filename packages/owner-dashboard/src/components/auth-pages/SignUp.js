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
    loginBtn: {
      marginLeft: "15%",
      width: "70%",
    },
  };
});

export default function SignUp() {
  const classes = useStyles();
  const { loading, authenticated } = useContext(AuthContext);
  const nav = useNavigate();

  if (loading) {
    return <Spin size="large" />;
  }

  if (authenticated) {
    return <Navigate to="/profile" />;
  }

  const onFinish = (values) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/owners/signup`, {
        name: values.name,
        email: values.email,
        password: values.password,
      })
      .then(() => {
        notification["success"]({
          message: "Success",
          description: "User has been created! Now please login",
        });
        nav("/login");
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
        name="sign-up"
        layout="vertical"
        labelCol={{
          span: 8,
        }}
        onFinish={onFinish}
        autoComplete="off"
        className={classes.form}
      >
        <Title className={classes.title}>Room Owner Register</Title>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          <Input />
        </Form.Item>

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
            Create
          </Button>
        </Form.Item>
        <Divider />
        <Button className={classes.loginBtn} onClick={() => nav("/login")}>
          Login
        </Button>
      </Form>
    </Content>
  );
}
