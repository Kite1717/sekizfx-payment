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
  Table,
} from "react-bootstrap";

import moment from "moment";

import kredi from "../assets/logos/kredi.png";
import havale from "../assets/logos/havale.png";
import papara from "../assets/logos/papara.png";
import btc from "../assets/logos/btc.png";
import mefete from "../assets/logos/mefete.png";
import logo2 from "../assets/logo2.svg";


const paymentsSUBID = [
  { title: "Anında Kredi Kartı",  id: 1 },
  { title: "Anında Havale",  id: 2 },
  { title: "Jet Papara",  id: 3 },
  { title: "Anında Mefete", id: 4 },
  { title: "Anında BTC",id: 5 },
];

const havaleBanks = [
  { title: "Garanti Bankası", id: 1 },
  { title: "Akbank", id: 2 },
  { title: "Denizbank", id: 3 },
  { title: "Finansbank", id: 4 },
  { title: "İş Bankası", id: 5 },
  { title: "Teb", id: 7 },
  { title: "Vakıfbank", id: 9 },
  { title: "Yapı Kredi", id: 11 },
  { title: "Ziraat Bankası", id: 13 },
  { title: "İng Bank", id: 15 },
  { title: "Şeker Bank", id: 17 },
  { title: "KuveytTürk", id: 19 },
  { title: "Pttbank", id: 23 },
  { title: "Turkiye Finans", id: 25 },
  { title: "Halk Bank", id: 27 },
  { title: "Odea Bank", id: 29 },
  { title: "Albaraka Türk", id: 30 },
  { title: "Papara", id: 31 },
  { title: "Enpara", id: 32 },
  { title: "Aktifbank", id: 33 },
];

const krediKartiBanks = [
  { title: "Garanti Bankası", id: 35 },
  { title: "Denizbank", id: 36 },
  { title: "Finansbank", id: 37 },
  { title: "İş Bankası", id: 38 },
  { title: "Teb", id: 39 },
  { title: "Vakıfbank", id: 40 },
  { title: "Ziraat Bankası", id: 41 },
  { title: "Yapıkredi", id: 42 },
  { title: "Halkbank", id: 44 },
];

