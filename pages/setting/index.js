/* eslint-disable react-hooks/rules-of-hooks */
import {
    Button,
    Card,
    Container,
    Grid,
    Loading,
    Navbar,
    Text,
  } from '@nextui-org/react'
  import { useRouter } from 'next/router'
  import React, { useState, useEffect } from 'react'
  import Header from '../../components/Header'
  import { paymentService, personalPixelService } from '../../services'
  import Cookies from 'js-cookie';
  import GeneralSetting from '../../components/generalSetting'
  import NotificationSetting from '../../components/notificationSetting'
  import BillingSetting from '../../components/billingSetting'
  
  
  const Settings = ({ website, error,isVerified,isRedirectDashboard }) => {
    const [model, setModel] = useState({ isOpen: false, success: true })
    const [loading, setLoading] = useState(false)
    const [isActive, setIsActive] = useState("setting")
    const [pageLoading, setPageLoading] = useState(true)
    const router = useRouter()
    const [session, setSession] = useState("");
  
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
        setLoading(true)
      }
    }, [])
  
    //console.log('Website', website)
    return (
     <>
             {/* <Header /> */}
     {pageLoading?<></>:
      <div className='hyper-pixel'>
        <Container lg css={{ paddingTop: 100, margin: 'auto', width: '90vw',background:"white" }}>
          <Grid.Container>
            <Grid lg={12} md={12} sm={12} xs={12} justify='center'>
              <Card>
                <Card.Body css={{ padding: '10px 10px', height: 'auto',background:"white" }}>
                  <Text
                    h3
                    css={{ textAlign: 'left',padding:"20px",color: 'var(--button_blue)' }}
                  >
                    Settings
                  </Text>
                  <Navbar isCompact={true} disableShadow variant="floating" css={{background:"white !important",borderBottom:"1px solid #EAEAEA !important"}}>
                  <Navbar.Content  variant="underline" css={{margin:"0px",padding:"0px"}}>
                      <Navbar.Link isActive={isActive=="setting"?true:false} onClick={()=>{setIsActive("setting")}}>
                        Setting
                      </Navbar.Link>

                      {/* <Navbar.Link isActive={isActive=="notification"?true:false} onClick={()=>{setIsActive("notification")}}>
                        Notification
                      </Navbar.Link> */}

                      <Navbar.Link isActive={isActive=="billing"?true:false} onClick={()=>{setIsActive("billing")}}>
                        Billing
                      </Navbar.Link>
                  </Navbar.Content>
                </Navbar>

                <Grid.Container css={{paddingTop:"30px"}}>

                  {isActive=="setting" && <GeneralSetting />}
                  {isActive=="notification" && <div><NotificationSetting /></div>}
                  {isActive=="billing" && <BillingSetting />}
                </Grid.Container>
                </Card.Body>
                
              </Card>
            </Grid>
          </Grid.Container>
        </Container>
      </div>}
      </>
    )
  }
  
 /*  export async function getServerSideProps(context) {
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
  
        const websiteData = await personalPixelService.getPixel(session,query.webiteId)
        console.log('Website Data ', websiteData)
        if (!websiteData.error) {
          const alredyVerified=await personalPixelService.verifyPixel(session, websiteData.website.websiteId)
          console.log(alredyVerified)
          if(alredyVerified?.verified){
            return {
              props: {
                isVerified: alredyVerified?.verified,
                session: session,
              },
            }
          }
          if(alredyVerified.status && alredyVerified.status!=200){
            return {
              props: {
                error: JSON.stringify({ message: 'something went wrong!' }),
                isRedirectDashboard:true,
              },
            }
          }
          return {
            props: {
              website: websiteData.website,
              session: session,
            },
          }
        } else {
          console.log('Running error')
          //router.push('/auth/signIn')
          return {
            props: {
              error: JSON.stringify({ message: 'something went wrong!!' }),
              isRedirectDashboard:true,
            },
          }
        }
      } else {
        return {
          props: {
            error: JSON.stringify({ message: 'User must be logged in' }),
          },
        }
      }
    } catch (error) {
      return {
        props: {
          error: { error: JSON.stringify(error) },
        },
      }
    }
  } */
  
  export default Settings
  