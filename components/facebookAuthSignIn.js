import { Button, Image, Text } from "@nextui-org/react";
import { authService } from "../services";
import FacebookAuth from "react-facebook-auth";
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
      <Text css={{ color: "#ffffff" }}>Sign In with Facebook</Text>
    </Button>
  );

  const authenticate = async (response) => {
    setLoading(true);
    const userObject = response;
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
