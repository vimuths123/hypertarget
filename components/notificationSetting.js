/* eslint-disable jsx-a11y/alt-text */
import { Card, Grid, Image, Spacer,Input, Text, Loading,Button, Checkbox } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Cookies from 'js-cookie';
import { notificationService } from "../services";

function NotificationSetting() {
    const router = useRouter();
    const [session, setSession] = useState("");
    const [error, setError] = useState("");
    const [pageLoading, setPageLoading] = useState(true)
    const [formLoading, setformLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [notificationOptions, setNotificationOptions] = useState({
        news: false,
        tips: false,
        user: false,
        reminder: false,
        
    });
  
    useEffect(() => {
      
      const user = Cookies.get('user')?JSON.parse(Cookies.get('user')):null;
      const accessToken = Cookies.get('accessToken')?Cookies.get('accessToken'):null;
        if (!user || !accessToken) {
        router.push('/auth/signIn')
      }
      else if ( user && accessToken && user.isSubscribed) {
        console.log(user)
        setSession({user,accessToken})
        setNotificationOptions({
          news: user.notification.news?user.notification.news:false,
          tips: user.notification.tips?user.notification.tips:false,
          user: user.notification.user?user.notification.user:false,
          reminder: user.notification.reminder?user.notification.reminder:false,
          
        })
        setPageLoading(false)
      } else if(user && accessToken){
        setSession({user,accessToken})
        setNotificationOptions({
          news: user.notification.news?user.notification.news:false,
          tips: user.notification.tips?user.notification.tips:false,
          user: user.notification.user?user.notification.user:false,
          reminder: user.notification.reminder?user.notification.reminder:false,
          
        })
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


    const updateNotificationInfoInfo = (field) => {
        switch (field) {
            case 'news':
                setNotificationOptions({ ...notificationOptions, news: !notificationOptions.news });
                break;
            case 'reminder':
                setNotificationOptions({ ...notificationOptions, reminder: !notificationOptions.reminder });
                break;
            case 'tips':
                setNotificationOptions({ ...notificationOptions, tips: !notificationOptions.tips });
                break;
            case 'user':
                setNotificationOptions({ ...notificationOptions, user: !notificationOptions.user });
                break;
            default:
                console.log("No field defined")
        }
    }

    const clickSave=async ()=>{
      setformLoading(true)
     
        const response=await notificationService.updateNotification(session,notificationOptions)
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

    return (
      <>
      {!pageLoading &&
       <Grid
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "100%",
          cursor: "pointer",
        }}
      >
        <Grid.Container css={{ justifyContent: "center" }}>

        <Grid
            lg={6}
            md={6}
            sm={12}
            xs={12}

            css={{justifyContent:"center",marginBottom:"6vh",marginTop:"6vh",alignContent:"center",paddingLeft:"20px"}}
          >
            <Checkbox
                      checked={notificationOptions.news}
                      defaultSelected={notificationOptions.news}
                      onChange={(e) => {
                        updateNotificationInfoInfo("news");
                        
                      }}
                      label={<div>
                        <h4 style={{padding:"0px",margin:"0px"}}>News and updates</h4>
                        <p style={{padding:"0px",margin:"0px"}}>
                        News about products and features updates.
                    </p>
                        </div>}
                    />
          </Grid>

          <Grid
            lg={6}
            md={6}
            sm={12}
            xs={12}

            css={{justifyContent:"center",marginBottom:"6vh",marginTop:"6vh",alignContent:"center",paddingLeft:"20px"}}
          >
            <Checkbox
                      checked={notificationOptions.tips}
                      defaultSelected={notificationOptions.tips}
                      onChange={(e) => {
                        updateNotificationInfoInfo("tips");
                        
                      }}
                      label={<div>
                        <h4 style={{padding:"0px",margin:"0px"}}>Tips and Tutorials</h4>
                        <p style={{padding:"0px",margin:"0px"}}>
                        News about products and features updates.
                    </p>
                        </div>}
                    />
          </Grid>

          <Grid
            lg={6}
            md={6}
            sm={12}
            xs={12}

            css={{justifyContent:"center",marginBottom:"6vh",marginTop:"6vh",alignContent:"center",paddingLeft:"20px"}}
          >
            <Checkbox
                      checked={notificationOptions.user}
                      defaultSelected={notificationOptions.user}
                      onChange={(e) => {
                        updateNotificationInfoInfo("user");
                        
                      }}
                      label={<div>
                        <h4 style={{padding:"0px",margin:"0px"}}>User research</h4>
                        <p style={{padding:"0px",margin:"0px"}}>
                        News about products and features updates.
                    </p>
                        </div>}
                    />
          </Grid>

          <Grid
            lg={6}
            md={6}
            sm={12}
            xs={12}

            css={{justifyContent:"center",marginBottom:"6vh",marginTop:"6vh",alignContent:"center",paddingLeft:"20px"}}
          >
            <Checkbox
                      checked={notificationOptions.reminder}
                      defaultSelected={notificationOptions.reminder}
                      css={{color:"#0F6A91"}}
                      onChange={(e) => {
                        updateNotificationInfoInfo("reminder");
                      }}
                      label={<div>
                        <h4 style={{padding:"0px",margin:"0px"}}>Reminders</h4>
                        <p style={{padding:"0px",margin:"0px"}}>
                        News about products and features updates.
                    </p>
                        </div>}
                    />
          </Grid>


          
        </Grid.Container>


        <Grid.Container
                      css={{ justifyContent: "center", padding: "10px" }}
                    >
                      <Grid
                        xl={3}
                        lg={3}
                        md={4}
                        sm={4}
                        xs={12}
                        css={{ '@media screen and (max-width: 768px)': {
                            justifyContent: 'center',
                          },
                          '@media screen and (min-width: 769px)': {
                            justifyContent: 'flex-end',
                          }, padding: "5px" }}
                      >
                        <Button
                          disabled={loading}
                          className="hyper-btn"
                          size="md"
                          onPress={() => {
                          }}
                          css={{
                            background: "white !important",
                            color: "#0F6A91 !important",
                            borderRadius: "10px",
                            border: "#0F6A91 1px solid",
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
                        
                        css={{ '@media screen and (max-width: 768px)': {
                            justifyContent: 'center',
                          },
                          '@media screen and (min-width: 769px)': {
                            justifyContent: 'flex-start', padding: "5px" }}
                        }
                      >
                        <Button
                          disabled={loading}
                          size="md"
                          className="hyper-btn"
                          onPress={() => {}}
                          css={{ borderRadius: "10px" }}
                          onClick={() => {
                            clickSave()
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
      </Grid>}
      </>
    );

}

export default NotificationSetting;