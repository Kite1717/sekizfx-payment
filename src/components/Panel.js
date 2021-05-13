import React, { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import Settings from "./Settings";
import { Table } from "react-bootstrap";
import moment from "moment";
import axios from "axios";

function Panel({ setUser, setIsAdminLogin }) {
  const [rawData, setRawData] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [type, setType] = useState(-1);
  useEffect(() => {
    axios
      .get("http://localhost:4200/api/payments/all-transfers")
      .then(({ data }) => {
        setRawData(data.transfers);
        setTransfers(data.transfers);
      });
  }, []);

  useEffect(() => {
    if (type === -1) {
      setTransfers(rawData);
    } else {
      setTransfers(rawData.filter((item) => Number(item.type) === type));
    }
  }, [type]);

  const getType = (type) => {
    if (type === 0) {
      return "Deposit";
    } else if (type === 1) {
      return "WithDraw";
    } else if (type === 2) {
      return "WithDrawCancel";
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

  const getTitle = () => {
    if (type === -1) {
      return "All Transfers";
    } else if (type === 0) {
      return "Deposits";
    } else if (type === 1) {
      return "Withdraws";
    } else if (type === 2) {
      return "Withdraw Cancels";
    }
    else if(type === 3)
    {
      return "Settings";
    }
  };
  return (
    <>
      <AdminMenu
        setType={setType}
        setUser={setUser}
        setIsAdminLogin={setIsAdminLogin}
      />
      <h4 className="mt-5">{getTitle()}</h4>
      {type !== 3 ? (
        <>
       
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

                    <td>
                      {moment(item.createdAt).format("DD.MM.YYYY, h:mm:ss")}
                    </td>
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
        </>
      ) : (
        <Settings />
      )}
    </>
  );
}

export default Panel;
