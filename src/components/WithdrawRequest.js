import React, { useState } from "react";
import { Table, Button, Modal,Form} from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import speakeasy from "speakeasy";
import qrcode from "qrcode";


export default function WithdrawRequest({reqs,getWdRequest}) {




 
  
  const [show, setShow] = useState(false);

  const [googleAuthQrCodeImage, setGoogleAuthQrCodeImage] = useState(null);

  const [secret, setSecret] = useState(null);

  const [qrInput , setQrInput] = useState("")

  const [payload,setPayload] = useState(null)

 

  const getStatus = (status) => {
    if (status === 0) {
      return "Pending";
    } else if (status === 1) {
      return "Accept";
    } else if (status === 2) {
      return "Cancel";
    }
  };
  const getStatusColor = (status) => {
    if (status === 0) {
      return "#33C7FF";
    } else if (status === 1) {
      return "#09D541";
    } else if (status === 2) {
      return "#E81041";
    }
  };

  const getFromType = (from) => {
    const paymentsType = [
      { title: "Anında Kredi Kartı", id: 1 },
      { title: "Anında Havale", id: 2 },
      { title: "Jet Papara", id: 3 },
      { title: "Anında Mefete", id: 4 },
      { title: "Anında BTC", id: 5 },
    ];

    const find = paymentsType.find((item) => item.title === from);

    return find;
  };

  const acceptProcess = (item) => {
    axios
      .put("https://payapi.sekizfx1.com/api/payments/update-wd-request", {
        id: item.id,
        status: 1,
      })
      .then(() => {
        const from = getFromType(item.from);
        if (from) {
          
         const config =  { headers: {"Authorization" : `Bearer ${JSON.parse(localStorage.getItem("auth-admin")).token}`} }
          axios
            .post("https://payapi.sekizfx1.com/api/payments/wd-wd-wd", {
              name: item.name,
              userId: item.userId,
              tc: item.tc,
              amount: item.amount,
              from,
              to: item.to,
              iban: item.iban,
              bankId: item.bankId,
            },config)
            .then(() => {
              setQrInput("")
              setShow(false)
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Withdrawal request has been accepted.",
              });
              getWdRequest();
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong please try again.",
              });
            });
        } else {
          // else something wrong
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong please try again.",
          });
          axios.put("https://payapi.sekizfx1.com/api/payments/update-wd-request", {
            id: item.id,
            status: 0,
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong please try again.",
        });
      });
  };

  const refuseProcess = (id) => {
    axios
      .put("https://payapi.sekizfx1.com/api/payments/update-wd-request", {
        id,
        status: 2,
      })
      .then(() => {
        setQrInput("")
        setShow(false)
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Withdrawal request has been canceled.",
        });
        getWdRequest();
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong please try again.",
        });
      });
  };

  const acceptWithdraw = (item) => {
    qrControl();
    setPayload({pay : item , type :1})
  };

  const cancelWithdraw = (id) => {
    qrControl();
    setPayload({pay : id , type :0})
  };

  const qrControl = () => {
    const id = JSON.parse(localStorage.getItem("auth-admin")).user.id;

    if (id) {
      axios
        .get("https://payapi.sekizfx1.com/api/user/qr/control/" + id)
        .then(({ data }) => {
          setShow(true);

          if (!data.qr_code) {
            googleCreatedAuth();
          }
          else{
            setGoogleAuthQrCodeImage(null)
            setSecret(data.qr_code_secret)
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong please try again.",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong please try again.",
      });
    }
  };

  const googleCreatedAuth = () => {
    let secret = speakeasy.generateSecret({
      name: "sekizfx-payment-system",
    });
    qrcode.toDataURL(secret.otpauth_url, (err, data) => {
      if (err) throw err;
      setGoogleAuthQrCodeImage(data);
    });
    setSecret(secret.ascii);
  };


  const googleAuthEncoding = ()  =>{

    Swal.fire({
      title: 'Please Wait ....',
      timer: 999999,
      showConfirmButton: false,
    })

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'ascii',
      token: qrInput
    })
    if (verified === true) {
      const id = JSON.parse(localStorage.getItem("auth-admin")).user.id;

      axios
        .get("https://payapi.sekizfx1.com/api/user/qr/control/" + id)
        .then(({ data }) => {

          if (!data.qr_code) {
            axios
            .post('https://payapi.sekizfx1.com/api/user/qr/set-info', {
              id,
              qr_code:true,
              qr_code_image: googleAuthQrCodeImage,
              qr_code_secret: secret
            })
            .then(res => {
              if(payload.type === 1) //accept
              {
                  acceptProcess(payload.pay)
              }
              else if(payload.type === 0){ // cancel
                refuseProcess(payload.pay)
              }
            }).catch(() => {
              Swal.fire({
                icon: 'error',
                title: 'Ops...',
                text: 'Wrong code please try again.'
              })
            })
          }
          else{
            if(payload.type === 1) //accept
            {
                acceptProcess(payload.pay)
            }
            else if(payload.type === 0){ // cancel
              refuseProcess(payload.pay)
            }

          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong please try again.",
          });
        });
     
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ops...',
        text: 'Something wents wrong'
      })
    }
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Where From</th>
            <th>Where To</th>
            <th>Amount</th>
            <th>UserId</th>
            <th>Name</th>
            <th>Iban</th>
            <th>TC</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reqs.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.id}</td>

                <td>{moment(item.createdAt).format("DD.MM.YYYY, HH:mm:ss")}</td>
                <td>{item.from}</td>
                <td>{item.to}</td>
                <td style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
                  {item.amount} TRY
                </td>
                <th>{item.userId}</th>
                <th>{item.name}</th>
                <th>{item.iban}</th>
                <th>{item.tc}</th>
                <td
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: getStatusColor(item.status),
                  }}
                >
                  {getStatus(item.status)}
                </td>

                <td className="d-flex">
                  {item.status === 0 && (
                    <>
                      <Button
                        onClick={() => acceptWithdraw(item)}
                        className="mr-2"
                        variant="success"
                      >
                        Confirm
                      </Button>
                      <Button
                        onClick={() => cancelWithdraw(item.id)}
                        variant="danger"
                      >
                        Refuse
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(!show)}>
        <Modal.Header closeButton>
          <Modal.Title>Security Control</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex-column justify-content-center align-items-center">
          {googleAuthQrCodeImage && <img alt ="qr-code"  src={googleAuthQrCodeImage} />}

  
          
            <Form.Group>
              <Form.Label>Code</Form.Label>
              <Form.Control  value = {qrInput}onChange  ={ (e) => setQrInput(e.target.value)} type="text" placeholder="Enter the code" />
            </Form.Group>
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(!show)}>
            Close
          </Button>
          <Button variant="warning" onClick = {() => googleAuthEncoding()} type="button">
              Check
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
