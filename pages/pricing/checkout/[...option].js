import {
  Button,
  Card,
  Container,
  Grid,
  Input,
  Spacer,
  Text,
} from '@nextui-org/react'
import axios from 'axios'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { paymentService} from "../../../services";
import Cookies from 'js-cookie';

const stripePromise = loadStripe(
  process.env.STRIPE_PK
)

const MyComponent = ({session}) => {

  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setProcessingTo] = useState(false)
  const [checkoutError, setCheckoutError] = useState()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()
  const { option } = router.query
  const duration = option && option[0]
  const plan = option && option[1]

  var packageName = ''
  const price =
    duration === 'mo' && plan === 'basic'
      ? 99
      : duration === 'mo' && plan === 'pro'
      ? 150
      : duration === 'yr' && plan === 'basic'
      ? 79
      : duration === 'yr' && plan === 'pro'
      ? 120
      : null
 
  const handleCardDetailsChange = (ev) => {
    ev.error ? setCheckoutError(ev.error.message) : setCheckoutError()
  }
  const handleFormSubmit = async (ev) => {
    
    //console.log(session.user.accessToken)
    ev.preventDefault()

    const billingDetails = {
      name: name,
      email: email,
    }

    setProcessingTo(true)

    const cardElement = elements.getElement('card')
    //console.log(cardElement)

    try {
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      })


      ////console.log(res);
      if (paymentMethodReq.error) {
        setCheckoutError(paymentMethodReq.error.message)
        setProcessingTo(false)
        return
      }
      
   
        const body={
          packageName: plan,
          packageType: duration=='mo'?'monthly':'yearly',
          billingDetails:{  name: name,
            email: email,
            },  
            paymentMethodReq: paymentMethodReq,
          
        }
        paymentService.createPayment(session, body).then((res) => { 
          if (res.message=='success!') {
            router.push('/personalPixel/getDomain')
          }else{
            setProcessingTo(false)
          }
        }).catch((err)=>{
          setProcessingTo(false)
          setCheckoutError(err.message)
        })
    
    } catch (err) {
      setCheckoutError(err.message)
      setProcessingTo(false)
    }
  }

  return (
    <div className='hyper-checkout-container'>
      <Header />
      <Container md css={{ paddingTop: 100 }}>
        <Grid.Container gap={2}>
          <Grid lg={12} md={12} sm={12} xs={12} justify='center'>
            <Text h2>Enter Your Payment Details Below</Text>
          </Grid>
          <Grid lg={7} md={7} sm={7} xs={12}>
            <form style={{ width: '100%' }} onSubmit={handleFormSubmit}>
              <Card css={{ padding: '0px 20px 20px 20px' }}>
                <Card.Body>
                  <Grid.Container direction='row'>
                    <Grid lg={12} md={12} direction='column'>
                      <Text h3>Payment Information</Text>
                      <Input
                        fullWidth
                        label='Name'
                        required
                        placeholder='Enter your full name'
                        size='lg'
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Spacer y={1} />
                      <Input
                        label='Email'
                        type='email'
                        required
                        placeholder='Enter your email address'
                        size='lg'
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Spacer y={1} />
                    </Grid>
                    <Grid lg={12} md={12} direction='column'>
                      <div className='form-group-payment'>
                        <label>Card Details *</label>
                        <div style={{ width: '100%', paddingTop: '10px',marginBottom:'10px' }}>
                          <CardElement
                            style={{ width: '100%', paddingTop: '10px' }}
                            onChange={handleCardDetailsChange}
                            className=''
                          />
                        </div>
                      </div>
                    </Grid>
                    {checkoutError && (
                      <p>{checkoutError}</p>
                    )}
                  </Grid.Container>
                  <Button
                    disabled={isProcessing || !stripe}
                    /* onClick={() => router.push('/personalPixel/getDomain')} */
                    size='lg'
                    type='submit'
                    css={{
                      marginTop: 20,
                      backgroundColor: 'var(--button_blue)',
                    }}
                  >
                    {isProcessing ? (
                      <div className=' d-flex justify-content-center'>
                        <div className='spinner-border' role='status'>
                          <span className='sr-only'>Loading...</span>
                        </div>
                      </div>
                    ) : (
                      `SUBMIT`
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </form>
          </Grid>
          <Grid lg={5} md={5} sm={5} xs={12}>
            <Card css={{ padding: '0px 20px 20px 20px' }}>
              <Card.Body>
                <Text
                  h3
                  css={{
                    fontSize: 20,
                    color: 'var(--button_blue)',
                    marginBottom: 0,
                  }}
                >
                  You have to pay
                </Text>
                <Text h1 css={{ marginTop: 10 }}>
                  ${price}/{duration}
                </Text>
                <hr />
                <Text css={{ margin: 0 }} size={20}>
                  What’s included
                </Text>
                {plan === 'basic' ? (
                  <ul style={{ lineHeight: 2, paddingInlineStart: 20 }}>
                    <li>6-Month Data History</li>
                    <li>100% support</li>
                    <li>Custom Reports</li>
                    <li>Funnel Optimization</li>
                  </ul>
                ) : (
                  <ul style={{ lineHeight: 2 }}>
                    <li>2 Years Data History</li>
                    <li>Budget Planning</li>
                    <li>Advanced User Management</li>
                    <li>Analytics Bootcamp</li>
                    <li>
                      Export Unlimited Events to Facebook, Google Ads & More
                    </li>
                  </ul>
                )}
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
      </Container>
    </div>
  )
}

export default function CheckoutPage(props) {
  const [session, setSession] = useState("");
  useEffect(() => {
    const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
    const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;;
    if (!user || !accessToken) {
      router.push('/auth/signIn')
    }else{
      setSession({user,accessToken})
    }
  }, [])

  return (
    <>
      <Elements stripe={stripePromise}>
        <MyComponent {...props} session={session}/>
      </Elements>
    </>
  )
}
