/* eslint-disable react/jsx-key */
import { Button, Container, Grid, Text } from "@nextui-org/react";
import Header from "../components/Header"
import { useEffect, useState } from "react";
import DashBoardSingleItem from "../components/dashBoardSingleItem";
import { useRouter } from "next/router";
import { paymentService, websiteService } from "../services";
import Cookies from "js-cookie";

function Dashboard({websites}) {
  const [websiteList,setWebsiteList]=useState(websites)
    const [pageLoading, setPageLoading] = useState(true)

  const router=useRouter()

  useEffect(() => {
      
    const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
    const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;
      if (!user || !accessToken) {
      router.push('/auth/signIn')
    }
    else if ( user && accessToken && user.isSubscribed) {
      setPageLoading(false)
    } else if(user && accessToken){
      paymentService.isSubscribed({user,accessToken}).then((res)=>{
        if(res.status==200 && res.isSubscribed==false){
          router.push('/pricing')
        }else{
             setPageLoading(false)
        }
      })
      
    }else{
      setPageLoading(false)
    }
  }, [])


  return (
    <div>
      {/* <Header /> */}
      {!pageLoading && <Container lg css={{ paddingTop: 100 }}>
      <Grid css={{paddingLeft:"20px",marginBottom:"20px"}}>
      <Button size="sm" onPress={() =>{router.push('/personalPixel/getDomain')}} css={{ background:"#201E7B",borderRadius:"0px" }}>
                        <p weight="bold" style={{color:"white",letterSpacing:"1px",fontSize:"12px"}}>ADD NEW +</p> 
              </Button>
      </Grid>

      <Grid.Container>
        {
          websiteList && websiteList.map((item,key)=>{
            return <Grid lg={3} md={3} sm={6} xs={12}>
              <DashBoardSingleItem website_Id={item.websiteId} name={item.domain} date={item.createdAt}/>
              </Grid>
          })
        }
      </Grid.Container>
      </Container>}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cookies=req.headers.cookie?context.req.headers.cookie:null;
  const userCookie = cookies ? cookies.split(';').find(c => c.trim().startsWith('user=')) : null;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])) : null;
  const accessTokenCookie = cookies ? cookies.split(';').find(c => c.trim().startsWith('accessToken=')) : null;
  const accessToken = accessTokenCookie ? accessTokenCookie.split('=')[1] : null;

try {
  if (user && accessToken) {
    const session={user,accessToken}
    const websiteResponse = await websiteService.getAllWebsiteByUser(session);
    console.log("websiteResponse :" ,websiteResponse)
    if (websiteResponse.status === 200) {
      return {
        props: {
          websiteStatus: websiteResponse.status,
          websites: websiteResponse.websites,
        },
      };
    } else {
      //console.log()
      return {
        props: {
          websiteStatus: websiteResponse.status,
          error: websiteResponse.error?websiteResponse.error:websiteResponse.message?websiteResponse.message:"error",
        },
      };
    }
  } else {
    return {
      props: {},
    };
  }
} catch (error) {
  console.log("Error ", error);
  return {
    props: {
      websiteStatus: 500,
    },
  };
}
}

export default Dashboard;
