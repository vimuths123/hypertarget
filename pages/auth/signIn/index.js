import { Container, Grid, Text, Input, Button, Image, Loading, Spacer, Card } from "@nextui-org/react"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { authService } from "../../../services";
import GoogleSignIn from "../../../components/googleAuthSignIn";
import FacebookAuth from "../../../components/facebookAuthSignIn";
import Cookies from 'js-cookie';


const SignIn = () => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({ email: '', password: '' });
    const [formError, setFormError] = useState({ status: 'default', message: '' });
    const [loading, setLoading] = useState(false);
    const [loadingFacebook, setLoadingFacebook] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [pageloading, setPageLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
        const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;;
        
        if (user && accessToken) {
            setIsAuthenticated(true)
            router.push('/pricing')
        }else{
            setIsAuthenticated(false)
            setPageLoading(false)
        }
      }, []);


    const updateUserInfo = (field, value) => {
        switch (field) {
            case 'email':
                setUserInfo({ ...userInfo, email: value });
                break;
            case 'password':
                setUserInfo({ ...userInfo, password: value });
                break;
            default:
                console.log("No field defined")
        }
    }

    const onClickSignIn =async () => {
        await authService.signIn(userInfo).then(res => {
            //console.log(res)
            if (res.user && res.accessToken) {
                const user = res.user;
                Cookies.set('user', JSON.stringify(user));
                Cookies.set('accessToken', res.accessToken);
                router.push('/pricing')
            } else {
                setFormError({
                    status: 'error',
                    message: res.message
                });
            }
        })
    }

    const validateFields = () => {
        const isValidEmail = userInfo.email && userInfo.email.length > 0;
        const isValidPassword = userInfo.password && userInfo.password.length > 0;

        return (isValidEmail && isValidPassword) ? true : false;
    }

    return (<>{pageloading?<></>:
        <div className="hyper-sign-in">
            <Header />
            <Container lg css={{ paddingTop: 100 }}>
                <Grid.Container>
                    <Grid lg={3} md={3} sm={3} xs={0}></Grid>
                    <Grid direction="column" lg={6} md={6} sm={6} xs={12}>
                        <Card css={{ padding: '50px 30px' }}>
                            <Text h3>Sign In</Text>
                            <Input fullWidth label="Email" type="email" placeholder="Enter your email"
                                value={userInfo.email}
                                onChange={(e) => updateUserInfo('email', e.target.value)}
                                status={formError.status}
                            />
                            <Spacer y={1} />
                            <Input fullWidth label="Password" type="password" placeholder="Enter your password"
                                value={userInfo.password}
                                onChange={(e) => updateUserInfo('password', e.target.value)}
                                status={formError.status}
                            />
                            {formError.message.length > 0 && <><Spacer y={1} />
                                <Text css={{ margin: 0 }} color="error">{formError.message}</Text>
                            </>}
                            <Spacer y={1.5} />
                            <Button disabled={loading} className='hyper-btn' size="lg" onPress={() => onClickSignIn()}>
                                {loading ? <Loading color="success" /> : "Sign In"}
                            </Button>
                            <Spacer y={0.5} />

                            {!loadingGoogle?<GoogleSignIn setFormError={(val)=>setFormError(val)} setLoading={(val)=>setLoadingGoogle(val)}/>
                             :<Button onClick={() => login()} size="lg" bordered color="#000000">
                             <Image
                             src="/images/googlelogo.png"
                             alt="google"
                             autoResize
                             height={30}
                             css={{ marginRight: 20 }}
                             />
                         <Loading color='success' />
                     </Button> }
                            
                            {/* <GoogleSignInTest setFormError={(val)=>setFormError(val)} setLoading={(val)=>setLoading(val)} />
                            <Button size="lg" bordered color="#000000">
                            <GoogleSignIn setFormError={(val)=>setFormError(val)} setLoading={(val)=>setLoadingGoogle(val)} />
                            </Button> */}
                            <Spacer y={0.5} />
                            {!loadingFacebook?<FacebookAuth setFormError={(val)=>setFormError(val)} setLoading={(val)=>setLoadingFacebook(val)}/>
                             :<Button size="lg">
                                <Image src="/images/facebook.png" alt="google" height={20} css={{ marginRight: 20 }} />
                                <Loading color='success' />
                            </Button> }
                        </Card>
                    </Grid>
                    <Grid lg={3} md={3} sm={3} xs={0}></Grid>
                </Grid.Container>
            </Container>
        </div>
    }</>
    )
}

export default SignIn;