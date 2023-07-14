import React, { useState, useEffect } from 'react'
import { Container, Grid, Button, Card, Text } from '@nextui-org/react'
import Header from '../../components/Header'
import { useRouter } from 'next/router'
import { paymentService} from "../../services";
import Cookies from 'js-cookie';

const PricingPage = () => {
  //console.log('session ;', session)
  const router = useRouter()
  const [duration, setDuration] = useState('mo')
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState("");



  useEffect(() => {
    const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
    const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;;
    if (!user || !accessToken) {
      router.push('/auth/signIn')
    }
    else if ( user && accessToken && user.isSubscribed) {
      //console.log(session.user.isSubscribed)
      setSession(user,accessToken)
      router.push('/dashboard')
      //setLoading(false);
    } else if(user && accessToken){
      paymentService.isSubscribed({user,accessToken}).then((res)=>{
        //console.log(res)
        if(res.status==200 && res.isSubscribed==true){
          router.push('/dashboard')
        }else{
          setLoading(false)
        }
      })
      
    }else{
      setLoading(false)
    }
  }, [])

  return (
    <>
      {loading ? (
        <div></div>
      ) : (
        <div className='hyper-pricing-container'>
          <Header />
          <Container lg css={{ paddingTop: 100 }}>
            <Grid.Container gap={4} alignItems='center'>
              <Grid lg={12} md={12} sm={12} xs={12} justify='center'>
                <Button.Group
                  size='xl'
                  css={{ backgroundColor: '#ffffff', padding: 10 }}
                >
                  <Button
                    onClick={() => setDuration('mo')}
                    light={duration !== 'mo'}
                    css={{
                      backgroundColor:
                        duration === 'mo' && 'var(--button_blue)',
                      width: 150,
                      borderRadius: 100,
                    }}
                  >
                    Monthly
                  </Button>
                  <Button
                    onClick={() => setDuration('yr')}
                    light={duration !== 'yr'}
                    css={{
                      backgroundColor:
                        duration === 'yr' && 'var(--button_blue)',
                      width: 150,
                      borderRadius: 100,
                    }}
                  >
                    Yearly
                  </Button>
                </Button.Group>
              </Grid>
              <Grid lg={4} md={4} sm={4} xs={12}>
                <Card className='hyper-pricing-card' css={{ height: 550 }}>
                  <Card.Body>
                    <Text
                      size={24}
                      css={{ margin: 0, color: 'var(--light_blue)' }}
                    >
                      Basic
                    </Text>
                    <Text h3 css={{ margin: 0 }}>
                      {duration === 'mo' ? '$99' : '$79'}/{duration}
                    </Text>
                    <Text css={{ margin: 0 }}>
                      Marketing analytics and website flow optimization.
                    </Text>
                    <hr />
                    <Text css={{ margin: 0 }} size={20}>
                      What’s included
                    </Text>
                    <ul style={{ lineHeight: 2 }}>
                      <li>6-Month Data History</li>
                      <li>100% support</li>
                      <li>Custom Reports</li>
                      <li>Funnel Optimization</li>
                    </ul>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      onClick={() =>
                        router.push(
                          '/pricing/checkout/' + duration + '/' + 'basic'
                        )
                      }
                      size='lg'
                      css={{
                        width: '100%',
                        backgroundColor: 'var(--button_blue)',
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Card.Footer>
                </Card>
              </Grid>
              <Grid lg={4} md={4} sm={4} xs={12}>
                <Card className='hyper-pricing-card' css={{ height: 600 }}>
                  <Card.Body>
                    <Text
                      size={24}
                      css={{ margin: 0, color: 'var(--light_blue)' }}
                    >
                      Pro
                    </Text>
                    <Text h3 css={{ margin: 0 }}>
                      {duration === 'mo' ? '$150' : '$120'}/{duration}
                    </Text>
                    <Text css={{ margin: 0 }}>
                      Deep marketing channel analysis, website optimization, and
                      smart audiences for growing websites.
                    </Text>
                    <hr />
                    <Text css={{ margin: 0 }} size={20}>
                      Everything in basic +
                    </Text>
                    <ul style={{ lineHeight: 2 }}>
                      <li>1 Year Data History</li>
                      <li>Journey Analysis</li>
                      <li>1:1 Onboarding</li>
                      <li>Export Unlimited Smart Audiences</li>
                    </ul>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      onClick={() =>
                        router.push(
                          '/pricing/checkout/' + duration + '/' + 'pro'
                        )
                      }
                      size='lg'
                      css={{
                        width: '100%',
                        backgroundColor: 'var(--button_blue)',
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Card.Footer>
                </Card>
              </Grid>
              <Grid lg={4} md={4} sm={4} xs={12}>
                <Card className='hyper-pricing-card' css={{ height: 550 }}>
                  <Card.Body>
                    <Text
                      size={24}
                      css={{ margin: 0, color: 'var(--light_blue)' }}
                    >
                      Custom
                    </Text>
                    <Button
                      light
                      bordered
                      css={{
                        maxWidth: 150,
                        borderRadius: 100,
                        height: 50,
                        border: '1px solid var(--text-grey)',
                        color: 'var(--text-grey)',
                        margin: '16px 0px',
                      }}
                    >
                      GET IN TOUCH
                    </Button>
                    <Text css={{ margin: 0 }}>
                      Higher plans are better served by contacting Hypertarget.
                    </Text>
                    <hr />
                    <Text css={{ margin: 0 }} size={20}>
                      Everything in Pro +
                    </Text>
                    <ul style={{ lineHeight: 2 }}>
                      <li>2 Years Data History</li>
                      <li>Budget Planning</li>
                      <li>Advanced User Management</li>
                      <li>Analytics Bootcamp</li>
                      <li>
                        Export Unlimited Events to Facebook, Google Ads & More
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Grid>
            </Grid.Container>
          </Container>
        </div>
      )}
    </>
  )
}

export default PricingPage
