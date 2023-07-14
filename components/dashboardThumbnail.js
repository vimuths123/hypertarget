/* eslint-disable react/jsx-no-duplicate-props */
import {
    Button,
    Card,
    Container,
    Grid,
    Image,
    Input,
    Modal,
    Text,
  } from "@nextui-org/react";
  import React, { useState, useEffect, useRef } from "react";
  import {
    paymentService,
    personalPixelService,
    userJourneyService,
    websiteService,
  } from "../services";
  import 'react-calendar/dist/Calendar.css';
  import { TransformWrapper, TransformComponent , } from "react-zoom-pan-pinch";
  import  SSListingAuto from "./userJourneySSListforThumb"
  import ScrollContainer from 'react-indiana-drag-scroll'
  import Cookies from 'js-cookie';
  import MyPage from "./zoomin-zoom-out";
  
  const DashboardThumbnail = ({website_id }) => {
  
    const [userJourneyArr, setUserJourneyArr] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isverified, setisverified] = useState(false);
    const [xArrowloading, setxArrowloading] = useState(false);
    const [session, setSession] = useState("");
    const [scriptcode, setScriptcode] = useState("");
  
  
  useEffect(() => {
    const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
    const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;
    const id=website_id
    setSession({user,accessToken})

    const checkIsVerified=async ()=>{
        const alredyVerifiedtest=await personalPixelService.verifyPixel({user,accessToken}, website_id)
        setisverified(alredyVerifiedtest?.verified)
        if(alredyVerifiedtest?.verified==true){
            getJourneys()
            xArroeDisp()
        }
     else{
        let scriptText = `
        <script type="text/javascript" src="https://api.hypertarget.ai/"></script>
        <script type="text/javascript">        
        function onloadFunction(){     
                HYPERSNIPPET.initURL([${website_id},${user.id}]);
            }
            window.onload = onloadFunction()
            document.onclick = function (event) {
                HYPERSNIPPET.analyzer(event,sessionStorage.getItem("key"),isLoadedForClick);
            }
            window.addEventListener("beforeunload", function (e) {
                e.preventDefault();
            })
        </script>`
    
        setScriptcode(scriptText)
        }
    }

    const getJourneys=async ()=>{
        const userJourneyResponse = await userJourneyService.getUserJourneysAuto(
            {user,accessToken},
            website_id
          );
          //console.log("User Journeys x", userJourneyResponse);
          if (userJourneyResponse.status == 200) {
            setUserJourneyArr(userJourneyResponse.userjourneys)
                }
        }

        checkIsVerified()
    
  }, [])
  
  
  useEffect(() => {
   if(loading==false){
    xArroeDisp();
   }
  
   
  }, [userJourneyArr]);
  
  
  const xArroeDisp=async ()=>{
    setxArrowloading(false);
    await setTimeout(() => {
      setLoading(false)
      setxArrowloading(true);
    }, 2000);
  }
  
  
    return (<>

      {isverified?
      <div className="scroll-container">
      <div className="" style={{width:'auto',height:"90vh",zoom:"0.3"}}>
      {userJourneyArr && userJourneyArr.length>0 && userJourneyArr.map((item,id)=>{
            if(id==0){return <>
            <SSListingAuto item={item} id={id} key={id} showXarrow={xArrowloading} websiteId={website_id}/>
            </>}
          })}
  
      </div>
      </div>:<>
      <Container lg css={{ width: '100%',zoom:"0.5",overflow:"hidden" }}>
        <Grid.Container>
          <Grid lg={12} md={12} sm={12} xs={12} justify='center'>
            <Card>
              <Card.Body css={{ padding: '10px 40px', height: '60vh',overflow:"hidden" }}>
                <Text
                  h3
                  css={{ textAlign: 'center', color: 'var(--button_blue)' }}
                >
                  Add The Hypertarget Pixel To Your Site
                </Text>
                {/* <Textarea  minRows={10} disabled fullWidth placeholder="Loading pixel"
                                    value={website && website.websiteId ? renderPixelCode(website.websiteId, session && session.user.id) : 'Loading'}
                                /> */}
                <div className='pixeldispBox' style={{overflow:"hidden"}}>
                  {scriptcode}
                </div>
              </Card.Body>
              <Card.Footer>
                <Grid.Container gap={4}>
                  <Grid lg={3} md={3} sm={3} xs={0} />
                  <Grid lg={3} md={3} sm={3} xs={12} justify='center'>
                    <Button
                      disabled={false}
                      className='hyper-btn hyper-btn1'
                      size='lg'
                    >
                      Copy Code
                    </Button>
                  </Grid>
                  <Grid lg={3} md={3} sm={3} xs={12} justify='center'>
                    <Button
                      disabled={false}
                      className='hyper-btn hyper-btn2'
                      size='lg'
                    >
                      {'Verify Installation'}
                    </Button>
                  </Grid>
                  <Grid lg={3} md={3} sm={3} xs={0} />
                 
                </Grid.Container>
              </Card.Footer>
            </Card>
          </Grid>
        </Grid.Container>
      </Container>
      </>}
      </>
    );
  };
  
  
  export default DashboardThumbnail;
  