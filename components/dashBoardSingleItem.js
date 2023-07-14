/* eslint-disable jsx-a11y/alt-text */
import { Grid, Image } from "@nextui-org/react";
import { useRouter } from "next/router";
import DashboardThumbnail from "./dashboardThumbnail";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

function DashBoardSingleItem({ website_Id, name, date }) {
    const router = useRouter();
    const divRef = useRef(null);
    const [ago,setAgo]=useState(0)

    const calculateTimeAgo = (date) => {
        const currentDate = new Date();
        const targetDate = new Date(date);
        const timeDifference = Math.abs(currentDate - targetDate) / 1000; // Convert to seconds
      
        if (timeDifference < 60) {
          return Math.floor(timeDifference) + ' seconds ago';
        } else if (timeDifference < 3600) {
          const minutes = Math.floor(timeDifference / 60);
          return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
        } else if (timeDifference < 86400) {
          const hours = Math.floor(timeDifference / 3600);
          return hours + (hours === 1 ? ' hour ago' : ' hours ago');
        } else if (timeDifference < 2592000) {
          const days = Math.floor(timeDifference / 86400);
          return days + (days === 1 ? ' day ago' : ' days ago');
        }
        
        else if (timeDifference < 31104000) {
            const months = Math.floor(timeDifference / 2592000);
            return months + (months === 1 ? ' month ago' : ' months ago');
          }
        
        else {
          const years = Math.floor(timeDifference / 31104000);
          return years + (years === 1 ? ' year ago' : ' years ago');
        }
      };

    useEffect(() => {
        const timeAgo = calculateTimeAgo(date);
        setAgo(timeAgo)


        const setDivHeight = () => {
          if (divRef.current) {
            const width = divRef.current.offsetWidth;
            divRef.current.style.height = `${width*0.69}px`;
          }
        };
    
        // Call the setDivHeight function initially and on window resize
        setDivHeight();
        window.addEventListener('resize', setDivHeight);
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', setDivHeight);
        };
      }, []);

    return (
        <Grid style={{ padding: "10px", marginBottom: "20px", width: "100%", cursor: "pointer",zIndex:"100" }} onClick={() => router.push(`/userJourneys/automaticallyTrack?id=${website_Id}`)}>
            <Grid.Container css={{ border: "1px solid #D0D0D0", justifyContent: "center" }}>
                <Grid lg={12} md={12} sm={12} xs={12} css={{}}>
                    
                    <div ref={divRef} style={{ width: "100%", overflow: "hidden",padding:"5px" }}>
                        <DashboardThumbnail website_id={website_Id} />
                    </div>

                </Grid>

                <Grid lg={12} md={12} sm={12} xs={12}>
                    <Grid css={{ padding: "20px" }}>
                        <h5 style={{ padding: 2, margin: 0 }}>{name} </h5>
                        <p style={{ padding: 2, margin: 0, color: "#B1B1B1" }}>{ago} </p>
                    </Grid>

                </Grid>
            </Grid.Container>
        </Grid>
    );

}

export default DashBoardSingleItem;