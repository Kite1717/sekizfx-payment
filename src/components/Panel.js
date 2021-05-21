import React, { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import Settings from "./Settings";
import {  Table } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import WithdrawRequest from "./WithdrawRequest";
import useSound from 'use-sound';
import noti from '../assets/noti.mp3'

import Notifs from '../components/Notifs'
const MINUTE_MS = 9000;

function Panel({ setUser, setIsAdminLogin }) {
  const [rawData, setRawData] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [type, setType] = useState(-1);


  
  //noti sound
  const [play] = useSound(noti);

  //notifaticons
  const [notifs,setNotifs] = useState([])

  // withdraw request
  const [reqs, setReqs] = useState([]);


  //get with draw requests
  const getWdRequest = () => {
    axios
      .get("https://payapi.sekizfx1.com/api/payments/all-wd-request")
      .then(({ data }) => {
        setReqs(data.requests);
      });
  };
   //init withdraw request
   useEffect(() => {
    
    getWdRequest()
  }, []);

  //withdraw Alert
  useEffect(() => {
    const interval = setInterval(() => {
      axios
      .get("https://payapi.sekizfx1.com/api/payments/all-wd-request")
      .then(({ data }) => {
        if(data.requests.length > reqs.length) // notif alert
        {
            notifs.push(data.requests[0])
            setNotifs(notifs)
            play()
           
        }
        setReqs(data.requests);
      });
    
    }, MINUTE_MS );
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [reqs])



  //Deposit Alert
  useEffect(() => {
    const interval = setInterval(() => {
      axios
      .get("https://payapi.sekizfx1.com/api/payments/all-transfers")
      .then(({ data }) => {
        if(data.transfers.length > rawData.length)
        {

          if(data.transfers[0].type === 0 )
          {
            notifs.push(data.transfers[0])
            setNotifs(notifs)
            play()
          }
          
          
        }
        setRawData(data.transfers);
      });
    
    }, MINUTE_MS );
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [rawData])

  //init deposit-withdraw
  useEffect(() => {
    axios
      .get("https://payapi.sekizfx1.com/api/payments/all-transfers")
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
      return "Yatırma";
    } else if (type === 1) {
      return "Çekim";
    } else if (type === 2) {
      return "Çekim İptal";
    }
  };

  const getStatus = (status) => {
    if (status === 0) {
      return "Bekliyor";
    } else if (status === 1) {
      return "Başarılı";
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
      return "#E11717";
    }
  };

  const getTitle = () => {
    if (type === -1) {
      return "Bütün İşlemler";
    } else if (type === 0) {
      return "Yatırımlar";
    } else if (type === 1) {
      return "Çekimler";
    } else if (type === 2) {
      return "Çekim İptaller";
    }
    else if(type === 3)
    {
      return "Ayarlar";
    }
    else if(type === 4)
    {
      return "Çekim Talepleri"
    }
  };

  const renderFunction = () =>{

    if(type === 3)
    {
      return(
        <Settings />
      )
    }
    else if(type === 4)
    {
      return <WithdrawRequest reqs ={reqs} getWdRequest={getWdRequest}/>
    }
    else{

      return(
        <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Tarih</th>
            <th>Sistem Tipi</th>
            <th>Oyuncu Numarası</th>
            <th>Tip</th>
            <th>Miktar</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.id}</td>

                <td>
                  {moment(item.createdAt).format("DD.MM.YYYY, HH:mm:ss")}
                </td>
                <td>{item.from}</td>
                <td>{item.to}</td>
                <td>{getType(item.type)}</td>
                <td>{item.amount} TL</td>
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
      )
    }

  }
  return (
    <>
      <AdminMenu
        setType={setType}
        setUser={setUser}
        setIsAdminLogin={setIsAdminLogin}
      />
      <h4 className="mt-5">{getTitle()}</h4>
      <Notifs notifs={notifs}/>
      {renderFunction()}
    </>
  );
}

export default Panel;
