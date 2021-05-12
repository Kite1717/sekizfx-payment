import axios from "axios";
import React, { useState, useEffect } from "react";

import { Container, Row, Col ,Spinner} from "react-bootstrap";
import ToggleButton from "react-toggle-button";
import Swal from "sweetalert2";

const  makeid = (length)  =>{
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}
function Settings() {
  const [withDrawToggle, setWithDrawToggle] = useState(false);
  const [depositToggle, setDepositToggle] = useState(false);
  const [loading, setLoading] = useState(true);

  const [googleAuth,setGoogleAuth] = useState(false)

  //get Admin Info
  useEffect(() => {
     

    const email = JSON.parse(localStorage.getItem("auth-admin")).user.email
   axios.post("https://payapi.sekizfx1.com/api/user/auth-sign",{email,}).then((res)=>{
       
  /* if(res.data.authSign === true)
   {
    getSettings()
   }
   else{
       setLoading(false)
   }
   setGoogleAuth(res.data.authSign) */
   getSettings()
   })
   .catch(()=>{
       setLoading(false)
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Somethings went wrong",
      });
   })
  }, [])


  
//get settings
  const getSettings = ()=>{
      setLoading(true)
    axios
    .get("https://payapi.sekizfx1.com/api/user/setting/all")
    .then(({ data }) => {
      let { settings } = data;

      settings.forEach((item) => {
        if (item.name === "deposit") {
          setDepositToggle(item.status);
        } else if (item.name === "withdraw") {
          setWithDrawToggle(item.status);
        }
      });

      setLoading(false)
    })
    .catch(() => {
      setLoading(false)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Somethings went wrong",
      });
    });

  }


  //https://www.authenticatorApi.com/pair.aspx?AppName=MyApp&AppInfo=John&SecretCode=12345678BXYT
  const changeSettings = (type) => {

    setLoading(true)
    let body = {}
    if(type === "deposit")
    {
        body.name = "deposit"
        body.status = !depositToggle
        
    }
    else if(type = "withdraw"){
        body.name = "withdraw"
        body.status = !withDrawToggle
        
    }

    axios.put("https://payapi.sekizfx1.com/api/user/setting/update",body).then(()=>{

    if(body.name ==="deposit")
    {
        setDepositToggle(!depositToggle)
    }
    else if(body.name = "withdraw"){
        setWithDrawToggle(!withDrawToggle)
    }

    setLoading(false)

    }).catch(()=>{
        setLoading(false)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Somethings went wrong",
          });
    })

    
  };
  return (
    <Container>   
      <Row>
        <Col sm={2}>
          {loading ? (
            <Spinner animation="border" variant="success" />
          ) : (
            <>
              <div className="d-flex justify-content-between ">
                <h5 className="mt-1 mr-3">Deposit</h5>
                <ToggleButton
                  value={depositToggle}
                  onToggle={() => {
                    changeSettings("deposit");
                  }}
                />
              </div>

              <div className="d-flex justify-content-between ">
                <h5 className="mt-1 mr-3">WithDraw</h5>
                <ToggleButton
                  value={withDrawToggle}
                  onToggle={() => {
                    changeSettings("withdraw");
                  }}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;
