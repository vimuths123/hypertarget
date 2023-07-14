/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef } from "react";
import { Button, Card, Dropdown, Grid, Input, Text } from "@nextui-org/react";
import { useState } from "react";
import { websiteService, userJourneyService, paymentService } from "../services";
import sendEmail from "./emailSend";
import { useRouter } from "next/router";

function ShareComponent({user,session,filterToken,id}) {
  console.log(filterToken)
    const [isAnyoneCan, setIsAnyonecan] = useState(true)
    const [website,setWebsite]=useState("")
    const [waitRes,setWaitRes]=useState(false)
    const [emails,setEmails]=useState("")
    const [baseUrl,setBaseUrl]=useState("")
    const [filter,setFilter]=useState(null)
    const [error,setError]=useState({type:"",msg:""})

    const router = useRouter();
  

    useEffect(() => {
        const getWebsite=async()=>{
          const websiteResponse = await websiteService.getWebsiteByUser(session,id);
          //console.log("websiteResponseShare :",websiteResponse)
        if (websiteResponse.status === 200 ) {
          setWebsite(websiteResponse.website)
          //console.log(websiteResponse.website.shareAllow)
          setIsAnyonecan(websiteResponse.website.shareAllow==true?true:false)
        }
      }
        
        if (session) {
          getWebsite()
          const baseUrl1 = window.location.origin;
          setBaseUrl(baseUrl1)
        }else{
        }
      
      }, [session])

      useEffect(() => {
        if(filterToken){
          setFilter(filterToken)
        }
        else{
          setFilter(null)
        }
      },[filterToken])

    const updateAllowStatus=async (val)=>{
        if(session && website != ""){
            setWaitRes(true)
            const body={
                shareAllow:val
            }
          await userJourneyService.updateShareAllow(session,website?.websiteId,body).then((res)=>{
            console.log("resits :",res)
            if(res.result==true){
                setIsAnyonecan(true)
                setWaitRes(false)
            }else{
                setIsAnyonecan(false)
                setWaitRes(false)
            }
          })
        }
      
    }

    const emailSend=async()=>{
      const emailList=emails.split(",")
      if(validateEmails(emailList)){
        const body={
          shareAllowEmails:emails
      }
        const invitationId=await userJourneyService.updateShareAllowInvites(session,website?.websiteId,body)
        //console.log("invitationId :",invitationId)
        if(filter==null){
          sendEmail({owner:session.user.email,emails:emailList,link:baseUrl+"/userJourneys/automaticallyTrack/share?id=f697c974-f319-47d4-a476-bc7433fb26de",setError:(val)=>{setError(val)}})
        }
        else{
          sendEmail({owner:session.user.email,emails:emailList,link:baseUrl+"/userJourneys/automaticallyTrack/share?id=f697c974-f319-47d4-a476-bc7433fb26de"+"&filterId="+filter,setError:(val)=>{setError(val)}})
        }
        
      }else{
        setError({type:"error",msg:"invalid email type!"})
      }

    }

    const validateEmails = (emails) => {
      const re = /\S+@\S+\.\S+/;
      return emails.every((email) => re.test(email));
    };
    
    
    

  return (
    <div style={{}}>
      <Card>
        <Card.Body
          css={{
            padding: "10px 40px",
            height: "auto",
            overflow:"hidden",
            background: "transparent",
          }}
        >
          <Text h3 css={{ textAlign: "", color: "#201E7B" }}>
            invite
          </Text>
          <Grid.Container gap={2} alignContent="center">
            <Grid lg={8} md={8} sm={8} xs={8}>
              <Input
                css={{ width: "100%" }}
                type="text"
                placeholder="Email comma separaded"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </Grid>
            <Grid lg={4} md={4} sm={4} xs={4}>
              <Button
                size="sm"
                onPress={() => {
                  emailSend();
                }}
                css={{
                  height: "100%",
                  width: "100%",
                  background: "#201E7B",
                  border: "2px solid",
                  borderColor: "#201E7B",
                }}
              >
                <Text
                  size="$xs"
                  weight="bold"
                  css={{ color: "white", letterSpacing: "1px" }}
                >
                  SEND INVITE
                </Text>
              </Button>
            </Grid>
            {error.type !="" && <div style={{color:error.type =="error"?"red":"green",paddingLeft:"20px"}}>{error.msg}</div>}
          </Grid.Container>

          <Grid.Container gap={2} alignContent="center">
            <Grid
              lg={8}
              md={8}
              sm={8}
              xs={8}
              style={{ display: "flex", alignItems: "center" }}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 0.4375C8.10872 0.4375 6.25991 0.998331 4.68736 2.04907C3.11482 3.09981 1.88917 4.59327 1.16541 6.34059C0.441643 8.08791 0.252274 10.0106 0.621245 11.8656C0.990216 13.7205 1.90096 15.4244 3.2383 16.7617C4.57564 18.099 6.27951 19.0098 8.13445 19.3788C9.9894 19.7477 11.9121 19.5584 13.6594 18.8346C15.4067 18.1108 16.9002 16.8852 17.9509 15.3126C19.0017 13.7401 19.5625 11.8913 19.5625 10C19.5595 7.46478 18.5511 5.03425 16.7584 3.24158C14.9658 1.44891 12.5352 0.440477 10 0.4375ZM17.6472 6.4375H13.8803C13.4704 4.73724 12.7228 3.13677 11.6819 1.73125C12.9741 1.9968 14.1864 2.5606 15.2221 3.3777C16.2578 4.19479 17.0882 5.24258 17.6472 6.4375ZM18.4375 10C18.4381 10.8257 18.3172 11.647 18.0784 12.4375H14.1119C14.3794 10.8235 14.3794 9.17649 14.1119 7.5625H18.0784C18.3172 8.35297 18.4381 9.17428 18.4375 10ZM10 18.4375C9.97663 18.4376 9.95349 18.4328 9.93215 18.4232C9.91081 18.4137 9.89175 18.3997 9.87625 18.3822C8.66875 17.0819 7.78188 15.4122 7.28125 13.5625H12.7188C12.2181 15.4122 11.3313 17.0819 10.1238 18.3822C10.1083 18.3997 10.0892 18.4137 10.0679 18.4232C10.0465 18.4328 10.0234 18.4376 10 18.4375ZM7.02907 12.4375C6.74033 10.8253 6.74033 9.17467 7.02907 7.5625H12.9709C13.2597 9.17467 13.2597 10.8253 12.9709 12.4375H7.02907ZM1.5625 10C1.56187 9.17428 1.68286 8.35297 1.92157 7.5625H5.88813C5.62061 9.17649 5.62061 10.8235 5.88813 12.4375H1.92157C1.68286 11.647 1.56187 10.8257 1.5625 10ZM10 1.5625C10.0234 1.56237 10.0465 1.56724 10.0679 1.57678C10.0892 1.58632 10.1083 1.60031 10.1238 1.61781C11.3313 2.91812 12.2181 4.58781 12.7188 6.4375H7.28125C7.78188 4.58781 8.66875 2.91812 9.87625 1.61781C9.89175 1.60031 9.91081 1.58632 9.93215 1.57678C9.95349 1.56724 9.97663 1.56237 10 1.5625ZM8.31813 1.73125C7.27724 3.13677 6.52961 4.73724 6.11969 6.4375H2.35282C2.9118 5.24258 3.74225 4.19479 4.77795 3.3777C5.81364 2.5606 7.02593 1.9968 8.31813 1.73125ZM2.35282 13.5625H6.11969C6.52961 15.2628 7.27724 16.8632 8.31813 18.2687C7.02593 18.0032 5.81364 17.4394 4.77795 16.6223C3.74225 15.8052 2.9118 14.7574 2.35282 13.5625ZM11.6819 18.2687C12.7228 16.8632 13.4704 15.2628 13.8803 13.5625H17.6472C17.0882 14.7574 16.2578 15.8052 15.2221 16.6223C14.1864 17.4394 12.9741 18.0032 11.6819 18.2687Z" fill="black"/>
</svg> &nbsp; 
              Anyone with the link
            </Grid>

            <Grid lg={4} md={4} sm={4} xs={4}>
              <Dropdown isDisabled={waitRes}>
                <Dropdown.Button
                  flat
                  className="hyper-dropdown-elect-event"
                  css={{ color: "#44474a !important" }}
                >
                  {isAnyoneCan?"allow":"don't allow"}
                </Dropdown.Button>
                <Dropdown.Menu
                  selectedKeys={waitRes?"loading":(isAnyoneCan?"allow":"don't allow")} onAction={(value) => updateAllowStatus(value=="enable"?true:false)} selectionMode="single"
                >
                    <Dropdown.Item key={"enable"}>allow</Dropdown.Item>
                    <Dropdown.Item key={"disbale"}>don't allow</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Grid>
          </Grid.Container>

          <Grid.Container gap={2} alignContent="center" css={{
            borderBottom: "1px solid #ccc",
            marginBottom: "20px",}}>
            <Grid
              lg={8}
              md={8}
              sm={8}
              xs={8}
              style={{ display: "flex", alignItems: "center",paddingLeft:"10px" }}
            >
              {user}
            </Grid>
            <Grid lg={4} md={4} sm={4} xs={4}>
              <Dropdown isDisabled={true}>
                <Dropdown.Button
                  flat
                  className="hyper-dropdown-elect-event"
                  css={{ width: "100%", color: "#44474a !important" }}
                >
                  owner
                </Dropdown.Button>
                <Dropdown.Menu
                  /* selectedKeys={step.clickEvent} onAction={(value) => onUpdate(index, 'clickEvent', value)} */ selectionMode="single"
                ></Dropdown.Menu>
              </Dropdown>
            </Grid>
          </Grid.Container>

          <Grid.Container gap={2} alignContent="center">
            <Grid
              lg={12}
              md={12}
              sm={12}
              xs={12}
              style={{ display: "flex", alignItems: "center" ,marginBottom:"20px"}}
            >
              <Button onClick={()=>{navigator.clipboard.writeText(filter==null?baseUrl+"/userJourneys/automaticallyTrack/share?id=f697c974-f319-47d4-a476-bc7433fb26de":(baseUrl+"/userJourneys/automaticallyTrack/share?id=f697c974-f319-47d4-a476-bc7433fb26de&filterId="+filter))}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.3455 16.52L8.91855 17.9052C8.54437 18.279 8.03688 18.489 7.50771 18.489C6.97854 18.489 6.47104 18.279 6.09686 17.9052C5.72268 17.5314 5.51247 17.0244 5.51247 16.4958C5.51247 15.9672 5.72268 15.4602 6.09686 15.0864L9.757 11.4218C10.1162 11.0618 10.6003 10.8535 11.109 10.84C11.6177 10.8265 12.1121 11.0089 12.49 11.3494L12.5867 11.4299C12.7396 11.5794 12.9457 11.6621 13.1596 11.6599C13.3736 11.6576 13.5778 11.5705 13.7275 11.4178C13.8772 11.2651 13.96 11.0592 13.9577 10.8455C13.9555 10.6318 13.8683 10.4277 13.7154 10.2782C13.6699 10.2194 13.6215 10.163 13.5703 10.1091C12.8821 9.5109 11.992 9.19643 11.0804 9.22933C10.1688 9.26222 9.30378 9.64004 8.66057 10.2862L4.95206 13.9508C4.3219 14.636 3.9811 15.5379 4.00081 16.4682C4.02052 17.3985 4.39924 18.2852 5.05786 18.9432C5.71648 19.6012 6.60409 19.9795 7.53532 19.9992C8.46654 20.0189 9.36938 19.6784 10.0553 19.0489L11.45 17.6878C11.5877 17.5377 11.6634 17.3411 11.6619 17.1375C11.6603 16.9339 11.5817 16.7384 11.4417 16.5904C11.3017 16.4425 11.1109 16.3529 10.9075 16.3398C10.7041 16.3268 10.5033 16.3911 10.3455 16.52ZM18.9638 5.05121C18.2856 4.3779 17.3683 4 16.4122 4C15.456 4 14.5387 4.3779 13.8605 5.05121L12.4658 6.41232C12.3281 6.5624 12.2524 6.75902 12.2539 6.96261C12.2555 7.1662 12.3341 7.36166 12.4741 7.50965C12.6141 7.65764 12.805 7.74718 13.0083 7.76026C13.2117 7.77333 13.4125 7.70898 13.5703 7.58013L14.965 6.19486C15.3392 5.82105 15.8467 5.61105 16.3759 5.61105C16.905 5.61105 17.4125 5.82105 17.7867 6.19486C18.1609 6.56866 18.3711 7.07565 18.3711 7.60429C18.3711 8.13293 18.1609 8.63992 17.7867 9.01373L14.1266 12.6783C13.7673 13.0383 13.2833 13.2466 12.7746 13.2601C12.2659 13.2736 11.7714 13.0912 11.3936 12.7507L11.2968 12.6702C11.144 12.5207 10.9379 12.4379 10.7239 12.4402C10.51 12.4425 10.3057 12.5296 10.1561 12.6823C10.0064 12.835 9.92358 13.0409 9.92585 13.2546C9.92812 13.4683 10.0153 13.6724 10.1682 13.8219C10.2267 13.8817 10.2886 13.9382 10.3536 13.991C11.0426 14.5874 11.9323 14.9007 12.8434 14.8678C13.7544 14.8349 14.6192 14.4583 15.2633 13.8139L18.9315 10.1493C19.6098 9.47608 19.9939 8.56209 19.9999 7.60691C20.006 6.65173 19.6335 5.73296 18.9638 5.05121Z" fill="#7395FD"/>
</svg>
 &nbsp; Copy link
 </Button>
            </Grid>
          </Grid.Container>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ShareComponent;
