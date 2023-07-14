import { Button, Image, Text } from "@nextui-org/react";
import FacebookAuth from "react-facebook-auth";
import { authService } from "../services";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";

const FacebookAuthLogin = ({ setFormError, setLoading }) => {
  const router = useRouter();
  const MyFacebookButton = ({ onClick }) => (
    <Button size="lg" onClick={onClick} style={{ width: "100%" }}>
      <Image
        src="/images/facebook.png"
        alt="google"
        height={20}
        css={{ marginRight: 20 }}
      />
      <Text css={{ color: "#ffffff" }}>Sign Up with Facebook</Text>
    </Button>
  );

  const authenticate = async (response) => {
    setLoading(true)
    //console.log(response);
    const userObject = response;
    if (response.error) {
      setFormError({
        status: "error",
        message: response.error.message,
      });
    } else {
      const payload = {
        email: userObject.email,
        name: userObject.name,
      };
      await authService.signUpFacebook(payload).then(async (res) => {
        //console.log("res SP", res)
        if (res.status === 200) {
          await authService.signInFacebookAuth({email: userObject.email,
            name: userObject.name,}).then(res => {
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
                setLoading(false);
            }
        })
          
        } else {
          setLoading(false);
          setFormError({
            status: "error",
            message: res.message,
          });
        }
      });
    }
  };
  return (
    <div>
      <FacebookAuth
        appId={process.env.FACEBOOK_APP_ID}
        callback={authenticate}
        component={MyFacebookButton}
        onFailure={(error) => {
          console.log("Login Failed.  ",error);
        }}
      />
    </div>
  );
};

export default FacebookAuthLogin;
