import {
    Button,
    Card,
    Container,
    Grid,
    Input,
    Spacer,
    Text,
  } from '@nextui-org/react'
  import {
    Elements,
    CardElement,
    useStripe,
    useElements,
  } from '@stripe/react-stripe-js'
  import { useRouter } from 'next/router'
  import { useEffect, useState } from 'react'
  import { loadStripe } from '@stripe/stripe-js'
  import { paymentService } from '../services'
  import Cards from 'react-credit-cards-2';
  import 'react-credit-cards-2/dist/es/styles-compiled.css';
  
  const stripePromise = loadStripe(
    process.env.STRIPE_PK
  )
  
  const MyComponent = ({session,cardData,getCardInfo,customerData}) => {
  
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setProcessingTo] = useState(false)
    const [checkoutError, setCheckoutError] = useState()
  
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const router = useRouter()
   
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
            name: name,
            email: email,  
            payment_method: paymentMethodReq.paymentMethod.id,
            
          }
          paymentService.updateCard(session, body).then((res) => { 
            if (res.status==200) {
                setCheckoutError("success!")
                setProcessingTo(false)
                getCardInfo()
            }else{
              setProcessingTo(false)
              setCheckoutError("something went wrong!")
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
        <Container md css={{ paddingTop: 100 }}>
          <Grid.Container gap={2}>
          <Grid lg={12} md={12} sm={12} xs={12} justify='flex-start'>
          <Text h3 style={{margin:"0px"}}>Edit Payment Information</Text>
            </Grid>
            <Grid lg={12} md={12} sm={12} xs={12} justify='flex-start' css={{paddingTop:"10px",paddingBottom:"20px"}}>
              
              <Cards
                      name={cardData?customerData.name:"Loading..."}
                      number={cardData?`**** **** **** ${cardData.card.last4}`:"**** **** **** 0000"}
                      expiry={cardData?`${cardData.card.exp_month}/${cardData.card.exp_year}`:"00/00"}
                      cvc='***'
                      preview={true}
                      issuer={cardData?cardData.card.brand:"visa"}
                      
                    />
                     
            </Grid>
              
            <Grid lg={12} md={12} sm={12} xs={12}>
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
                        <p style={{color:"red"}}>{checkoutError}</p>
                      )}
                    </Grid.Container>
                    <Button
                      disabled={isProcessing || !stripe}
                      /* onClick={() => router.push('/personalPixel/getDomain')} */
                      size='lg'
                      type='submit'
                      css={{
                        marginTop: 30,
                        backgroundColor: '#0F6A91',
                        width:"300px"
                      }}
                    >
                      {isProcessing ? (
                        <div className=' d-flex justify-content-center'>
                          <div className='spinner-border' role='status'>
                            <span className='sr-only'>Loading...</span>
                          </div>
                        </div>
                      ) : (
                        `SAVE `
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </form>
            </Grid>
          </Grid.Container>
        </Container>
      </div>
    )
  }
  
  export default function CardPopup({sessionData,cardData,getCardInfo,customerData}) {
  const getCartUpdate=()=>{
    getCardInfo()
  }
    return (
      <>
        <Elements stripe={stripePromise}>
          <MyComponent session={sessionData} cardData={cardData} customerData={customerData} getCardInfo={()=>{getCartUpdate()}}/>
        </Elements>
      </>
    )
  }
  