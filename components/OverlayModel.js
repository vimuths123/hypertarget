import { Modal, Image, Text, Button } from "@nextui-org/react"

const OverlayModel = ({modelOpen, closeHandler, okHandler, imageUrl, title, description}) => {
    return(
        <Modal open={modelOpen} onClose={closeHandler} blur width={600}>
            <Modal.Body css={{ textAlign: 'center', padding: 40 }}>
                <Image src={imageUrl} objectFit="contain" autoResize area-aria-labelledby="overlay-model"/>
                <Text h3 css={{ color: 'var(--button_blue)', marginBottom: 0}}>{title}</Text>
                <Text>{description}</Text>
                <Button className="hyper-btn" onClick={() => okHandler()} size='lg' css={{ maxWidth: 400, margin: 'auto' }}>OK</Button>
            </Modal.Body>
        </Modal>
    )
}

export default OverlayModel;