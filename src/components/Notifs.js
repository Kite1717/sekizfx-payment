import React from "react";
import { Alert, Row, Col } from "react-bootstrap";
function Notifs({ notifs }) {
  return (
    <>
      {notifs.reverse().map((item, index) => {
        if (item.type === 0) {
          return (
            <Row key={index}>
              <Col sm={8}>
                <Alert variant="success">
                  <strong>Yatırma</strong>&nbsp;&nbsp;&nbsp;&nbsp;Miktarı :{" "}
                  <strong>{item.amount}</strong> TL&nbsp;&nbsp;&nbsp;&nbsp;To :{" "}
                  {item.to}&nbsp;&nbsp;&nbsp;&nbsp; Yatırma Tipi :{" "}
                  <strong>{item.from}</strong>
                </Alert>
              </Col>
            </Row>
          );
        } else {
          return (
            <Row key={index}>
              <Col sm={8}>
                <Alert variant="danger">
                  <strong>Çekim İsteği</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp;Miktarı :{" "}
                  <strong>{item.amount}</strong> TL&nbsp;&nbsp;&nbsp;&nbsp;To :{" "}
                  {item.to}&nbsp;&nbsp;&nbsp;&nbsp; Çekim Tipi :{" "}
                  <strong>{item.from}</strong>
                </Alert>
              </Col>
            </Row>
          );
        }
      })}
    </>
  );
}

export default Notifs;