function Withdraw({ setUser, user }) {
  const [banks, setBanks] = useState(krediKartiBanks);

  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);

  const [accounts, setAccounts] = useState([]);

  const [from, setFrom] = useState(paymentsSUBID[0]);
  const [paymentImg, setPaymentImg] = useState(kredi);

  const [trader, setTrader] = useState(null);

  const [transfers, setTransfers] = useState([]);

  const [curBalance,setCurBalance] = useState(0)


  const [withdrawStatus,setWithdrawStatus] = useState(false)
  //get with draw system status

  useEffect(() => {
  

    axios.get("http://localhost:4200/api/user/setting/withdraw").then((res)=>{
 
    setWithdrawStatus(res.data.setting.status)
    }).catch(()=>{
 
     Swal.fire({
       icon: "error",
       title: "Oops...",
       text: "Something went wrong",
     })
    })
   }, [])

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
          setCurBalance((Number(data.values[0].balance) -  Number(data.values[0].bonus) < 0 ? 0  :  Number(data.values[0].balance) -  Number(data.values[0].bonus)).toFixed(2))
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
          `http://localhost:4200/api/payments/my-transfers/${trader.id}`
        )
        .then(({ data }) => {
          setTransfers(data.transfers);
        });
    }
  }, [trader]);

  const getType = (type) => {
    if (type === 0) {
      return "Deposit";
    } else if (type === 1) {
      return "Withdraw";
    }
  };
  
  const getStatus = (status) => {
    if (status === 0) {
      return "Pending";
    } else if (status === 1) {
      return "Success";
    } else if (status === 2) {
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


  const systemControl = async () =>{

    return await axios.get("http://localhost:4200/api/user/setting/withdraw");

  }
  const balanceControl = (to,amount) =>{

    const acc = accounts.find((item) => item.server_account ===   to )

    if(acc === undefined) return false
    else{
      if(Number(amount) > Number(acc.balance) -  Number(acc.bonus))
      {
        return false;
      }
      else{
       
        return true
      }
    }
  
  }
  return (
    <Container>
      <img alt="payment-logo" className="center" src={logo2} />

      
      <h2 className="text-center mb-2 mt-2">Make a Withdraw</h2>
      <h4 style = {{fontWeight:"bold"}} className="mb-2 mt-2">Current Balance : {curBalance} TRY</h4>
      <Formik
        initialValues={{
          tc: "",
          amount: "",
          to: "",
          bankId: "",
          iban:"",
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

          if (values.iban === "") {
            errors.iban = "IBAN can't empty";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {

          const {data} = await systemControl();
          if(data.setting.status)
          {
            
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
  
            if (values.bankId === "") {
              
              if(from.id === 3 || from.id === 4 || from.id === 5)
              {
                values.bankId = 1
              }
              else{
                if(from.id === 1)
                {
                  values.bankId = krediKartiBanks[0].id
                }else if(from.id === 2){
                  values.bankId = havaleBanks[0].id
                }
              }
            } 
   
             if(balanceControl(values.to,values.amount))
             {
              axios
              .post(
                "http://localhost:4200/api/payments/wd-request",
                {
                  name: trader.first_name + " " + trader.second_name,
                  userId: trader.id,
                  tc: values.tc,
                  amount: values.amount,
                  from,
                  to: values.to,
                  iban:values.iban,
                  bankId:values.bankId
                }
              )
              
              .then(({ data }) => {
                if (trader) {
                  axios
                    .get(
                      `http://localhost:4200/api/payments/my-transfers/${trader.id}`
                    )
                    .then(({ data }) => {
                      setTransfers(data.transfers);
                    });
                }
                Swal.fire({
                  icon: "success",
                  text: "Your withdrawal request has been successfully completed. Please check the status in the transactions section.",
                });
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

             }
             else{
              setLoading(false);
              setSubmitting(false);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Payment system busy please try again later",
              });
             }
          }
          else{
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Payment system busy please try again later",
            });
            
          }
       

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
              <br />
              <img className="my-3" alt="payment-img" src={paymentImg} />
              <Form.Control
                onChange={(e) => {
                  if (e.target.value === "1") {
                    setFrom(paymentsSUBID[0]);
                    setPaymentImg(kredi);

                    setBanks(krediKartiBanks);
                    setFieldValue("bankId", krediKartiBanks[0].id);
                  } else if (e.target.value === "2") {
                    setFrom(paymentsSUBID[1]);
                    setPaymentImg(havale);

                    setBanks(havaleBanks);
                    setFieldValue("bankId", havaleBanks[0].id);
                  } else if (e.target.value === "3") {
                    setFrom(paymentsSUBID[2]);
                    setPaymentImg(papara);

                    setBanks(null);
                    setFieldValue("bankId", 1);
                  } else if (e.target.value === "4") {
                    setFrom(paymentsSUBID[3]);
                    setPaymentImg(mefete);

                    setBanks(null);
                    setFieldValue("bankId", 1);
                  }
                  else if (e.target.value === "5") {
                    setFrom(paymentsSUBID[4]);
                    setPaymentImg(btc);
                    setBanks(null);
                    setFieldValue("bankId", 1);
                  }
                }}
                as="select"
              >
                <option
                  value="1"
                  selected={from.title === "Anında Kredi Kartı"}
                >
                  Anında Kredi Kartı
                </option>
                <option value="2" selected={from.title === "Anında Havale"}>
                  Anında Havale
                </option>
                <option value="3" selected={from.title === "Jet Papara"}>
                  Jet Papara
                </option>
                <option value="4" selected={from.title === "Anında Mefete"}>
                  Anında Mefete
                </option>
                <option  value="5"  selected={from.title === "Anında BTC"}>Anında BTC</option>
              </Form.Control>
            </Form.Group>

            {banks && (
              <Form.Group>
                <Form.Label>Transfer Bank</Form.Label>
                <Form.Control
                  onChange={(e)=>{

                    setFieldValue("bankId",e.target.value)
                  }}
                  onBlur={handleBlur}
                  value={values.bankId}
                  name="to"
                  as="select"
                >
                  {banks.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.title}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            )}

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
                  onChange={(e)=>{

                    let balance = Number(accounts[Number(e.target.value)].balance) - Number(accounts[Number(e.target.value)].bonus) < 0 ?
                     0 
                     :
                     Number(accounts[Number(e.target.value)].balance) - Number(accounts[Number(e.target.value)].bonus)

                    setCurBalance(balance.toFixed(2))
                    setFieldValue("to",accounts[Number(e.target.value)].server_account)
                  }}
                  onBlur={handleBlur}
                  value={values.to}
                  name="to"
                  as="select"
                >
                  {accounts.map((item, index) => {
                    return (
                      <option key={index} value={index}>
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
              <Form.Label>Bank IBAN,Papara No, Creditcard No, Btc Address</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.iban}
                name="iban"
                type="text"
              />
              {errors.iban && touched.iban && errors.iban && (
                <Alert variant={"danger"}>
                  {errors.iban && touched.iban && errors.iban}
                </Alert>
              )}
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
              <Button variant="primary" type="submit" disabled={curBalance< Number(values.amount) || values.amount === "" || !withdrawStatus}>
                Withdraw
              </Button>
            )}
          </Form>
        )}
      </Formik>

      <h4 className="mt-5">Transfers</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Where From</th>
            <th>Where To</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.id}</td>

                <td>{moment(item.createdAt).format("DD.MM.YYYY, HH:mm:ss")}</td>
                <td>{item.from}</td>
                <td>{item.to}</td>
                <td>{getType(item.type)}</td>
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

export default Withdraw;
