/* eslint-disable jsx-a11y/alt-text */
import { Card, Grid, Image, Spacer,Input, Text, Loading,Button, Checkbox } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Cookies from 'js-cookie';
import { profileService,paymentService } from "../services";

function GeneralSetting({ website_Id, name, date }) {
    const router = useRouter();
    const divRef = useRef(null);
    const [session, setSession] = useState("");
    const [error, setError] = useState("");
    const [pageLoading, setPageLoading] = useState(true)
    const [formLoading, setformLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isNewPassword,setIsnewPassword]=useState(false)
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
        newpassword: "",
        confirmpassword: "",
        
    });
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileError, setProfileError] = useState("")
  
    useEffect(() => {
      
      const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
      const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;
        if (!user || !accessToken) {
        router.push('/auth/signIn')
      }
      else if ( user && accessToken && user.isSubscribed) {
        setSession({user,accessToken})
        setUserInfo({ ...userInfo, name: user.name, email: user.email,password:"" });
        setPageLoading(false)
      } else if(user && accessToken){
        setSession({user,accessToken})
        setUserInfo({ ...userInfo, name: user.name, email: user.email,password:"" });
        paymentService.isSubscribed({user,accessToken}).then((res)=>{
          if(res.status==200 && res.isSubscribed==false){
            router.push('/pricing')
          }else{
               setPageLoading(false)
          }
        })
        
      }else{
        setLoading(true)
      }
    }, [])


    const updateBasicInfoSave=async ()=>{
      setformLoading(true)
      if(userInfo.password==""){
        setError("Old password must needed for update basic user data!")
        setformLoading(false)
        return
      }
      if(userInfo.newpassword !=""){
        if(userInfo.confirmpassword==""){
          setError("Confirm password must needed for upadte new password!")
          setformLoading(false)
          return
        }
        if(userInfo.confirmpassword!=userInfo.newpassword){
          setError("new password and confirm Password did not match!")
          setformLoading(false)
          return
        }

        const response=await profileService.updateBasicInfo(session,userInfo)
        if(response.status==200){
          Cookies.set('user', JSON.stringify(response.user));
          setError("successfully update!")
          setformLoading(false)
          return
        }else{
          setError(response.message)
          setformLoading(false)
        }

      }
      else{
        const response=await profileService.updateBasicInfo(session,{name:userInfo.name,email:userInfo.email,password:userInfo.password})
        if(response.status==200){
          Cookies.set('user', JSON.stringify(response.user));
          setError("successfully update!")
          setformLoading(false)
          return
        }else{
          setError(response.message)
          setformLoading(false)
        }
      }

    }


    function convertImageToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
    
        reader.onload = () => {
          resolve(reader.result);
        };
    
        reader.onerror = (error) => {
          reject(error);
        };
      });
    }


    const updatePhofilePic=async (file)=>{
      try {
        const base64 = await convertImageToBase64(file);
      setProfileLoading(true)
      const response=await profileService.updateProfileImage(session,{profilePhoto:base64})
      console.log(response)
        if(response.status==200){
          Cookies.set('user', JSON.stringify(response.user));
          setProfileError("successfully update!")
          setProfileLoading(false)
          return
        }else{
          setProfileError(response.message)
          setProfileLoading(false)
        }
      } catch (error) {
        setProfileError("something went wrong !")
      }


    }


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
            case 'newpassword':
                setUserInfo({ ...userInfo, newpassword: value });
                break;
            case 'confirmpassword':
                setUserInfo({ ...userInfo, confirmpassword: value });
                break;
            default:
                console.log("No field defined")
        }
    }

    return (
      <Grid
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "100%",
          cursor: "pointer",
        }}
      >
        <Grid.Container css={{ justifyContent: "center" }}>
          <Grid lg={4} md={4} sm={12} xs={12}>
            <Grid.Container css={{ alignContent: "flex-start" }}>
              <Grid
                xs={12}
                css={{
                  padding: "20px",
                  paddingLeft: "0px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Text h3>PROFILE</Text>
              </Grid>
              <Grid
                xs={12}
                css={{
                  padding: "10px",
                  paddingRight: "20px",
                  paddingLeft: "0px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {profileLoading?
                <Loading css={{width:"200px",height:"200px",borderRadius: "100%"}} />:<Image
                  src={(session && session.user.profilePhoto)?session.user.profilePhoto:'/images/profilepic.png'}
                  alt="Main Logo"
                  objectFit="cover"
                  loading="lazy"
                  width={"200px"}
                  height={"200px"}
                  css={{ borderRadius: "100%" }}
                />}
              </Grid>
              <Grid
                xs={12}
                css={{
                  padding: "10px",
                  paddingLeft: "0px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Text h4>{session && session.user.name}</Text>
              </Grid>
              <Grid
                xs={12}
                css={{
                  padding: "10px",
                  paddingLeft: "0px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Button
                  disabled={loading}
                  size="md"
                  onPress={() => {}}
                  css={{
                    background: "white !important",
                    color: "black !important",
                    border: "black 1px solid",
                  }}
                >
                  <input
                    disabled={loading}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(event) => {
                      const fileUplaod = event.target.files[0];
                      updatePhofilePic(fileUplaod)
                    }}
                  />
                </Button>
              </Grid>
              {profileError && profileError.length > 0 && (
                        <Grid
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          justify="center"
                          css={{ textAlign: "center", color: "red" }}
                        >
                          {profileError}
                        </Grid>
                      )}
            </Grid.Container>
          </Grid>

          <Grid
            lg={8}
            md={8}
            sm={12}
            xs={12}
            css={{ borderLeft: "1px solid #EAEAEA !important" }}
          >
            <Grid.Container css={{ alignContent: "flex-start" }}>
              <Grid
                xs={12}
                css={{
                  padding: "20px",
                  width: "100%",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                <Text h3>BASIC INFO</Text>
              </Grid>

              <Grid
                xs={12}
                css={{
                  padding: "20px",
                  width: "100%",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                <Card css={{ background: "transparent !important" }}>
                  <Card.Body css={{ background: "transparent !important" }}>
                    <Input
                      bordered
                      size="md"
                      fullWidth
                      label="Name"
                      type="text"
                      placeholder="Enter your name"
                      value={userInfo.name}
                      onChange={(e) => updateUserInfo("name", e.target.value)}
                    />
                    <Spacer y={1} />
                    <Input
                      bordered
                      size="md"
                      fullWidth
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      value={userInfo.email}
                      onChange={(e) => updateUserInfo("email", e.target.value)}
                    />

                    <Spacer y={1} />
                    <Input
                      bordered
                      size="md"
                      fullWidth
                      label="Old Password"
                      type="password"
                      placeholder="Enter your password"
                      value={userInfo.password}
                      onChange={(e) =>
                        updateUserInfo("password", e.target.value)
                      }
                    />

                    <Spacer y={1} />
                    <Checkbox
                      checked={isNewPassword}
                      onChange={(e) => {
                        setUserInfo({
                          ...userInfo,
                          newpassword: "",
                          confirmpassword: "",
                        });
                        setIsnewPassword(!isNewPassword);
                      }}
                      label="change paswword"
                    />

                    <Spacer y={1} />
                    {isNewPassword && (
                      <Input
                        bordered
                        size="md"
                        fullWidth
                        label="New Password"
                        type="password"
                        placeholder="Enter your password"
                        value={userInfo.newpassword}
                        onChange={(e) =>
                          updateUserInfo("newpassword", e.target.value)
                        }
                      />
                    )}

                    <Spacer y={1} />
                    {isNewPassword && (
                      <Input
                        bordered
                        size="md"
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        placeholder="Enter your password"
                        value={userInfo.confirmpassword}
                        onChange={(e) =>
                          updateUserInfo("confirmpassword", e.target.value)
                        }
                      />
                    )}
                  </Card.Body>

                  <Card.Footer>
                    <Grid.Container
                      css={{ justifyContent: "end", padding: "10px" }}
                    >
                      <Grid
                        xl={3}
                        lg={3}
                        md={4}
                        sm={4}
                        xs={12}
                        css={{ justifyContent: "center", padding: "5px" }}
                      >
                        <Button
                          disabled={loading}
                          className="hyper-btn"
                          size="md"
                          onPress={() => {
                            setUserInfo({
                              name: "",
                              email: "",
                              password: "",
                              newpassword: "",
                              confirmpassword: "",
                            });
                          }}
                          css={{
                            background: "white !important",
                            color: "black !important",
                            borderRadius: "1px",
                            border: "black 1px solid",
                          }}
                        >
                          cancel
                        </Button>
                      </Grid>

                      <Grid
                        xl={3}
                        lg={3}
                        md={4}
                        sm={4}
                        xs={12}
                        css={{ justifyContent: "center", padding: "5px" }}
                      >
                        <Button
                          disabled={loading}
                          size="md"
                          className="hyper-btn"
                          onPress={() => {}}
                          css={{ borderRadius: "1px" }}
                          onClick={() => {
                            updateBasicInfoSave();
                          }}
                        >
                          {formLoading ? <Loading color="success" /> : "save"}
                        </Button>
                      </Grid>
                      {error && error.length > 0 && (
                        <Grid
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          justify="center"
                          css={{ textAlign: "center", color: "red" }}
                        >
                          {error}
                        </Grid>
                      )}
                    </Grid.Container>
                  </Card.Footer>
                </Card>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>
      </Grid>
    );

}

export default GeneralSetting;