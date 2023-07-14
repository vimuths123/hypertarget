import { Button, Container, Grid, Image, Loading, Text,Card } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import JourneyStepAuto from "./journeyStepAuto";
import { websiteService, userJourneyService, paymentService } from "../services";
import { liveMetricsService } from "../services/liveMetrics.service";
import Cookies from 'js-cookie';

const styles = {
    stepStyles: {
        backgroundImage: 'url(/images/step-bg.svg)',
        backgroundRepeat: "no-repeat",
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: 20
    }
}

const JourneyAutoFilter = ({ website, websiteId, websiteStatus, message,startDate,endDate,setUserJourneyArr,addFilter,setLoadingIndex,setIsAddFilter,setFilterUrls,setFilterbody}) => {
  const router = useRouter()
  const [session, setSession] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const  [countData,setCountData]=useState([])
  const [steps, setSteps] = useState([
    { id: '', url: '', metric: '', clickEvent: '', stepName: '' },
  ])
  const [renderStepsArr,setRenderStepsArr]=useState([])

  useEffect(() => {
    const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
    const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;;
    
    if (user && accessToken) {
      setSession({user,accessToken})
    }else{
        router.push("/auth/signIn")
    }
  
  }, [])

useEffect(() => {
    //console.log("runing")
        getCount()
    
  
}, [steps])

const getCount=async ()=>{
    var body=[]
    for(let i=0;i<steps.length;i++){
        if(steps[i].url != ""){
            body.push(steps[i].url)
        }else{
            body.push(steps[i].url)
        }
    }
    console.log(body)
    //const resultData=await liveMetricsService.getLiveMetricsAuto(session,{journey:body},website.websiteId)
    //console.log("resultData",resultData)
    await liveMetricsService.getLiveMetrics(session, {
        steps: steps,
    },website.websiteId).then(res => {
        //console.log("res.data.userJourney",res)
        if(res.status==200){
            //console.log("res.data.userJourney",res.result)
            setCountData(res.result)
            //setRenderStepsArr(res.result)
        }
        
    })
    //setCountData(resultData.result)
}


const renderSteps = () => {
    const stepCollection = [];

    steps.forEach((step, index) => {
        stepCollection.push(<JourneyStepAuto step={step} key={index} index={index} website={website} onUpdate={onStepUpdate} />)
    })

    return stepCollection;
}


const onStepUpdate = (index, label, value) => {
    const updatedSteps = steps.map((s, i) => {
        if (i === index) {
            //console.log("*********",s)
            switch (label) {
                case 'url':
                    //console.log("XXX ", s)
                    s['url'] = value;
                    break;
                case 'metric':
                    s['metric'] = value
                    break;
                case 'clickEvent':
                    s['clickEvent'] = value
                    break;
                case 'stepName':
                    s['stepName'] = value
                    break;
                default:
                    //console.log("Invalid Label")
            }
               
            return s;
        } else {
            return s;
        }
    });
    setSteps(updatedSteps);
    //console.log("updatedSteps :",updatedSteps)
}

const handleAddStep = () => {
    const stepList = [...steps];
    stepList.push({ id: "", url: "", metric: "", clickEvent: "", stepName: "",count:0 });
    setSteps(stepList);
}

const handleClickSave = () => {
    //console.log("userJourney")
    setLoadingIndex(true)
    var body=[]
    for(let i=0;i<steps.length;i++){
        if(steps[i].url != ""){
            body.push(steps[i])
        }
        
    }

    //console.log("body :",JSON.stringify(body))
    setLoading(true);
    userJourneyService.getUserJourneysAutoFilter(session, website.websiteId,startDate,endDate,body).then(res => {
        if (res.status === 200 && res.userjourneys?.length>0) {
            //console.log("res :",res)
            setFilterbody(body)
            setUserJourneyArr(res.userjourneys)
            addFilter(false)
            setLoading(false);
            setIsAddFilter(true)
            addFilter(false)
            setFilterUrls(body)
        } else {
            setError("something wrong!");
            setLoading(false);
            setUserJourneyArr([])
        }
        
    });
}

const renderStepDiagram = () => {
    const stepList = [];
    if (typeof window === "undefined"){
        var windowWidth=1366
        //console.log("unde")
      }else{
        var windowWidth=window.innerWidth
        //console.log(window.innerWidth)
      }
    steps && steps.map((step, index) => {
        const widthX =  (windowWidth/5/Math.pow(1.1017, index)) + 'px';
        stepList.push(
            <Grid.Container className="STEPdIAGRAM_LIVE" justify="center" >
                <Grid item lg={2} md={2} justify="flex-end"><Text>{countData[index]?.count?countData[index].count:0}</Text></Grid>
                <Grid item lg={10} md={10} justify="center"><div style={{ ...styles.stepStyles, width: widthX }}></div></Grid>
                {/* <Grid item lg={3} justify="flex-start"><Text p>{step.stepName}</Text></Grid> */}
            </Grid.Container>
        )
    })

    return stepList;
}

const renderBothStepAndDiagram=()=>{
    const stepsArr=renderSteps()
    const stepDiagramArr=renderStepDiagram()
    const stepCollectionFinal = [];

    stepsArr.forEach((step, index) => {
        stepCollectionFinal.push(<>
        <Grid.Container css={{marginTop:10}}>
        <Grid lg={4} md={4} sm={4} xs={12} className="grid-for-display-live-diagram" direction="column" >
                {steps.length>1?<Card.Body>
                {stepDiagramArr[index]}
                </Card.Body>:
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image src="/images/juorneyCount.png" css={{ minHeight: 250 }} autoResize objectFit="contain" />
                    }
        </Grid>
        <Grid lg={8} md={8} sm={8} xs={12} direction='column'>
                    {stepsArr[index]}
                    
                </Grid>
                </Grid.Container>
        </>)
    })
    return stepCollectionFinal
}



return (
    <Container lg style={{ paddingTop: 10, padding: 10,minHeight:"80vh" }}>
    <Grid.Container> 
    <Grid.Container css={{margin:20}}>
                <Grid lg={4} md={4} sm={4} xs={4} direction='column' justify="center" alignItems="center">
                    <h3>User Journey Dashboard</h3>
                    </Grid>
                <Grid lg={8} md={8} sm={8} xs={8} direction='column' justify="center" alignItems="center">
                <Text h2 css={{  color: 'var(--button_blue)' }}>Enter The Step You Want To Track</Text>
                     </Grid>
            </Grid.Container>
    <>
                {steps.length>0 && <>
                    {renderBothStepAndDiagram()}
                <Grid lg={4} md={4} sm={4} xs={12} >
                {}
                </Grid>
                <Grid lg={8} md={8} sm={8} xs={12} direction='grid' justify="center" style={{marginTop:8}}>
                    {/* {renderSteps()} */}
                    <Button bordered onPress={() => handleAddStep()} css={{ maxWidth: 300, marginRight: '20px', marginBottom: 20, borderColor: '#201E7B', color: '#201E7B',borderRadius:"0px !important" }}>
                        {loading ? <Loading color="success" /> : "+ ADD"}
                    </Button>
                    <Button className="hyper-btn" onPress={() => handleClickSave()} css={{ maxWidth: 400, marginRight: '40px', marginBottom: 20 ,background:"#201E7B",borderRadius:"0px !important"}}>
                        {loading ? <Loading color="success" /> : "Save"}
                    </Button>
                </Grid>
                {error && <Text h4 css={{margin:"auto",marginTop:"10px",marginBottom:"10px",color:"red"}}>{error}</Text>}
                </>
                }</>
    </Grid.Container>
</Container>
)
}
export async function getServerSideProps(context) {
try {
    const { req } = context;
    const { query } = context;
    const cookies=req.headers.cookie?context.req.headers.cookie:null;
    const userCookie = cookies ? cookies.split(';').find(c => c.trim().startsWith('user=')) : null;
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])) : null;
    const accessTokenCookie = cookies ? cookies.split(';').find(c => c.trim().startsWith('accessToken=')) : null;
    const accessToken = accessTokenCookie ? accessTokenCookie.split('=')[1] : null;

    if (user && accessToken) {
        const websiteResponse = await websiteService.getWebsiteByUser({user,accessToken},query.id);
        if (websiteResponse.status === 200) {
            return {
                props: {
                    websiteStatus: websiteResponse.status,
                    website: websiteResponse.website
                }
            }
        } else {
            return {
                props: {
                    websiteStatus: websiteResponse.status,
                    error: websiteResponse.error
                }
            }
        }
    } else {
        return {
            props: {}
        }
    }
    

} catch (error) {
    console.log("Error ", error)
    return {
        props: {
            websiteStatus: 500
        }
    }
}
}
export default JourneyAutoFilter;