import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
import MD5 from "crypto-js/md5";
import Swal from "sweetalert2";
import {
  Spinner,
  Button,
  Form,
  Alert,
  Container,
  Modal,
  Table,
} from "react-bootstrap";

import moment from "moment";

import kredi from "../assets/logos/kredi.png";
import havale from "../assets/logos/havale.png";
import papara from "../assets/logos/papara.png";
import btc from "../assets/logos/btc.png";
import mefete from "../assets/logos/mefete.png";
import logo2 from "../assets/logo2.svg";

function Payment({ setUser, user }) {
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);

  const [accounts, setAccounts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [from, setFrom] = useState("Anında Kredi Kartı");
  const [trader, setTrader] = useState(null);

  const [transfers, setTransfers] = useState([]);

  //Accounts
  useEffect(() => {
    setLoading(true);
    const rand = Math.floor(Math.random() * 9999999) + 100000;
    const key = MD5("KxNSC7nYdl" + rand);
    let url = "https://my.sekizfx8.com/api/v_2/trading/GetBalanceInfo?";
    url += `auth_token=${user.auth_token}&`;
    url += `key=${key}&`;
    url += `rand_param=${rand}&`;
    url += `user_id=${user.user_id}`;
    axios
      .get(url)
      .then(({ data }) => {
        if (data.error_number !== 0 && data.result === "failed") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.description,
          }).then(() => {
            setUser(null);
            setLoading(false);
          });
        } else if (data.error_number === 0 && data.result === "success") {
          setAccounts(data.values);
          setLoading(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Trader Error",
          }).then(() => {
            setUser(null);
            setLoading(false);
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "System Error",
        }).then(() => {
          setUser(null);
          setLoading(false);
        });
      });
  }, []);

  //user accounts Info
  useEffect(() => {
    const rand = Math.floor(Math.random() * 9999999) + 100000;
    const key = MD5("KxNSC7nYdl" + rand);
    let url = "https://my.sekizfx8.com/api/v_2/page/GetAccountInfo?";
    url += `auth_token=${user.auth_token}&`;
    url += `key=${key}&`;
    url += `rand_param=${rand}&`;
    url += `user_id=${user.user_id}`;
    axios
      .get(url)
      .then(({ data }) => {
        if (data.error_number !== 0 && data.result === "failed") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.description,
          }).then(() => {
            setUser(null);
          });
        } else if (data.error_number === 0 && data.result === "success") {
          setTrader(data.values);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Trader Error",
          }).then(() => {
            setUser(null);
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "System Error",
        }).then(() => {
          setUser(null);
        });
      });
  }, []);

  //transfers
  useEffect(() => {
    if (trader) {
      axios
        .get(`http://localhost:4000/api/payments/my-transfers/${trader.id}`)
        .then(({ data }) => {
          setTransfers(data.transfers);
        });
    }
  }, [trader]);

  const getStatus = (status) => {
    if (status === 0) {
      return "Pending";
    } else if (status === 1) {
      return "Success";
    } else if (status === 0) {
      return "Time Out";
    }
  };
  const getStatusColor = (status) => {
    if (status === 0) {
      return "#33C7FF";
    } else if (status === 1) {
      return "#09D541";
    } else if (status === 2) {
      return "#FFC300";
    }
  };
  return (
    <Container>
      <img className="center" src={logo2} />
      <h2>Make a Deposit</h2>
      <Formik
        initialValues={{
          tc: "",
          amount: "",
          to: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.amount || Number(values.amount) < 50) {
            errors.amount =
              "The amount of Deposit (withdrawal) must not be less than 50.00 TRY";
          }
          if (!values.tc || Number(values.tc).toString().length !== 11) {
            errors.tc = "TC number must be 11 digits";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setLoading(true);
          setSubmitting(true);
          if (values.to === "" && accounts.length > 0) {
            values.to = accounts[0].server_account;
          } else if (accounts.length === 0) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "You don't have account",
            }).then(() => {
              setUser(null);
              setLoading(false);
              setSubmitting(false);
            });
          }

          axios
            .post("http://localhost:4000/api/payments/deposit", {
              name: trader.first_name + " " + trader.second_name,
              userId: trader.id,
              tc: values.tc,
              amount: values.amount,
              from,
              to: values.to,
            })
            .then(({ data }) => {
              window.open(data.data.link, "_blank");
              window.location.reload();
              setLoading(false);
              setSubmitting(false);
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Payment system busy please try again later",
              });
              setLoading(false);
              setSubmitting(false);
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
          setFieldValue,
          /* and other goodies */
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Transfer From</Form.Label>
              <Form.Control
                onClick={() => {
                  setShowPaymentModal(true);
                }}
                // onChange={(e) => {
                //   console.log(e.target.value);
                //   setShowPaymentModal(true);
                // }}
                as="select"
              >
                <option selected={from === "Anında Kredi Kartı"}>
                  Anında Kredi Kartı
                </option>
                <option selected={from === "Anında Havale"}>
                  Anında Havale
                </option>
                <option selected={from === "Jet Papara"}>Jet Papara</option>
                {/* <option selected={from === "Anında BTC"}>Anında BTC</option> */}
                <option selected={from === "Anında Mefete"}>
                  Anında Mefete
                </option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Transfer To</Form.Label>
              {loading ? (
                <Spinner
                  className="ml-2"
                  animation="border"
                  variant="primary"
                />
              ) : (
                <Form.Control
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.to}
                  name="to"
                  as="select"
                >
                  {accounts.map((item, index) => {
                    return (
                      <option key={index} value={item.server_account}>
                        {item.server_account}
                      </option>
                    );
                  })}
                </Form.Control>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Transfer Amount TRY(₺)</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.amount}
                name="amount"
                type="number"
                defaultValue={50}
                min={50}
              />
              {errors.amount && touched.amount && errors.amount && (
                <Alert variant={"danger"}>
                  {errors.amount && touched.amount && errors.amount}
                </Alert>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Amount to be credited USD($)</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.amount}
                name="amount"
                type="number"
                defaultValue={50}
                min={50}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>TC</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.tc}
                name="tc"
                type="number"
              />
              {errors.tc && touched.tc && errors.tc && (
                <Alert variant={"danger"}>
                  {errors.tc && touched.tc && errors.tc}
                </Alert>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Current rate of exchange : {exchangeRate.toFixed(6)}
              </Form.Label>
            </Form.Group>
            {loading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Deposit
              </Button>
            )}
          </Form>
        )}
      </Formik>

      {/* Payment method modal*/}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select a payment method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom("Anında Kredi Kartı");
              setShowPaymentModal(false);
            }}
          >
            <img alt="kredi" className="mr-2" src={kredi} />
            <h4>Anında Kredi Kartı</h4>
          </div>
          <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom("Anında Havale");
              setShowPaymentModal(false);
            }}
          >
            <img alt="havale" className="mr-2" src={havale} />
            <h4>Anında Havale</h4>
          </div>
          <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom("Jet Papara");
              setShowPaymentModal(false);
            }}
          >
            <img alt="papara" className="mr-2" src={papara} />
            <h4>Jet Papara</h4>
          </div>
          {/* <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom("Anında BTC");
              setShowPaymentModal(false);
            }}
          >
            <img alt="btc" className="mr-2" src={btc} />
            <h4>Anında BTC</h4>
          </div> */}
          <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom("Anında Mefete");
              setShowPaymentModal(false);
            }}
          >
            <img alt="mefete" className="mr-2" src={mefete} />
            <h4>Anında Mefete</h4>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <h4 className="mt-5">Transfers</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Where From</th>
            <th>Where To</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.id}</td>

                <td>{moment(item.createdAt).format("DD.MM.YYYY, h:mm:ss")}</td>
                <td>{item.from}</td>
                <td>{item.to}</td>
                <td>{item.amount} USD</td>
                <td
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: getStatusColor(item.status),
                  }}
                >
                  {getStatus(item.status)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default Payment;
