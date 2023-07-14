import React, { useEffect, useRef } from "react";
import panzoom from "panzoom";
import { useState } from "react";

function MyPage({children,showXarrow}) {
    const myElementRef = useRef(null);
    const panZoomControllerRef = useRef(null);
    const [firstTime, setfirstTime] = useState(false)

  useEffect(() => {
    // initialize panzoom on the paragraph element
   if(showXarrow==true){ 
    const paragraphElement = myElementRef.current;
    const paragraphPz = panzoom(paragraphElement, {
      maxZoom: 8,
      minZoom: 0.1,
      smoothScroll: false,
      initialZoom:1,
    });

    const element = myElementRef.current;
    const panZoomController = panzoom(element);
    panZoomControllerRef.current = panZoomController;

    setfirstTime(true)
    // cleanup function to remove panzoom on unmount
    return () => {
      paragraphPz.dispose();
    };}

  }, [showXarrow]);

  function handleZoom() {
    /* const scale=window.innerHeight/myElementRef.current.offsetHeight
    const scaleValue=0.1<=scale<=1?scale:(scale<0.1?0.1:1) */
    panZoomControllerRef.current && panZoomControllerRef.current.smoothZoom(0, 0, 0.2);;
  }

  if(firstTime && showXarrow){
    setfirstTime(false)
    const setDisp=async ()=>{
        await setTimeout(() => {
            handleZoom()
        }, 1000);
      }
      setDisp()
  }

  return (
    <div>
      <div
        ref={myElementRef}
        style={{ userSelect: "none", fontSize: "1.5rem" }}
      >
        {children}
      </div>
    </div>
  );
}

export default MyPage;
