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
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import Header from "../../../components/Header";
import {
  paymentService,
  personalPixelService,
  userJourneyService,
  websiteService,
} from "../../../services";
import { Calendar } from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { TransformWrapper, TransformComponent , } from "react-zoom-pan-pinch";
import  SSListingAuto from "../../../components/userJourneyAutoSSlisting"
import JourneyAutoFilter from "../../../components/autoUserJournyFilter";
import ScrollContainer from 'react-indiana-drag-scroll'
import Cookies from 'js-cookie';
import MyPage from "../../../components/zoomin-zoom-out";
import jwt, { decode } from 'jsonwebtoken';

const UserJourneyAuto = ({ website,websiteStatus, error,message,pixelVerified,isNotOwnId }) => {
  const router = useRouter();
  const { query } = useRouter();

  const [session, setSession] = useState("");
  const [userJourneyArr, setUserJourneyArr] = useState(website?.userJourney?website.userJourney:[]);
  const [errorMsg, setError] = useState();
  const [model, setModel] = useState({ isOpen: false, success: true });
  const [loading, setLoading] = useState(true);
  const [isAddFilter, setIsAddFilter] = useState(false);
  const [xArrowloading, setxArrowloading] = useState(false);
  const [addFilter, setAddFilter] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState({});
  const [filterUrls,setFilterUrls]=useState([])
  const[filterBody,setFilterbody]=useState([])
  const [filterToken,setFilterToken]=useState(null)
  const clanderIcon=<svg xmlns="http://www.w3.org/2000/svg"  style={{paddingLeft:'auto'}} width="16" height="16" fill="blue" className="bi bi-calendar" viewBox="0 0 16 16">
  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
</svg>


useEffect(() => {
  const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
  const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;
  const id=query.id?query.id:null
  const filterIdGet=query.filterId?query.filterId:null
  if(pixelVerified!=true && isNotOwnId!=true){
    router.push(`/personalPixel?webiteId=${id}`)
  }
  else if (!user || !accessToken) {
    if(id != null){
      router.push(`/userJourneys/automaticallyTrack/share?id=${id}&filterId=${filterIdGet}`)
    }else{
      router.push('/auth/signIn')
    }
    
  }
  else if ( user && accessToken && user.isSubscribed) {
    if(id == null){
      router.push('/dashboard')
    }
    //console.log(session.user.isSubscribed)
    else if(id != null && isNotOwnId==true){
      router.push(`/userJourneys/automaticallyTrack/share?id=${id}&filterId=${filterIdGet}`)
    }
    else{
      setSession({user,accessToken})
      router.query.id = website.websiteId
      router.push(router)

    if (websiteStatus !== 200 || error) {
      setError(message?message:error?error:"error");
      console.log(error)
      router.push(`/personalPixel?webiteId=${id}`);
    }else{
      const testData=async () =>{
        if(filterIdGet != null){
          const decoded = jwt.verify(filterIdGet, process.env.SIMPLE_TOKEN_SECRET);
          if(decoded && decoded.filterUrls && decoded.filterUrls.length>0){
            const userJourneyResponse=await userJourneyService.getUserJourneysAutoFilter({user,accessToken}, website.websiteId,decoded.startDate?decoded.startDate:null,decoded.endDate?decoded.endDate:null,decoded.filterUrls)
            setUserJourneyArr(userJourneyResponse.userjourneys)
            setLoading(false);
            setxArrowloading(true);
          }else if(decoded){
            const userJourneyResponse = await userJourneyService.getUserJourneysAuto(
              {user,accessToken}, website.websiteId,decoded.startDate?decoded.startDate:null,decoded.endDate?decoded.endDate:null
            );
            setUserJourneyArr(userJourneyResponse.userjourneys)
            setLoading(false);
            setxArrowloading(true);
          }else{
            setLoading(false);
            setxArrowloading(true);
          }
  
        }else{
          setLoading(false);
          setxArrowloading(true);
        }
      }

      testData()
      
    }}
    //setLoading(false);
  } else if(user && accessToken){
    if(id == null){
      router.push('/dashboard')
    }
    else if(id != null && isNotOwnId==true){
      router.push(`/userJourneys/automaticallyTrack/share?id=${id}&filterId=${filterIdGet}`)
    }
    else{setSession({user,accessToken})
    router.query.id = website.websiteId
    router.push(router)
    if (websiteStatus !== 200 || error) {
      setError(message?message:error?error:"error");
      console.log(error);
      router.push("/dashboard");
    } else {
      paymentService.isSubscribed(session).then(async (res) => {
        //console.log(res);
        if (res.status == 200 && res.isSubscribed == false) {
          router.push("/pricing");
        } else {
          if(filterIdGet != null){
            const decoded = jwt.verify(filterIdGetTest, process.env.SIMPLE_TOKEN_SECRET);
            if(decoded && decoded.filterUrls && decoded.filterUrls.length>0){
              const userJourneyResponse=await userJourneyService.getUserJourneysAutoFilter({user,accessToken}, website.websiteId,decoded.startDate?decoded.startDate:null,decoded.endDate?decoded.endDate:null,decoded.filterUrls)
              setUserJourneyArr(userJourneyResponse.userjourneys)
              setLoading(false);
            }else if(decoded){
              const userJourneyResponse = await userJourneyService.getUserJourneysAuto(
                {user,accessToken}, website.websiteId,decoded.startDate?decoded.startDate:null,decoded.endDate?decoded.endDate:null
              );
              setUserJourneyArr(userJourneyResponse.userjourneys)
              setLoading(false);
            }else{
              setLoading(false);
            }

          }else{setLoading(false);}
          
        }
      });
    }}
    
  }else{
    setLoading(true)
  }
}, [])

useEffect(()=>{
  setLoading(true)
  setxArrowloading(false)
  xArroeDisp();
},[query])

useEffect(() => {
 if(loading==false){
  xArroeDisp();
 }

 
}, [userJourneyArr]);

useEffect(() => {
  if(filterBody.length>0){
    const payload = { startDate:null,endDate:null,filterUrls:filterBody }
    const token = jwt.sign(payload, process.env.SIMPLE_TOKEN_SECRET);
    console.log("token :",token)
    setFilterToken(token)
    router.query.filterId = token
    router.query.id = website.websiteId
    router.push(router)
  }
}, [filterBody]);

const xArroeDisp=async ()=>{
  setxArrowloading(false);
  await setTimeout(() => {
    setLoading(false)
    setxArrowloading(true);
  }, 2000);
}

const formatDate=async (d,variable)=> {
      var month = '' + (d.getMonth() + 1);
      var day = '' + (d.getDate()+variable);
      var year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

      //console.log([year, month, day].join('-'))
  return [year, month, day].join('-');
}

const getDateRange= async (range)=>{
  setLoading(true)
    
  const monthArr = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const day1=new Date(range[0])
    const day2=new Date(range[1])
    const day1Final=day1.getFullYear()+"-"+(monthArr[day1.getMonth()])+"-"+day1.getDate()
    const day2Final=day2.getFullYear()+"-"+(monthArr[day2.getMonth()])+"-"+day2.getDate()
    setSelectedDate({start:day1Final,end:day2Final})
    const startDate=await formatDate(day1,-1)
    const endDate= await formatDate(day2,1)

    //console.log(startDate,endDate)
  if(isAddFilter){
    const userJourneyResponse=await userJourneyService.getUserJourneysAutoFilter(session, website.websiteId,startDate,endDate,filterUrls)
    setUserJourneyArr(userJourneyResponse.userjourneys)
    const payload = { startDate,endDate,filterBody }
    const token = jwt.sign(payload, process.env.SIMPLE_TOKEN_SECRET);
    console.log("token :",token)
    setFilterToken(token)
    setShowCalendar(false)
    setLoading(false)
  }else{
    const userJourneyResponse = await userJourneyService.getUserJourneysAuto(
      session,
      website.websiteId,
      startDate,
      endDate,

    );
    setUserJourneyArr(userJourneyResponse.userjourneys)
    const payload = { startDate:startDate,endDate:endDate,filterUrls:filterBody }
    const token = jwt.sign(payload, process.env.SIMPLE_TOKEN_SECRET);
    setFilterToken(token)
    setShowCalendar(false)
    setLoading(false)
  }
    
}

  return (
    <ScrollContainer className="scroll-container">
    <div className="" style={{width:'auto',height:"90vh"}}>
      
      <div>
      <Header backgroundCol="white" displayShare={true} filterToken={filterToken} websiteData={website} />
      </div>
      {loading?<></>
      :
      <div>
      <Modal
        closeButton
        width="80vw"
        blur
        aria-labelledby="modal-title"
        open={addFilter}
        onClose={()=>{setAddFilter(false)}}
      >
        <div style={{background:"white",padding:"0",width:"80vw",justifyContent:"center"}}>
      <JourneyAutoFilter setFilterbody={(val)=>{setFilterbody(val)}} website={website} setUserJourneyArr={(val)=>setUserJourneyArr(val)} addFilter={(val)=>setAddFilter(val)} setLoadingIndex={(val)=>setLoading(false)} setIsAddFilter={(val)=>setIsAddFilter(val)} setFilterUrls={(val)=>setFilterUrls(val)}/>
      </div>
      </Modal>
      <Container lg style={{ paddingTop: 100, padding: 100,width:"auto",}} >
        {/* <Grid css={{position:'absolute',}}>
          <Button className="hyper-btn" onPress={() => setAddFilter(true)} css={{ maxWidth: 400, }}>
                        ADD FILETR +
                    </Button>
          </Grid> */}
        <Grid
          css={{
            marginLeft: "auto",
            marginRight: 0,
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          
          <Grid css={{ position: "absolute", zIndex: 1000, }}>
            <Grid.Container  css={{position:"fixed",left:"50vw"}}>
            <Grid>
            {!showCalendar ? (
              <Input
                css={{ minWidth: "250px", width: "30vw" }}
                onClick={() => {
                  setShowCalendar(true);
                }}
                value=""
                placeholder={
                  selectedDate.start
                    ? `${selectedDate.start}  To  ${selectedDate.end}`
                    : "select date range"
                }
                labelRight={clanderIcon}
              />
            ) : (
              <Calendar
                className="hyper-calendar hyper-calendar-auto"
                maxDate={new Date()}
                calendarType="US"
                defaultView="month"
                returnValue="range"
                view="month"
                selectRange={true}
                goToRangeStartOnSelect={false}
                allowPartialRange={false}
                onChange={(value) => getDateRange(value)}
              />
            )}
            </Grid>
            <Grid>
            <Button size={"sm"} onPress={() => setAddFilter(true)} css={{ height:"40px",background:"#201E7B",marginLeft:"2px" }}>
                        
                        <img
                      src='/images/filter-symbol.png'
                    />
                         &nbsp;  <Text size="$xs" weight="bold" css={{color:"white",letterSpacing:"1px"}}>FILETR</Text>
                    </Button>
            </Grid>
            </Grid.Container>
          </Grid>
        </Grid>
        
       
        <TransformWrapper centerOnInit={false} centerZoomedOut={false} maxScale={1}  minScale={1} options={{ disabled: ["scale", "wheel"]}}>
            <TransformComponent >
            <MyPage showXarrow={xArrowloading}>
              <div>
        {userJourneyArr && userJourneyArr.length>0 && userJourneyArr.map((item,id)=>{
          return <>
          <SSListingAuto item={item} id={id} key={id} showXarrow={xArrowloading} />
          </>
        })}
        </div>
        </MyPage>
            </TransformComponent>
        </TransformWrapper>
        
        
      </Container>
      </div>
      
}

    </div>
    </ScrollContainer>
  );
};

export async function getServerSideProps(context) {
    const { req } = context;
    const { query } = context;
    const cookies=req.headers.cookie?context.req.headers.cookie:null;
    const userCookie = cookies ? cookies.split(';').find(c => c.trim().startsWith('user=')) : null;
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])) : null;
    const accessTokenCookie = cookies ? cookies.split(';').find(c => c.trim().startsWith('accessToken=')) : null;
    const accessToken = accessTokenCookie ? accessTokenCookie.split('=')[1] : null;

  try {
    if (user && accessToken) {
      const session={user,accessToken}
      const websiteResponse = await websiteService.getWebsiteByUser(session,query.id);
      const alredyVerified=await personalPixelService.verifyPixel(session, query.id)
      if (websiteResponse.status === 200 && websiteResponse?.website?.pages.length>0) {
        const userJourneyResponse = await userJourneyService.getUserJourneysAuto(
          session,
          websiteResponse.website.websiteId
        );
        //console.log("User Journeys x", userJourneyResponse);
        if (userJourneyResponse.status == 200) {
          const updatedWebsite = {
            ...websiteResponse.website,
            userJourney: userJourneyResponse.userjourneys,
          };
          return {
            props: {
              websiteStatus: websiteResponse.status,
              website: updatedWebsite,
              pixelVerified:alredyVerified?.verified
            },
          };
        } else {
          return {
            props: {
              websiteStatus: userJourneyResponse.status,
              error: userJourneyResponse.message,
              pixelVerified:alredyVerified?.verified
            },
          };
        }
      } else if(websiteResponse.status === 200){
        return {
          props: {
            websiteStatus: websiteResponse.status,
            website: "",
            pixelVerified:false
          },
        };
      }
      
      else {
        //console.log()
        return {
          props: {
            websiteStatus: websiteResponse.status,
            pixelVerified:alredyVerified?.verified,
            isNotOwnId:true,
            error: websiteResponse.error?websiteResponse.error:websiteResponse.message?websiteResponse.message:"error",
          },
        };
      }
    } else {
      return {
        props: {
          isNotOwnId:true,
        },
      };
    }
  } catch (error) {
    //console.log("Error ", error);
    return {
      props: {
        websiteStatus: 500,
      },
    };
  }
}

export default UserJourneyAuto;
