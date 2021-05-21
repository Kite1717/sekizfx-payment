import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

export default function WithdrawRequest({ reqs, getWdRequest }) {
  const [show, setShow] = useState(false);

  const [googleAuthQrCodeImage, setGoogleAuthQrCodeImage] = useState(null);

  const [secret, setSecret] = useState(null);

  const [qrInput, setQrInput] = useState("");

  const [payload, setPayload] = useState(null);

  const getStatus = (status) => {
    if (status === 0) {
      return "Bekliyor";
    } else if (status === 1) {
      return "Kabul Edildi";
    } else if (status === 2) {
      return "İptal";
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
          const config = {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("auth-admin")).token
              }`,
            },
          };
          axios
            .post(
              "https://payapi.sekizfx1.com/api/payments/wd-wd-wd",
              {
                name: item.name,
                userId: item.userId,
                tc: item.tc,
                amount: item.amount,
                from,
                to: item.to,
                iban: item.iban,
                bankId: item.bankId,
              },
              config
            )
            .then(() => {
              setQrInput("");
              setShow(false);
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Çekim isteği başarıyla kabul edilmiştir.",
              });
              getWdRequest();
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "Ödeme Sistemi Hatası",
                text: "Birşeyler ters gitti.Lütfen tekrar deneyiniz.",
              });
              axios.put(
                "https://payapi.sekizfx1.com/api/payments/update-wd-request",
                {
                  id: item.id,
                  status: 0,
                }
              );
            });
        } else {
          // else something wrong
          Swal.fire({
            icon: "error",
            title: "Geçersiz Ödeme Yöntemi Hatası",
            text: "Birşeyler ters gitti.Lütfen tekrar deneyiniz.",
          });
          axios.put(
            "https://payapi.sekizfx1.com/api/payments/update-wd-request",
            {
              id: item.id,
              status: 0,
            }
          );
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Veri tabanı Hatası",
          text: "Birşeyler ters gitti.Lütfen tekrar deneyiniz.",
        });
        axios.put(
          "https://payapi.sekizfx1.com/api/payments/update-wd-request",
          {
            id: item.id,
            status: 0,
          }
        );
      });
  };

  const refuseProcess = (id) => {
    axios
      .put("https://payapi.sekizfx1.com/api/payments/update-wd-request", {
        id,
        status: 2,
      })
      .then(() => {
        setQrInput("");
        setShow(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Çekim talebi iptal edilmiştir.",
        });
        getWdRequest();
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Veri tabanı Hatası",
          text: "Birşeyler ters gitti.Lütfen tekrar deneyiniz.",
        });
      });
  };

  const acceptWithdraw = (item) => {
    qrControl();
    setPayload({ pay: item, type: 1 });
  };

  const cancelWithdraw = (id) => {
    qrControl();
    setPayload({ pay: id, type: 0 });
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
          } else {
            setGoogleAuthQrCodeImage(null);
            setSecret(data.qr_code_secret);
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Veri tabanı Hatası",
            text: "Birşeyler ters gitti.Lütfen tekrar deneyiniz.",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Sistem Dışı Kullanıcı",
        text: "Birşeyler ters gitti.Lütfen tekrar deneyiniz.",
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

  const googleAuthEncoding = () => {
    Swal.fire({
      title: "Lütfen Bekleyin ....",
      timer: 999999,
      showConfirmButton: false,
    });

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "ascii",
      token: qrInput,
    });
    if (verified === true) {
      const id = JSON.parse(localStorage.getItem("auth-admin")).user.id;

      axios
        .get("https://payapi.sekizfx1.com/api/user/qr/control/" + id)
        .then(({ data }) => {
          if (!data.qr_code) {
            axios
              .post("https://payapi.sekizfx1.com/api/user/qr/set-info", {
                id,
                qr_code: true,
                qr_code_image: googleAuthQrCodeImage,
                qr_code_secret: secret,
              })
              .then((res) => {
                if (payload.type === 1) {
                  //accept
                  acceptProcess(payload.pay);
                } else if (payload.type === 0) {
                  // cancel
                  refuseProcess(payload.pay);
                }
              })
              .catch(() => {
                Swal.fire({
                  icon: "error",
                  title: "Veri tabanı hatası",
                  text: "Birşeyler ters gitti.Lütfen tekrar deneyiniz.",
                });
              });
          } else {
            if (payload.type === 1) {
              //accept
              acceptProcess(payload.pay);
            } else if (payload.type === 0) {
              // cancel
              refuseProcess(payload.pay);
            }
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Veri tabanı hatası",
            text: "Birşeyler ters gitti.Lütfen tekrar deneyiniz.",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Kod Hatası",
        text: "Kodunuz Eşlemişmiyor.",
      });
    }
  };

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Tarih</th>
            <th>Sistem Tipi</th>
            <th>Oyuncu Numarası</th>
            <th>Miktar</th>
            <th>Kullancı ID</th>
            <th>Ad Soyad</th>
            <th>IBAN</th>
            <th>TC</th>
            <th>Durum</th>
            <th>İşlemler</th>
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
                  {item.amount} TL
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
                        Kabul Et
                      </Button>
                      <Button
                        onClick={() => cancelWithdraw(item.id)}
                        variant="danger"
                      >
                        Reddet
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
          <Modal.Title>Güvenlik Kontrolü</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex-column justify-content-center align-items-center">
          {googleAuthQrCodeImage && (
            <img alt="qr-code" src={googleAuthQrCodeImage} />
          )}

          <Form.Group>
            <Form.Label>Kod</Form.Label>
            <Form.Control
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              type="text"
              placeholder="Enter the code"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(!show)}>
            Kapat
          </Button>
          <Button
            variant="warning"
            onClick={() => googleAuthEncoding()}
            type="button"
          >
            Eşleştir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
