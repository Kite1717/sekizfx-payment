import React, { useState } from "react";
import { Formik } from "formik";
import Swal from "sweetalert2";
import axios from "axios";

import MD5 from "crypto-js/md5";
import {
  Spinner,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Container,
} from "react-bootstrap";
import logo from "../assets/logo.png";
function Login({ setUser, setIsAdminLogin }) {
  const [loading, setLoading] = useState(false);
  return (
    <Container>
      <img alt="logo" className="center" src={logo} />
      <h2 className="text-center">Login</h2>
      <Row className="justify-content-md-center">
        <Col xs lg="4" className="text-center">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Your e-mail address cannot be empty.";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Please enter a valid e-mail address.";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setLoading(true);

              axios
                .post(
                  "http://localhost:4200/api/user/login",
                  values
                )
                .then(({ data }) => {
                  // admin

                  localStorage.setItem("auth-admin", JSON.stringify(data));
                  setIsAdminLogin(true);
                  setLoading(false);
                  setSubmitting(false);
                })
                .catch(() => {
                  // client

                  let formData = new FormData();

                  formData.append("user_email", values.email);
                  formData.append("password", values.password);

                  const rand = Math.floor(Math.random() * 9999999) + 100000;
                  const key = MD5("KxNSC7nYdl" + rand);
                  formData.append("key", key);
                  formData.append("rand_param", rand);
                  axios
                    .post(
                      "https://my.sekizfx8.com/api/v_2/page/Login",
                      formData
                    )
                    .then(({ data }) => {
                      if (data.error_number !== 0 && data.result === "failed") {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: data.description,
                        });
                      } else if (
                        data.error_number === 0 &&
                        data.result === "success"
                      ) {
                        setUser(data.values);
                        localStorage.setItem(
                          "auth",
                          JSON.stringify(data.values)
                        );
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "Trader Error",
                        });
                      }
                      setLoading(false);
                      setSubmitting(false);
                    })
                    .catch(() => {
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "System Error",
                      });
                      setLoading(false);
                      setSubmitting(false);
                    });
                });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    name="email"
                    type="email"
                    placeholder="Email"
                  />
                  {errors.email && touched.email && errors.email && (
                    <Alert variant={"danger"}>
                      {errors.email && touched.email && errors.email}
                    </Alert>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                {loading ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Sign in
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
