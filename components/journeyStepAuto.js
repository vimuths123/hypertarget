import { Dropdown, Grid, Input } from "@nextui-org/react"
import { useState } from "react";

const JourneyStepAuto = ({ step, index, onUpdate, website }) => {
    const [buttonRenderAvailable,setButtonRenderAvailable]=useState(false)
    
    const renderUrls = () => {
        var uniquePageUrls=[]
        if(website?.pages){
            uniquePageUrls = [...new Set(website.pages.map(item => item.pageUrl))];
        }
        //console.log("uniquePageUrls :",uniquePageUrls)
        const urlList = [];
        uniquePageUrls.map((page, i) => {
            //console.log("Page ", page)
            urlList.push(<Dropdown.Item key={page}>{page}</Dropdown.Item>)
        })

        return urlList;
    }

    const renderClickEvents = () => {
        const clickText = [];
        const clickEventList = [];
        website && website.pages && website.pages.find(page => {
            if (page.pageUrl === step.url) {
                page.clickEvents.map((clickEvent, i) => {
                    const attr = clickEvent.text.replace(/\s/g,' ');
                    if (!clickText.includes(attr) && attr[0] !== "") {
                        clickText.push(attr);
                        clickEventList.push(<Dropdown.Item key={attr}>{attr}</Dropdown.Item>)
                    }
                })
            }
        });
        //console.log("clickText", clickText)
        return clickEventList;
    }

    return (
        <Grid.Container gap={0} alignContent='flex-start'>
            <Grid lg={4} md={4} sm={4} xs={4} css={{ overflow: 'hidden' }}>
                <Dropdown css={{ width: '100%' }}>
                    <Dropdown.Button flat className="hyper-dropdown">{step.url ? step.url : 'URL Here'}</Dropdown.Button>
                    <Dropdown.Menu selectedKeys={step.url} onAction={(value) => onUpdate(index, 'url', value)} selectionMode='single'>
                        {renderUrls()}
                    </Dropdown.Menu>
                </Dropdown>
            </Grid>
            <Grid lg={4} md={4} sm={4} xs={4}>
                <Dropdown>
                    <Dropdown.Button flat className="hyper-dropdown">{step.metric ? step.metric : 'Metric'}</Dropdown.Button>
                    <Dropdown.Menu selectedKeys={step.metric} onAction={(value) => {if(value=='click'){setButtonRenderAvailable(true)}else{setButtonRenderAvailable(false)};onUpdate(index, 'metric', value)}} selectionMode='single'>
                        <Dropdown.Item key="click">Click</Dropdown.Item>
                        <Dropdown.Item key="pageVisit">Page Visit</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Grid>
            <Grid lg={4} md={4} sm={4} xs={4}>
                <Dropdown isDisabled={!buttonRenderAvailable} >
                    <Dropdown.Button disabled={!buttonRenderAvailable} flat className="hyper-dropdown-elect-event" css={{ color:'#44474a !important' }} >{!buttonRenderAvailable?'Not Available':step.clickEvent ? step.clickEvent : 'Select Event'}</Dropdown.Button>
                    <Dropdown.Menu selectedKeys={step.clickEvent} onAction={(value) => onUpdate(index, 'clickEvent', value)} selectionMode='single'>
                        {renderClickEvents()}
                    </Dropdown.Menu>
                </Dropdown>
            </Grid>
        </Grid.Container>
    )
}

export default JourneyStepAuto;