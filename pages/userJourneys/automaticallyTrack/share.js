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
    userJourneyService,
    websiteService,
  } from "../../../services";
  import { Calendar } from "react-calendar"
  import 'react-calendar/dist/Calendar.css';
  import { TransformWrapper, TransformComponent , } from "react-zoom-pan-pinch";
  import  SSListingAuto from "../../../components/userJourneyAutoSSlisting"
  import JourneyAutoFilter from "../../../components/autoUserJournyFilter";
  import ScrollContainer from 'react-indiana-drag-scroll'
  import MyPage from "../../../components/zoomin-zoom-out";
  import jwt from 'jsonwebtoken';
  import Cookies from 'js-cookie';
  
  const UserJourneyAuto = () => {
    const { query } = useRouter();
    const [userJourneyArr, setUserJourneyArr] = useState([]);
    const [errorMsg, setError] = useState();
    const [model, setModel] = useState({ isOpen: false, success: true });
    const [loading, setLoading] = useState(true);
    const [isAddFilter, setIsAddFilter] = useState(false);
    const [websiteId, setWebsiteId]=useState("")
    const [invitationId, setInvitationId]=useState("")
    const [ website,setWebsite]=useState({})
    const [xArrowloading, setxArrowloading] = useState(false);
    const [addFilter, setAddFilter] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState({});
    const[filterId,setFilterId]=useState(null)
    const [filterUrls,setFilterUrls]=useState([])
    const clanderIcon=<svg xmlns="http://www.w3.org/2000/svg"  style={{paddingLeft:'auto'}} width="16" height="16" fill="blue" className="bi bi-calendar" viewBox="0 0 16 16">
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
  </svg>
  
  
  useEffect(() => {
    //console.log(query)
    const id=query.id
    const invitationId2=query.invitationId
    const filterIdGet=query.filterId?query.filterId:null
    setFilterId(filterIdGet)
    setWebsiteId(id)
    setInvitationId(invitationId2)
    const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
    //console.log("id :",id)
    const fetch=async()=>{
      const filterIdGetTest=query.filterId?query.filterId:null
        if(filterIdGetTest==null || filterIdGetTest=="null"){
          const userJourneyResponse = await userJourneyService.getUserJourneysAutoShare(id,null,null,user?user.email:null);
          if(userJourneyResponse.status==200){
          setUserJourneyArr(userJourneyResponse.userjourneys)
          setWebsite(userJourneyResponse.website)
          }
          else{
            setError(userJourneyResponse.message)
          }
        }
        else{

          const decoded = jwt.verify(filterIdGetTest, process.env.SIMPLE_TOKEN_SECRET);
          console.log(decoded.filterUrls.length)

          if(decoded.filterUrls.length==0){
            const userJourneyResponse = await userJourneyService.getUserJourneysAutoShare(id,decoded.startDate?decoded.startDate:null,decoded.endDate?decoded.endDate:null,user?user.email:null);
          if(userJourneyResponse.status==200){
          setUserJourneyArr(userJourneyResponse.userjourneys)
          setWebsite(userJourneyResponse.website)
          }
          else{
            setError(userJourneyResponse.message)
          }
          }
          else{
            const userJourneyResponse = await userJourneyService.getUserJourneysAutoFilterShare(id,decoded.startDate,decoded.endDate,decoded.filterUrls,user?user.email:null);
          if(userJourneyResponse.status==200){
          setUserJourneyArr(userJourneyResponse.userjourneys)
          setWebsite(userJourneyResponse.website)
          }
          else{
            setError(userJourneyResponse.message)
          }}
        }
          xArroeDisp()
          setLoading(false)

    }
    if(id){
        fetch()
    }
  }, [query])
  
  useEffect(() => {
    if(!loading){
    xArroeDisp();
}
   
  }, [userJourneyArr,loading]);
  
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
  
      console.log(startDate,endDate)
    if(isAddFilter){
      const userJourneyResponse=await userJourneyService.getUserJourneysAutoFilterShare( websiteId,startDate,endDate,filterUrls,user?user.email:null)
      setUserJourneyArr(userJourneyResponse.userjourneys)
      setShowCalendar(false)
      setLoading(false)
    }else{
      const userJourneyResponse = await userJourneyService.getUserJourneysAuto(
        websiteId,
        startDate,
        endDate,
  
      );
      setUserJourneyArr(userJourneyResponse.userjourneys)
      setShowCalendar(false)
      setLoading(false)
    }
      
      //console.log("userJourneyResponse : ",userJourneyResponse)
      
  }
  
    return (
        <>
      {errorMsg?<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  {errorMsg=="this is not public!"? "Sorry, You Are Not Allowed to Access This Page": (errorMsg=="website not found!"?"invalid url" :(errorMsg=="website not found!"?"invalid url":errorMsg === 'Request failed with status code 400' ? 'Something went wrong!':errorMsg))}
</div>
:
      <ScrollContainer className="scroll-container">
      <div className="" style={{width:'auto',height:"90vh"}}>        
        <div>
        <Header backgroundCol="white"  />
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
        <JourneyAutoFilter website={website} setUserJourneyArr={(val)=>setUserJourneyArr(val)} addFilter={(val)=>setAddFilter(val)} setLoadingIndex={(val)=>setLoading(false)} setIsAddFilter={(val)=>setIsAddFilter(val)} setFilterUrls={(val)=>setFilterUrls(val)}/>
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
      </ScrollContainer>}
      </>
    );
  };
  
  export default UserJourneyAuto;
  