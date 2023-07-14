import { Button, Image, Text } from "@nextui-org/react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import axios from "axios";
import { authService } from "../services";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";

const WrappedAll = ({ setFormError, setLoading,router }) => {
  const successLoginFunction = async (response) => {
    setLoading(true);
    //console.log(response);
    const authres = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      }
    );
    const userObject = authres.data;
    //console.log("userObject :",userObject);
    if (userObject.email_verified) {
      await authService.signInGoogleAuth({email: userObject.email,
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
      setFormError({
        status: "error",
        message: "email verified failed! please verify your email.",
      });
    }
  };
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => successLoginFunction(tokenResponse),
  });

  return (
    <Button onClick={() => login()} size="lg" bordered color="#000000">
      <Image
        src="/images/googlelogo.png"
        alt="google"
        autoResize
        height={30}
        css={{ marginRight: 20 }}
      />
      <Text>Sign In with Google</Text>
    </Button>
  );
};

const GoogleSignIn = ({setFormError,setLoading}) => {
  const router = useRouter();
  
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID} >
      <WrappedAll setFormError={(val)=>setFormError(val)} setLoading={(val)=>setLoading(val)} router={router}  />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;


