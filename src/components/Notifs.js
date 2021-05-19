import React from "react";
import { Alert, Row, Col } from "react-bootstrap";
function Notifs({ notifs }) {
  console.log(notifs, "wwwwwwww");
  return (
    <>
      {notifs.reverse().map((item, index) => {
        if (item.type === 0) {
          return (
            <Row key={index}>
              <Col sm={8}>
                <Alert variant="success">
                  <strong>Deposit</strong>&nbsp;&nbsp;&nbsp;&nbsp;Amount :{" "}
                  <strong>{item.amount}</strong> TRY&nbsp;&nbsp;&nbsp;&nbsp;To :{" "}
                  {item.to}&nbsp;&nbsp;&nbsp;&nbsp; From :{" "}
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
                  <strong>Withdraw Request</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp;Amount :{" "}
                  <strong>{item.amount}</strong> TRY&nbsp;&nbsp;&nbsp;&nbsp;To :{" "}
                  {item.to}&nbsp;&nbsp;&nbsp;&nbsp; From :{" "}
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
