import {
  GoogleOAuthProvider,
  GoogleLogin,
} from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { signIn} from 'next-auth/react'

const GoogleSignIn = ({setFormError,setLoading}) => {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={async (response) => {
          const userObject = jwt_decode(response.credential);
          console.log(userObject);
         if(userObject.email_verified){ const res = await signIn('credentials', {
            redirect: false,
            email: userObject.email,
            name: userObject.name,
            provider:'google',
            callbackUrl: `${window.location.origin}`,
        });
        //console.log('res',res)
        if (res?.error) {
          setFormError({
                status: 'error',
                message: res.error
            });
            setLoading(false);
        } else {
            setLoading(false);
            //console.log(res)
        }}
        else{
          setFormError({
            status: 'error',
            message: 'email verified failed! please verify your email.'
        });
        }
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        text='sign in with google'
      />
      ;
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;
