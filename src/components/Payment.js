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



const windowReference = window.open()

const paymentsSUBID = [
  { title: "Anında Kredi Kartı", key: "APID59beRzS7Xhlot61C", id: 1 },
  { title: "Anında Havale", key: "APIvzIzTPV5RpuIMDhCX", id: 2 },
  { title: "Jet Papara", key: "APIu8OqRGyI2ovtuw2oO", id: 3 },
  { title: "Anında Mefete", key: "APIlfMbLjPcJ7Tx3WN8c", id: 4 },
];
function Payment({ setUser, user }) {
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);

  const [accounts, setAccounts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [from, setFrom] = useState(paymentsSUBID[0]);
  const [trader, setTrader] = useState(null);

  const [transfers, setTransfers] = useState([]);


  // if checkmobile device


  /**
   * (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))window.location=b})(navigator.userAgent||navigator.vendor||window.opera,'http://detectmobilebrowser.com/mobile');
   */
   const  mobileAndTabletCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

  
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
        .get(
          `https://sekizfx-payment-back.herokuapp.com/api/payments/my-transfers/${trader.id}`
        )
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
      <img alt="payment-logo" className="center" src={logo2} />
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
            .post(
              "https://sekizfx-payment-back.herokuapp.com/api/payments/deposit",
              {
                name: trader.first_name + " " + trader.second_name,
                userId: trader.id,
                tc: values.tc,
                amount: values.amount,
                from,
                to: values.to,
              }
            )
            .then(({ data }) => {

              //check mobile or tablet device
              if(mobileAndTabletCheck())
              {
                //alert("asdsadasd")
                window.location = data.data.link;

                const windowReference = window.open();

              }
              else{
                window.open(data.data.link, "_blank");
                window.location.reload();
              }

           
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
                <option selected={from.title === "Anında Kredi Kartı"}>
                  Anında Kredi Kartı
                </option>
                <option selected={from.title === "Anında Havale"}>
                  Anında Havale
                </option>
                <option selected={from.title === "Jet Papara"}>
                  Jet Papara
                </option>
                {/* <option selected={from === "Anında BTC"}>Anında BTC</option> */}
                <option selected={from.title === "Anında Mefete"}>
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
              setFrom(paymentsSUBID[0]);
              setShowPaymentModal(false);
            }}
          >
            <img alt="kredi" className="mr-2" src={kredi} />
            <h4>Anında Kredi Kartı</h4>
          </div>
          <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom(paymentsSUBID[1]);
              setShowPaymentModal(false);
            }}
          >
            <img alt="havale" className="mr-2" src={havale} />
            <h4>Anında Havale</h4>
          </div>
          <div
            className="d-flex my-4 cp"
            onClick={() => {
              setFrom(paymentsSUBID[2]);
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
              setFrom(paymentsSUBID[3]);
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
