import Link from 'next/link'
import { Avatar, Button, Card, Container, Dropdown, Grid, Image, Input, Loading, Modal, Navbar, styled, Text, User } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { authService, personalPixelService, websiteService } from '../services'
import { useState } from 'react'
import { useEffect } from 'react'
import OverlayModel from './OverlayModel'
import Cookies from 'js-cookie';
import ShareComponent from './shareJourney'

let scriptText = `
<script type="text/javascript" src="https://api.hypertarget.ai/"></script>
<script type="text/javascript">        
function onloadFunction(){     
        HYPERSNIPPET.initURL(["CODETOSITE","USERID"]);
    }
    window.onload = onloadFunction()
    document.onclick = function (event) {
        HYPERSNIPPET.analyzer(event,sessionStorage.getItem("key"),isLoadedForClick);
    }
    window.addEventListener("beforeunload", function (e) {
        e.preventDefault();
    })
</script>`

const Header = ({backgroundCol,displayShare,filterToken,websiteData}) => {
  const router = useRouter()
  const { query } = useRouter();
  const [session, setSession] = useState("");
  const [dispSnippet,setDispSnippet]=useState(false)
  const [dispShare,setDispShare]=useState(false)
  const [website,setWebsite]=useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [model, setModel] = useState({ isOpen: false, success: true })

  const collapseItems = [
    { title: 'About', link: `${process.env.INDEX_URL}/about` },
    { title: 'Features', link: `${process.env.INDEX_URL}/features` },
    { title: 'Pricing', link: '/pricing' },
    { title: 'Testimonials', link: `${process.env.INDEX_URL}/testimonials` },
    { title: 'Help', link: `${process.env.INDEX_URL}/help` },
  ]

  useEffect(() => {
    
    const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
    const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;;
    
    if (user && accessToken) {
      setSession({user,accessToken})
    }else{
        setSession("")
    }
    if(websiteData){
      setWebsite(websiteData)
    }
  
  }, [])
  
  
  const Box = styled('div', {
    boxSizing: 'border-box',
  })

  const copyToClipbord = (siteCode) => {
    const codeToCopy = scriptText.replace('CODETOSITE', siteCode)
    const finalCode = codeToCopy.replace('USERID', session.user.id)
    navigator.clipboard.writeText(finalCode)
  }

  const onClickVerifyPixel = () => {
    setLoading(true)
    personalPixelService.verifyPixel(session, website.websiteId).then((res) => {
      if (res['verified']) {
        setDispSnippet(false)
        setModel({ isOpen: true, success: true })
      } else {
        setError("failed")
        setLoading(false)
        setModel({ isOpen: true, success: false })
      }
      setLoading(false)
    })
  }

 /*  const onClickVerifyPixel = () => {
    setLoading(true)
    personalPixelService.verifyPixel(session, website.websiteId).then((res) => {
      if (res['verified']) {
        setModel({ isOpen: true, success: true })
      } else {
        setModel({ isOpen: true, success: false })
      }
      setLoading(false)
    })
  } */

  const renderPixelCode = (siteCode, userId) => {
    //console.log('PARANS ', userId)
    const codeToCopy = scriptText.replace('CODETOSITE', siteCode)
    const finalCode = codeToCopy.replace('USERID', userId)

    return finalCode
  }

  //console.log(website)

  return (
    <>
    <OverlayModel
        modelOpen={model.isOpen}
        closeHandler={() => setModel({ isOpen: false })}
        okHandler={() =>
          model.success
            ? setModel({ isOpen: false })
            : setModel({ isOpen: false })
        }
        imageUrl={
          model.success
            ? '/images/pixel-success-img.svg'
            : '/images/pixel-error-img.svg'
        }
        title={model.success ? 'Congratulations' : 'Verification Failed'}
        description={
          model.success
            ? 'Pixel was succesfully added.'
            : 'Error verifying Pixel!'
        }
      />
    <Modal
    closeButton
    width="60vw"
    blur
    aria-labelledby="modal-title"
    css={{background:"white",paddingTop:"0px"}}
    open={dispSnippet}
    onClose={()=>{setDispSnippet(false)}}
  >
    <div style={{background:"var(--nextui-colors-white)",padding:"0",width:"60vw",justifyContent:"center"}}>
    <Card>
              <Card.Body css={{ padding: '10px 40px', height: '60vh', background:"transparent"}}>
                <Text
                  h3
                  css={{ textAlign: 'center', color: '#201E7B' }}
                >
                  Add The Hypertarget Pixel To Your Site
                </Text>
                {/* <Textarea  minRows={10} disabled fullWidth placeholder="Loading pixel"
                                    value={website && website.websiteId ? renderPixelCode(website.websiteId, session && session.user.id) : 'Loading'}
                                /> */}
                <div className='pixeldispBox'>
                  {website && website.websiteId
                    ? renderPixelCode(
                        website.websiteId,
                        session && session.user.id
                      )
                    : 'Loading'}
                </div>
              </Card.Body>
              <Card.Footer>
                <Grid.Container gap={4}>
                  <Grid lg={3} md={3} sm={3} xs={0} />
                  <Grid lg={3} md={3} sm={3} xs={12} justify='center'>
                    <Button
                      disabled={loading}
                      className=''
                      size='lg'
                      css={{marginRight:30}}
                      onPress={() => copyToClipbord(website.websiteId)}
                    >
                      Copy Code
                    </Button>
                  </Grid>
                  <Grid lg={3} md={3} sm={3} xs={12} justify='center'>
                    <Button
                      disabled={loading}
                      className=''
                      size='lg'
                      css={{marginLeft:30}}
                      onClick={() => onClickVerifyPixel()}
                    >
                      {loading ? (
                        <Loading color='success' />
                      ) : (
                        'Verify Installation'
                      )}
                    </Button>
                  </Grid>
                  <Grid lg={3} md={3} sm={3} xs={0} />
                  <Grid>
                    {error && <Text>{error}</Text>}
                  </Grid>
                  
                </Grid.Container>
              </Card.Footer>
            </Card>
  </div>
  </Modal>

  <Modal
    closeButton
    width="50vw"
    blur
    aria-labelledby="modal-title"
    css={{background:"white",paddingTop:"0px"}}
    open={dispShare}
    onClose={()=>{setDispShare(false)}}
  >
    <div style={{background:"var(--nextui-colors-white)",padding:"0",width:"50vw",justifyContent:"center"}}>
      <ShareComponent user={session?.user?.name} session={session} filterToken={filterToken} id={query.id}/>
  </div>
  </Modal>
      {session && session.user ? (
        <Navbar
          variant='sticky'
          className='hyper-navbar'
          disableShadow
          css={{
            $$navbarBackgroundColor: 'transparent',
            $$navbarBlurBackgroundColor: 'transparent',
            position: 'absolute',
            background:backgroundCol
          }}
        >
          <Navbar.Brand>
            <Link href='/dashboard'>
              <Image
                src='/images/logo.svg'
                alt='Main Logo'
                objectFit='contain'
                loading='lazy'
              />
            </Link>
          </Navbar.Brand>

          <Navbar.Content css={{paddingRight:"3vw"}}>
          <Image
                src='/images/notificationWithNew.png'
                alt='Main Logo'
                objectFit='contain'
                loading='lazy'
                width={"25px"}
              />
           <Grid >
        <Dropdown placement="bottom-left">
          <Dropdown.Trigger>
            <User
              bordered
              as="button"
              size="md"
              color="primary"
              name={<h4>{session.user.name}</h4>}
              src={session.user.profilePhoto?session.user.profilePhoto:'/images/profilepic.png'}
              
            />
          </Dropdown.Trigger>
          <Dropdown.Menu color="primary" aria-label="User Actions">
            <Dropdown.Item key="profile" css={{ height: "$18" }} >
              <Text b color="inherit" css={{ d: "flex" }}>
                Signed in as
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
              {session.user.email}
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
            <Grid onClick={() => router.push("/setting")}>Settings</Grid>
            </Dropdown.Item>
            
            <Dropdown.Item key="logout" color="error" withDivider >
              <Grid onClick={() => authService.signOut()}>Log Out</Grid>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
          {/* <Button onPress={() => authService.signOut()} auto className='hyper-btn'>
              Sign Out {session.user.name}
            </Button>
 */}
              {displayShare==true && <Button size="sm" onPress={() => setDispSnippet(true)} css={{ height:"50%",color:"#201E7B",background:"white",border:"2px solid",borderColor:"#201E7B" }}>
              <Text size="$xs" weight="bold" css={{letterSpacing:"1px",color:"#201E7B"}}>CODE SNIPPET</Text> 
              </Button>}

              {displayShare==true && <Button size="sm" onPress={() =>{setDispShare(true)}} css={{ height:"50%",background:"#201E7B",border:"2px solid",borderColor:"#201E7B" }}>
                        <Text size="$xs" weight="bold" css={{color:"white",letterSpacing:"1px"}}>SHARE</Text> 
              </Button>}

          </Navbar.Content>

        </Navbar>
      ) : (
        <Navbar
          variant='sticky'
          className='hyper-navbar'
          disableShadow
          css={{
            $$navbarBackgroundColor: 'transparent',
            $$navbarBlurBackgroundColor: 'transparent',
            position: 'absolute',
          }}
        >
          <Navbar.Brand>
            <Navbar.Toggle
              aria-label='toggle navigation'
              css={{
                marginRight: 10,
                '@md': {
                  display: 'none',
                },
              }}
            />
            <Link href='/'>
              <Image
                src='/images/logo.svg'
                alt='Main Logo'
                objectFit='contain'
                loading='lazy'
              />
            </Link>
          </Navbar.Brand>
          {/* <Navbar.Content hideIn='sm'>
            <Link href={`${process.env.INDEX_URL}/about`}>About</Link>
            <Link href={`${process.env.INDEX_URL}/features`}>Features</Link>
            <Link href='/pricing'>Pricing</Link>
            <Link href={`${process.env.INDEX_URL}/testimonils`}>Testimonials</Link>
            <Link href={`${process.env.INDEX_URL}/help`}>Help</Link>
          </Navbar.Content> */}
          <Navbar.Content css={{
           marginLeft:"auto"
        }}>
            <Link href='/auth/signIn'>Sign In</Link>
            <Button
              onPress={() => router.push('/auth/signUp')}
              auto
              className='hyper-btn'
            >
              Start Free
            </Button>
          </Navbar.Content>
         {/*  <Navbar.Collapse>
            {collapseItems.map((item, index) => (
              <Navbar.CollapseItem key={index}>
                <Link
                  color='inherit'
                  css={{
                    minWidth: '100%',
                  }}
                  href={item.link}
                >
                  {item.title}
                </Link>
              </Navbar.CollapseItem>
            ))}
          </Navbar.Collapse> */}
        </Navbar>
      )}
    </>
  )
}


export default Header
