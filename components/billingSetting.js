/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/alt-text */
import { Card, Grid, Image, Spacer,Input, Text, Loading,Button, Checkbox, Modal } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Cookies from 'js-cookie';
import { paymentService } from "../services";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import CardPopup from "./cardChangePopup";

function BillingSetting({ website_Id, name, date }) {
    const router = useRouter();
    const [session, setSession] = useState("");
    const [error, setError] = useState("");
    const [pageLoading, setPageLoading] = useState(true)
    const [isOpenChangeCard, setIsOpenChangeCard] = useState(false)
    const [formLoading, setformLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileError, setProfileError] = useState("")
    const [cardData, setCardData] = useState('')
    const [customerData, setCustomerData] = useState('')
    const [payHistory, setPayHistory] = useState([])

    const [cardDataError, setCardDataError] = useState('')
    const [customerDataError, setCustomerDataError] = useState('')
    const [payHistoryError, setPayHistoryError] = useState('')
  
    useEffect(() => {
      
      const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
      const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;
        if (!user || !accessToken) {
        router.push('/auth/signIn')
      }
      else if ( user && accessToken && user.isSubscribed) {
        setSession({user,accessToken})
        getCardInfo({user,accessToken})
        getPayHistory({user,accessToken})
        setPageLoading(false)
      } else if(user && accessToken){
        setSession({user,accessToken})
        paymentService.isSubscribed({user,accessToken}).then((res)=>{
          if(res.status==200 && res.isSubscribed==false){
            router.push('/pricing')
          }else{
            getCardInfo({user,accessToken})
            getPayHistory({user,accessToken})
            setPageLoading(false)
          }
        })
        
      }else{
        setLoading(true)
      }
    }, [])

    const getPayHistory=async (sessionData)=>{
      await paymentService.getPayHistory(sessionData).then((res)=>{
        if(res.status==200){
          setPayHistory(res.allPayments)
        }else{
          setPayHistoryError("something went wrong!")
        }
      })
    }

    const getCardInfo=async (sessionData)=>{
      setCardData('')
      setCustomerData('')
      setIsOpenChangeCard(false)
      await paymentService.getCardData(sessionData).then((res)=>{
        console.log("res:",res)
        if(res.status==200){
          setCardData(res.cardInfo.data[0])
          setCustomerData(res.customerInfo)
        }else{
          setCustomerDataError("something went wrong!")
          setCardDataError("something went wrong!")
        }
      })
    }

    const getDate=(val)=>{
      var dateReturn=new Date(val * 1000)
      return dateReturn.toDateString()
    }


    return (
      <Grid
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "100%",
          cursor: "pointer",
        }}
      >
        <Modal
    closeButton
    width="60vw"
    blur
    aria-labelledby="modal-title"
    css={{background:"white",paddingTop:"0px"}}
    open={isOpenChangeCard}
    onClose={()=>{setIsOpenChangeCard(false)}}
  >
    <div style={{background:"var(--nextui-colors-white)",padding:"0",width:"60vw",justifyContent:"center"}}>
    <CardPopup sessionData={session} cardData={cardData} customerData={customerData} getCardInfo={()=>{getCardInfo(session)}} />
  </div>
  </Modal>
        <Grid.Container css={{ justifyContent: "flex-start" }}>
          <Grid lg={8} md={8} sm={12} xs={12} css={{padding:"10px", paddingLeft:"5vw",paddingRight:"5vw"}}>
            <Grid.Container css={{justifyContent:"left"}}>
            <Grid css={{ alignContent: "flex-start",justifyContent:"center",width:"100%", }}>
            <Grid
                xs={12}
                css={{
                  padding: "20px",
                  paddingLeft: "0px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
               <Text h3>Your Card</Text>
              </Grid>
              
              <Cards
                      name={customerData?customerData.name:"Loading..."}
                      number={cardData?`**** **** **** ${cardData.card.last4}`:"**** **** **** 0000"}
                      expiry={cardData?`${cardData.card.exp_month}/${cardData.card.exp_year}`:"00/00"}
                      cvc='***'
                      preview={true}
                      issuer={cardData?cardData.card.brand:"visa"}
                      
                    />
                     
            </Grid>


            <Grid css={{width:"100%",marginTop:"40px"}}>
            <Grid
                xs={12}
                css={{
                  padding: "20px",
                  paddingLeft: "0px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
               <Text h3>Payment History</Text>
              </Grid>
              {payHistory && payHistory.length>0?<>
                <Grid.Container css={{padding:"10px",justifyContent:"center",borderBottom: "2px solid #EAEAEA !important"}}> 
                  <Grid css={{justifyContent:"center"}} xs={0} sm={4}><Text h5 css={{margin:"0px"}}>Date</Text></Grid>
                  <Grid xs={4} sm={3} css={{justifyContent:"center"}}><Text h5 css={{margin:"0px"}}>Amount</Text></Grid>
                  <Grid xs={4} sm={2} css={{justifyContent:"center"}}><Text h5 css={{margin:"0px"}}>IsPaid</Text></Grid>
                  <Grid xs={4} sm={3} css={{justifyContent:"center"}}><Text h5 css={{margin:"0px"}}>Receipt</Text></Grid>
                </Grid.Container>
             
              {payHistory.map((item,id)=>{
                return <Grid.Container css={{padding:"10px",justifyContent:"center",borderBottom: "2px solid #EAEAEA !important"}}> 
                  <Grid xs={0} sm={4} css={{justifyContent:"center"}}>{getDate(item.created)}</Grid>
                  <Grid xs={4} sm={3} css={{justifyContent:"center"}}>{item.amount/100} USD</Grid>
                  <Grid xs={4} sm={2} css={{justifyContent:"center"}}>{item.charges.data[0].paid==true?"true":"false"}</Grid>
                  <Grid xs={4} sm={3} css={{justifyContent:"center"}}><Button size={"xs"} css={{width:"10% !important"}} onClick={()=>{
                    window.open(item.charges.data[0].receipt_url, '_blank');
                  }}>View</Button></Grid>
                </Grid.Container>
              })}
              </> 
              : <Grid.Container css={{justifyContent:"center",minHeight:"20vh"}}>
                <Loading />
                </Grid.Container>}
                    {/* <Image width={"100%"} src="/images/payHis.png" /> */}
                    </Grid>
                    </Grid.Container>
          </Grid>

          <Grid
            lg={4}
            md={4}
            sm={12}
            xs={12}
            css={{ border: "2px solid #EAEAEA !important" }}
          >
            <Grid.Container css={{ alignContent: "center" }}>

              <Grid
                xs={12}
                css={{
                  padding: "20px",
                  width: "100%",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                <Card css={{ background: "transparent !important" }}>
                <Grid.Container css={{ alignContent: "flex-start" }}>
                <Grid
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        css={{ justifyContent: "center", padding: "5px",marginBottom:"20px" }}
                      >
                        <Button
                          disabled={false}
                          className="hyper-btn"
                          size="md"
                          onPress={() => {
                            setIsOpenChangeCard(true)
                          }}
                          css={{
                            background: "white !important",
                            color: "#0F6A91 !important",
                            borderRadius: "1px",
                            border: "#0F6A91 1px solid",
                          }}
                        >
                          Edit Payment Info
                        </Button>
                      </Grid>
              <Grid
                xs={12}
                css={{
                  paddingLeft: "0px",
                  paddingBottom:"20px",
                  paddingRight:"0px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Text h3 css={{margin:"0px"}}>Payment Details</Text>
              </Grid>
              <Grid
                xs={12}
                css={{
                  paddingLeft: "0px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {profileLoading?
                <Loading css={{width:"100px",height:"100px",borderRadius: "100%"}} />:<Image
                  src={(session && session.user.profilePhoto)?session.user.profilePhoto:'/images/profilepic.png'}
                  alt="Main Logo"
                  objectFit="cover"
                  loading="lazy"
                  width={"100px"}
                  height={"1000px !imprtant"}
                  css={{ borderRadius: "100%",maxHeight:"100px" }}
                />}
              </Grid>
              <Grid
                xs={12}
                css={{
                  padding: "10px",
                  paddingLeft: "0px",
                  paddingRight:"0px",
                  paddingBottom:"20px",
                  width: "100%",
                  justifyContent: "center",
                  borderBottom:"2px solid #EAEAEA !important"
                }}
              >
                <Text h5 css={{margin:"0px"}}>{session && session.user.name}</Text>
              </Grid>

              <Grid
                xs={12}
                css={{
                  padding: "10px",
                  paddingLeft: "0px",
                  paddingRight:"0px",
                  paddingBottom:"0px",
                  width: "100%",
                  justifyContent: "center",/* 
                  borderBottom:"2px solid #EAEAEA !important" */
                }}
              >
                <p style={{margin:"0px",color:"#6F7399"}}>Billing Plan</p>
              </Grid>

              <Grid
                xs={12}
                css={{
                  padding: "10px",
                  paddingLeft: "0px",
                  paddingRight:"0px",
                  paddingBottom:"20px",
                  width: "100%",
                  justifyContent: "center",
                  borderBottom:"2px solid #EAEAEA !important"
                }}
              >
                <Text h5 css={{margin:"0px",color:"#6F7399"}}>{session && session.user.subscribed_package.packageName.toUpperCase()} / {session && session.user.subscribed_package.packageType.toUpperCase()}</Text>
              </Grid>
             
            
            </Grid.Container>

                  <Card.Footer>
                    <Grid.Container
                      css={{ justifyContent: "center", padding: "10px" }}
                    >

                      <Grid
                        xl={3}
                        lg={3}
                        md={4}
                        sm={4}
                        xs={12}
                        css={{ justifyContent: "center", padding: "5px" }}
                      >
                        <Button
                          disabled={loading}
                          size="md"
                          className="hyper-btn"
                          onPress={() => {}}
                          css={{ borderRadius: "1px" }}
                          onClick={() => {
                          }}
                        >
                          {formLoading ? <Loading color="success" /> : "continue"}
                        </Button>
                      </Grid>
                      {error && error.length > 0 && (
                        <Grid
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          justify="center"
                          css={{ textAlign: "center", color: "red" }}
                        >
                          {error}
                        </Grid>
                      )}
                    </Grid.Container>
                  </Card.Footer>
                </Card>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Grid>
    );

}

export default BillingSetting;