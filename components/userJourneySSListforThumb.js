/* eslint-disable react-hooks/rules-of-hooks */
import { Grid, Image, Text } from "@nextui-org/react"
import { useState } from "react";
import Xarrow,{useXarrow } from "react-xarrows";

const SSListingAuto = ({item,id,showXarrow,websiteId}) => {
  const [xArrowDisp,setXArroeDisp]=useState(true)

    return (
        <Grid.Container
          css={{ marginTop: 50,}}
          alignContent="center"
          alignItems="center"
          gap={2}
         
        >
          <Grid xl={12} lg={12} md={12} sm={12} xs={12}>
            <h3 className="text-primary">{item.dateRange}</h3>
          </Grid>
          
                
                  <Grid css={{display:"inline-flex",overflowX:"auto",overflowY:"hidden",alignItems:"center"}} >
          <Grid direction="column" xl={3} lg={3} md={3} sm={12} xs={12} css={{minWidth:"20vw",}}>
            {item && item.result && item.result[0] && item.result[0][0] &&  
            <Grid css={{ width: "auto",minWidth:"90%", maxWidth: "90%",height:"18vh"   }} id={websiteId?`socialRef1-${id}-${websiteId}`:`socialRef1-${id}`}>
            <div style={{
            marginLeft: "auto",
            marginRight: 0,
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
            zIndex:"1"
          }}>
                <div style={{borderRadius:'20px 20px 20px 0px',borderBottomLeftRadius:"0px",background:"#7395FD",color:"white",padding:'5px',width:"20%",position:"absolute"}}>
      {item.result[0][0].faceBookCount}
            </div>
            </div>
              <div
                style={{
                  marginTop:"15px"
                }}
              >
                <Image
              src="/images/auto-facebook.png"
              objectFit="fill"
            />
              
              </div>
            </Grid>}
           {item && item.result && item.result[0] && item.result[0][0] && <Grid css={{ width: "auto",minWidth:"90%", maxWidth: "90%",height:"18vh"   }} id={websiteId?`socialRef2-${id}-${websiteId}`:`socialRef2-${id}`}>
            <div style={{
            marginLeft: "auto",
            marginRight: 0,
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
            zIndex:"1",
          }}>
                <div style={{borderRadius:'20px 20px 20px 0px',borderBottomLeftRadius:"0px",background:"#7395FD",color:"white",padding:'5px',width:"20%",position:"absolute"}}>
                {item.result[0][0].googleCount}
            </div>
            </div>
              <div
                style={{
                  marginTop:"15px"
                }}
              >
                <Image
              src="/images/auto-google.png"
              objectFit="fill"
            />
              
              </div>
            </Grid>}
            {item && item.result && item.result[0] && item.result[0][0] && <Grid css={{ width: "auto",minWidth:"90%", maxWidth: "90%" ,height:"18vh" }} id={websiteId?`socialRef3-${id}-${websiteId}`:`socialRef3-${id}`}>
            <div style={{
            marginLeft: "auto",
            marginRight: "10px",
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
            zIndex:"1"
          }}>
                <div style={{borderRadius:'20px 20px 20px 0px',zIndex:"1",borderBottomLeftRadius:"0px",background:"#7395FD",color:"white",padding:'5px',width:"20%",position:"absolute"}}>
                {item.result[0][0].tiktokCount}
            </div>
            </div>
              <div style={{
                  marginTop:"15px"
                }}>
                <Image
              src="/images/auto-tiktok.png"
              objectFit="fill"
              css={{minWidth:"100%",minHeight:"100%",flexShrink:0}}
            />
              </div>
            </Grid>}
            {item && item.result && item.result[0] && item.result[0][0] && <Grid css={{ width: "auto",minWidth:"90%", maxWidth: "90%",height:"18vh"  }} id={websiteId?`socialRef4-${id}-${websiteId}`:`socialRef4-${id}`}>
            <div style={{
            marginLeft: "auto",
            marginRight: 0,
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
            zIndex:"1"
          }}>
                <div style={{borderRadius:'20px 20px 20px 0px',borderBottomLeftRadius:"0px",background:"#7395FD",color:"white",padding:'5px',width:"20%",position:"absolute"}}>
                {item.result[0][0].twitterCount}
            </div>
            </div>
              <div
                style={{
                  marginTop:"15px"
                }}
              >
                <Image
              src="/images/auto-twitter.png"
              objectFit="fill"
            />
              
              </div>
            </Grid>}
            {/* {item && item.result && item.result[0] && item.result[0][0] && item.result[0][0].raditCount>0||true  && <Grid css={{ width: "auto",minWidth:"90%", maxWidth: "90%",height:"18vh"   }} id={`socialRef5-${id}`}>
            <div style={{
            marginLeft: "auto",
            marginRight: 0,
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
            zIndex:"1"
          }}>
                <div style={{borderRadius:'20px 20px 20px 0px',borderBottomLeftRadius:"0px",background:"#7395FD",color:"white",padding:'5px',width:"20%",position:"absolute"}}>
      {item.result[0][0].radditCount}
            </div>
            </div>
              <div
                style={{
                  marginTop:"15px",
                }}
              >
                <Image
              src="/images/auto-reddit.png"
              objectFit="fill"
            />
              
              </div>
            </Grid>} */}
            {item && item.result && item.result[0] && item.result[0][0] && <Grid css={{ width: "auto",minWidth:"90%", maxWidth: "90%",height:"18vh"   }} id={websiteId?`socialRef5-${id}-${websiteId}`:`socialRef5-${id}`}>
            <div style={{
            marginLeft: "auto",
            marginRight: 0,
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
            zIndex:"1"
          }}>
                <div style={{borderRadius:'20px 20px 20px 0px',borderBottomLeftRadius:"0px",background:"#7395FD",color:"white",padding:'5px',width:"20%",position:"absolute"}}>
      {item.result[0][0].otherCount}
            </div>
            </div>
              <div
                style={{
                  marginTop:"15px",
                }}
              >
                <Image
              src="/images/auto-other.png"
              objectFit="fill"
            />
              
              </div>
            </Grid>}
          </Grid>

{
  item && item.result && item.result.map((journeyStep,StepId)=>{
    return <>
    <div
              direction="column"
              style={{ paddingLeft: 40, 
                justifyContent:"center",
                display: "flex",
                alignItems:"center",
                minWidth:"18vw",
                maxWidth:"20vw",
                padding:"20px 40px",
                flexDirection:"column"}}
              
            >
              {
                journeyStep && journeyStep.length>0 && journeyStep.map((journeyStepItem,journeyStepItemId)=>{
                  return <>
                  <div  style={{
                    marginLeft: `${journeyStepItem.metric=="click"?"auto":"auto"}`,
                    marginRight: `${journeyStepItem.metric=="click"?"auto":"auto"}`,
                    display: "flex",
                    justifyContent: "flex-end",
                    position: "relative",
                    zIndex:"1",
                    marginTop:"20px",
                    marginBottom:"20px",
                  }}>
                    <div style={{paddingTop:"10px",paddingRight:"0",}}>
                    {(journeyStepItem.metric && journeyStepItem.metric=="click")?
                    <>
                    {/* <Grid.Container id={StepId==0?"":`${journeyStepItem.item_id}start-${id}-${StepId}`} css={{padding:"10px 10px",minHeight:`${StepId==0?"40vh":"auto"}`,borderStyle:"solid",borderColor: '#201E7B',alignContent:"center",borderRadius:"50%",height:"100px",width:"100px",background:"#201E7B",justifyContent:"left"}}>
                    <div style={{background:"#201E7B",height:"auto",padding:"",alignItems:"center",width:"150px"}}>
                    <h5 style={{margin:"auto",textAlign:"center",color:"white"}}>{journeyStepItem.clickEvent.toUpperCase()}</h5>
                    </div>
                    </Grid.Container> */
                  }
                  <Grid.Container id={StepId==0?"":`${journeyStepItem.item_id}start-${id}-${StepId}`} css={{padding:"5px 10px",border:"2px",minHeight:`${StepId==0?"40vh":"auto"}`,borderStyle:"solid",borderColor: '#333333',alignContent:"center",borderRadius:"50px",height:"auto",width:"auto",background:"wite",justifyContent:"left"}}>
                    <div style={{background:"white",height:"auto",padding:"",alignItems:"center",width:"auto",minWidth:"75px"}}>
                    <h5 style={{margin:"auto",textAlign:"center",color:"#333333"}}>{journeyStepItem.totalCount}</h5>
                    </div>
                    </Grid.Container>
                    </>
                    :
                    <Image
                    src={journeyStepItem.ss && journeyStepItem.ss.length>0?journeyStepItem.ss[0].location:"/images/no_ss.png"}
                      objectFit="fill"
                      id={StepId==0?(`${journeyStepItem.item_id}start-${id}-${StepId}`):""}
                      css={{ maxHeight: `${StepId==0?"80vh":"70vh"}`, minWidth: "auto",border:"1px solid #D0D0D0" }}
                    />}
        
        {StepId==0?
        <>
        <div id={websiteId?`${journeyStepItem.item_id}start-${id}-${StepId}`:`${journeyStepItem.item_id}start-${id}-${StepId}-${websiteId}`}  style={{position: "absolute", left: "50%",top:"-300%",height:"700%",background:"red"}}>
      <div  style={{position: "relative", top: "50%", border: "dotted red 1px",display:"none"}}>
        .
      </div>
    </div>
    </>
    :
    <>
    <div id={`${journeyStepItem.item_id}end-${id}-${StepId}`} style={{position: "absolute", left: "15%",top:"-500%",height:"1100%",}}>
        <div style={{position: "relative", top: "50%", border: "dotted red 1px",display:"none"}}>
              .
            </div>
          </div>
        
          <div id={`${journeyStepItem.item_id}start-${id}-${StepId}`} style={{position: "absolute", left: "80%",top:"-100%",height:"300%",background:"red"}}>
            <div style={{position: "relative", top: "50%", border: "dotted red 1px",display:"none"}}>
              .
            </div>
          </div></>}
                    </div>
        
                    {journeyStepItem.metric!="click" &&  <div style={{borderRadius:'20px 20px 20px 0px',borderBottomLeftRadius:"0px",background:"#7395FD",color:"white",padding:'5px',minWidth:"50px",position:"absolute"}}>
          {journeyStepItem.totalCount}
                </div>}
                </div>
                {StepId==0?
                <>
                  <Xarrow showXarrow={xArrowDisp && showXarrow}
          strokeWidth={2}
          showHead={false}
          startAnchor="right"
          endAnchor="left"
          showTail={true}
          tailShape="circle"
          tailSize={3}
          start={websiteId?`socialRef1-${id}-${websiteId}`:`socialRef1-${id}`} //can be react ref
          end={websiteId?`${journeyStepItem.item_id}start-${id}-${StepId}`:`${journeyStepItem.item_id}start-${id}-${StepId}-${websiteId}`} //or an id
        />
        <Xarrow showXarrow={xArrowDisp && showXarrow}
          strokeWidth={2}
          startAnchor="right"
          endAnchor="left"
          showHead={false}
          showTail={true}
          start={websiteId?`socialRef2-${id}-${websiteId}`:`socialRef2-${id}`} //can be react ref
          end={websiteId?`${journeyStepItem.item_id}start-${id}-${StepId}`:`${journeyStepItem.item_id}start-${id}-${StepId}-${websiteId}`} //or an id
          tailShape="circle"
          tailSize={3}
        />
        <Xarrow showXarrow={xArrowDisp && showXarrow}
        strokeWidth={2}
     showHead={false}
            showTail={true}
            tailShape="circle"
            tailSize={3}
            startAnchor="right"
            endAnchor="left"
            start={websiteId?`socialRef3-${id}-${websiteId}`:`socialRef3-${id}`} //can be react ref
            end={websiteId?`${journeyStepItem.item_id}start-${id}-${StepId}`:`${journeyStepItem.item_id}start-${id}-${StepId}-${websiteId}`}
        />
        <Xarrow showXarrow={xArrowDisp && showXarrow}
     strokeWidth={2}
     startAnchor="right"
     endAnchor="left"
     showHead={false}
showTail={true}
tailShape="circle"
          tailSize={3}
          start={websiteId?`socialRef4-${id}-${websiteId}`:`socialRef4-${id}`} //can be react ref
          end={websiteId?`${journeyStepItem.item_id}start-${id}-${StepId}`:`${journeyStepItem.item_id}start-${id}-${StepId}-${websiteId}`} //or an id
        />
        <Xarrow showXarrow={xArrowDisp && showXarrow}
     strokeWidth={2}
     startAnchor="right"
     endAnchor="left"
     showHead={false}
showTail={true}
tailShape="circle"
          tailSize={3}
          start={websiteId?`socialRef5-${id}-${websiteId}`:`socialRef5-${id}`} //can be react ref
          end={websiteId?`${journeyStepItem.item_id}start-${id}-${StepId}`:`${journeyStepItem.item_id}start-${id}-${StepId}-${websiteId}`}//or an id
        />
                </>:
                <Xarrow showXarrow={xArrowDisp && showXarrow}
     strokeWidth={2}
     showHead={false}
     startAnchor="right"
     endAnchor="left"
     path="smooth"
     label={journeyStepItem.clickCount?<div style={{background:"white",height:"auto",padding:"",alignItems:"center",width:"auto",minWidth:"50px",minHeight:"50px",borderStyle:"solid",borderColor: '#696666',alignContent:"center",borderRadius:"100%",borderWidth:"2px",display: "flex",
     justifyContent: "center",
     alignItems: "center",}}>
     <h5 style={{margin:"auto",textAlign:"center",color:"#696666"}}>{journeyStepItem.clickCount}</h5>
     </div>:""}
     divContainerStyle={{zIndex:`${StepId==1?"0":0}`}}
     start={StepId-1==0?`${journeyStepItem.parent_id}start-${id}-${StepId-1}`:`${journeyStepItem.parent_id}start-${id}-${StepId-1}`}  //can be react ref
     end={`${journeyStepItem.item_id}end-${id}-${StepId}`}  //or an id
        />}
                </>
                  
                })
              }

            </div>

            
    </>
  })
}
          </Grid>
          
         

        </Grid.Container>
    )
}

export default SSListingAuto;