import React, { useEffect, useState } from 'react';
import { Container, Grid, Text, Input, Button, Image, Loading, Spacer, Card } from "@nextui-org/react"
import Header from "../../../components/Header";
import { useRouter } from 'next/router';
import { authService } from '../../../services';
import GoogleSignUp from "../../../components/googleAuthSignUp";
import FacebookAuthSignUp from "../../../components/facebookAuthSignUp";
import Cookies from 'js-cookie';

const SignUp = () => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [formError, setFormError] = useState({ status: 'default', message: '' });
    const [loading, setLoading] = useState(false);
    const [loadingFacebook, setLoadingFacebook] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [pageloading, setPageLoading] = useState(true)

      useEffect(() => {
        const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
        const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;;
        
        if (user && accessToken) {
            router.push('/pricing')
        }else{
            setPageLoading(false)
        }
      }, []);

    const updateUserInfo = (field, value) => {
        switch (field) {
            case 'name':
                setUserInfo({ ...userInfo, name: value });
                break;
            case 'email':
                setUserInfo({ ...userInfo, email: value });
                break;
            case 'password':
                setUserInfo({ ...userInfo, password: value });
                break;
            case 'confirmPassword':
                setUserInfo({ ...userInfo, confirmPassword: value });
                break;
            default:
                console.log("No field defined")
        }
    }
    const validateFields = () => {
        const isValidName = userInfo.name && userInfo.name.length > 0;
        const isValidEmail = userInfo.email && userInfo.email.length > 0;
        const isValidPassword = userInfo.password && userInfo.password.length > 0;
        const isValidConfirmPassword = userInfo.confirmPassword && userInfo.confirmPassword.length > 0;

        return (isValidName && isValidEmail && isValidPassword && isValidConfirmPassword) ? true : false;
    }

    const onClickSignIn =async () => {
        await authService.signIn({ email: userInfo.email, password: userInfo.password }).then(res => {
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


    const onClickSubmit = async () => {
        if(userInfo.password==userInfo.confirmPassword){
        if (validateFields()) {
            setLoading(true);
            authService.signUp(userInfo).then(async (res) => {
                //console.log("res SP", res)
                if (res.status === 200 ) {
                   await onClickSignIn()
                } else {
                    setLoading(false);
                    setFormError({
                        status: 'error',
                        message: res.message
                    });
                }
            })
        } else {
            setLoading(false);
            setFormError({
                status: 'error',
                message: "Mandatory fields are empty!"
            });
        }
    }else {
        setLoading(false);
        setFormError({
            status: 'error',
            message: "please check password and confirm password again!"
        });
    }
    }

    return (<>{pageloading?<></>:
        <div className="hyper-sign-up">
            <Header />
            <Container lg css={{ paddingTop: 100 }}>
                <Grid.Container>
                    <Grid lg={3} md={3} sm={3} xs={0}></Grid>
                    <Grid direction="column" lg={6} md={6} sm={6} xs={12}>
                        <Card css={{ padding: '50px 30px' }}>
                            <Text h3>Sign Up</Text>
                            <Input fullWidth label="Name" placeholder="Enter your name"
                                value={userInfo.name}
                                onChange={(e) => updateUserInfo('name', e.target.value)}
                                status={formError.status}
                            />
                            <Spacer y={1} />
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
                            <Spacer y={1} />
                            <Input fullWidth label="Confirm Password" type="password" placeholder="Enter your password again"
                                value={userInfo.confirmPassword}
                                onChange={(e) => updateUserInfo('confirmPassword', e.target.value)}
                                status={formError.status}
                            />
                            {formError && formError.message.length > 0 && <><Spacer y={1} />
                                <Text css={{ margin: 0 }} color="error">{formError.message}</Text>
                            </>}
                            <Spacer y={1.5} />
                            <Button disabled={loading} onPress={() => onClickSubmit()} className='hyper-btn' size="lg">
                                {loading ?  <Loading color="success" /> : "Sign Up"}
                                </Button>
                            <Spacer y={0.5} />
                            {!loadingGoogle?<GoogleSignUp setFormError={(val)=>setFormError(val)} setLoading={(val)=>setLoadingGoogle(val)}/>
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
                            {/* <Button size="lg" bordered color="#000000">
                            <GoogleSignUp setFormError={(val)=>setFormError(val)} setLoading={(val)=>setLoading(val)} />
                            </Button> */}
                            <Spacer y={0.5} />
                            {!loadingFacebook?<FacebookAuthSignUp setFormError={(val)=>setFormError(val)} setLoading={(val)=>setLoadingFacebook(val)}/>
                             :<Button size="lg">
                                <Image src="/images/facebook.png" alt="google" height={20} css={{ marginRight: 20 }} />
                                <Loading color='success' />
                            </Button> }
                        </Card>
                    </Grid>
                    <Grid lg={3} md={3} sm={3} xs={0}></Grid>
                </Grid.Container>
            </Container>
        </div>}</>
    )
}

export default SignUp;