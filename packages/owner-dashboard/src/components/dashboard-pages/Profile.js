import React, { useState, useEffect, useContext } from "react";
import { createUseStyles } from "react-jss";
import {
  Col,
  Divider,
  Row,
  Typography,
  Input,
  Button,
  notification,
  Form,
  Modal,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";

const useStyles = createUseStyles(() => {
  return {
    title: {
      fontSize: 28,
    },
    label: {
      fontSize: 22,
      marginLeft: 40,
    },
    info: {
      fontSize: 18,
      marginLeft: -40,
    },
    editBtn: {
      cursor: "pointer",
    },
    updateBtn: {
      marginRight: 10,
    },
  };
});

const ProfileContent = () => {
  const classes = useStyles();
  const nav = useNavigate();
  const { userId, setUserId, setAuthenticated } = useContext(AuthContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "********",
    contactNumber: "",
  });
  const [editName, setEditName] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    var token = localStorage.getItem("ownerToken");

    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser({
          ...user,
          name: res.data.data.name,
          email: res.data.data.email,
          contactNumber: res.data.data?.contactNumber || "",
        });
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
  }, []);

  const handleUpdateProfile = () => {
    let body = {};
    if (editName) {
      body = { name: user.name };
    } else if (editContact) {
      body = { contactNumber: user.contactNumber };
    }
    var token = localStorage.getItem("ownerToken");
    axios
      .post(`${process.env.REACT_APP_API_URL}/users/${userId}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        notification["success"]({
          message: "Success",
          description: "Profile updated",
        });
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
    setEditName(false);
    setEditContact(false);
  };

  const handleDeactivateAccount = () => {
    var token = localStorage.getItem("ownerToken");
    axios
      .delete(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        notification["success"]({
          message: "Deactivated",
          description: "Your account has been deactivated",
        });
        localStorage.removeItem("ownerToken");
        setUserId("");
        setAuthenticated(false);
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
    <>
      <Typography className={classes.title}>Profile</Typography>
      <Divider />
      <Form onFinish={handleUpdateProfile}>
        <Row gutter={16}>
          <Col span={8} className={classes.label}>
            Name
          </Col>

          <Col span={12} className={classes.info}>
            {editName ? (
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
              >
                <Input
                  placeholder="Enter name"
                  value={user.name}
                  onChange={(event) => {
                    const { value } = event.target;
                    setUser({ ...user, name: value });
                  }}
                />
              </Form.Item>
            ) : (
              <>{user.name}</>
            )}
          </Col>

          <Col span={4} className={classes.editBtn}>
            {editName ? (
              <>
                <Button
                  type="primary"
                  className={classes.updateBtn}
                  htmlType="submit"
                >
                  Update
                </Button>
                <Button onClick={() => setEditName(false)}>Cancel</Button>
              </>
            ) : (
              <EditOutlined
                onClick={() => {
                  setEditContact(false);
                  setEditName(true);
                }}
              />
            )}
          </Col>
        </Row>
      </Form>

      <Divider />
      <Form onFinish={handleUpdateProfile}>
        <Row gutter={16}>
          <Col span={8} className={classes.label}>
            Contact Number
          </Col>

          <Col span={12} className={classes.info}>
            {editContact ? (
              <Form.Item
                name="contactNumber"
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
              >
                <Input
                  placeholder="Enter contact number"
                  value={user.contactNumber}
                  onChange={(event) => {
                    const { value } = event.target;
                    setUser({ ...user, contactNumber: value });
                  }}
                />
              </Form.Item>
            ) : (
              <>{user.contactNumber}</>
            )}
          </Col>

          <Col span={4} className={classes.editBtn}>
            {editContact ? (
              <>
                <Button
                  type="primary"
                  className={classes.updateBtn}
                  htmlType="submit"
                >
                  Update
                </Button>
                <Button onClick={() => setEditName(false)}>Cancel</Button>
              </>
            ) : (
              <EditOutlined
                onClick={() => {
                  setEditName(false);
                  setEditContact(true);
                }}
              />
            )}
          </Col>
        </Row>
      </Form>

      <Divider />
      <Row gutter={16}>
        <Col span={8} className={classes.label}>
          Email
        </Col>
        <Col span={12} className={classes.info}>
          {user.email}
        </Col>
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col span={8} className={classes.label}>
          Password
        </Col>
        <Col span={12} className={classes.info}>
          {user.password}
        </Col>
      </Row>
      <Divider />

      <Button danger onClick={() => setShowModal(true)}>
        Deactivate account
      </Button>
      <Modal
        title="Are you sure you want to deactivate your account?"
        visible={showModal}
        onOk={handleDeactivateAccount}
        onCancel={() => setShowModal(false)}
        okText="Deactivate"
      >
        <p>
          After your account is deactivated. You will no longer able to login
          into the roomie and also all the information related you will get
          deleted.
        </p>
      </Modal>
    </>
  );
};

export { ProfileContent };
