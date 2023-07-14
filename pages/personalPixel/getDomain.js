import {
  Button,
  Card,
  Container,
  Grid,
  Input,
  Loading,
  Spacer,
  Text,
  Textarea,
} from '@nextui-org/react'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { paymentService, personalPixelService } from '../../services'
import Cookies from 'js-cookie';


const PersonalPixel = ({error,sessiondata }) => {
  const [domain, setDomain] = useState("")
  const [formError, setFormError] = useState({ status: 'default', message: '' });
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const router = useRouter()
  const [session, setSession] = useState(sessiondata);
  


  useEffect(() => {
    const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
    const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;
    if (!user || !accessToken) {
      router.push('/auth/signIn')
    }
    else if ( user && accessToken && user.isSubscribed) {
      //console.log(session.user.isSubscribed)
      setSession({user,accessToken})
      setPageLoading(false)
      //setLoading(false);
    } else if(user && accessToken){
      paymentService.isSubscribed({user,accessToken}).then((res)=>{
        //console.log(res)
        if(res.status==200 && res.isSubscribed==false){
          router.push('/pricing')
        }else{
          setSession({user,accessToken})
          setPageLoading(false)
          
        }
      })
      
    }else{
      setLoading(false)
    }
  }, [])

  const getHost = urlString=> {
    try { 
      return new URL(urlString).host; 
    }
    catch(e){ 
      return new URL("https://"+urlString).host; 
    }
}

  const submitDomain=async ()=>{
    setFormError({ status: 'default', message: '' });
    
      if(!domain || domain==""){
          setFormError({
              status: 'error',
              message: "Domain is required!"
          });
      }else{
       
      
      const host=getHost(domain)
      //console.log(host)
          setLoading(true)
          const addDomainRes=await personalPixelService.addDomain(session, host)
          if(addDomainRes.error){
              setFormError({
                  status: 'error',
                  message: addDomainRes.message
              });
              setLoading(false)
          }else{
              router.push(`/personalPixel?webiteId=${addDomainRes.websiteId}`)
          }
      
    }
      
  }

  return (
   <>{pageLoading?<></>:
    <div className='hyper-pixel'>
      <Header />
      <Container lg css={{ paddingTop: 100, margin: 'auto', width: '60%' }}>
        <Grid.Container>
          <Grid lg={12} md={12} sm={12} xs={12} justify='center'>
            <Card css={{paddingBottom:30,}}>
              <Card.Body css={{ padding: '10px 40px', paddingTop: 80,height: 'auto', }}>
                <Text
                  h3
                  css={{ textAlign: 'center', color: 'var(--light_blue)' }}
                >
                  What is Your Website URL?
                </Text>
                <Card.Body css={{paddingTop: 'auto'}}>
                <Input type="email" placeholder="www.companyabc.com"
                              value={domain}
                              onChange={(e) => setDomain(e.target.value)}
                              status={formError.status}
                          />
              {formError.message.length > 0 && <><Spacer y={1} />
                              <Text css={{ margin: 0 }} color="error">{formError.message}</Text>
                          </>}
                          </Card.Body>
              </Card.Body>
              <Card.Footer>
                <Grid.Container gap={4}>
                  <Grid lg={12} md={12} sm={12} xs={12} justify='center'>
                    <Button
                      disabled={loading}
                      className='hyper-btn btn-getDmain'
                      size='lg'
                      onClick={() => submitDomain()}
                    >
                      {loading ? (
                        <Loading color='success' />
                      ) : (
                        'Next'
                      )}
                    </Button>
                  </Grid>
                  <Grid lg={3} md={3} sm={3} xs={0} />
                  {error && error.length > 0 && (
                    <Grid lg={12} md={12} sm={12} xs={12} justify='center' css={{ textAlign: 'center', color: 'red' }}>
                      {error}
                    </Grid>
                  )}
                </Grid.Container>
              </Card.Footer>
            </Card>
          </Grid>
        </Grid.Container>
      </Container>
    </div>}
    </>
  )
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
      return {
        props: {
          sessiondata: session,
        },
      }
    } else {
      return {
        props: {
          sessiondata: "",
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
}

export default PersonalPixel
