import { Grid, Text } from "@nextui-org/react"

const Footer = () => {
    return (
        <Grid.Container className="hyper-footer" justify="space-between" css={{ margin: '40px auto',
            "@md": { maxWidth: 800 },
            "@lg": { maxWidth: 800 }
            }}>
            <Text>Home</Text>
            <Text>FAQ</Text>
            <Text>Tutorials</Text>
            <Text>Privacy Policy</Text>
            <Text>Terms of Service</Text>
        </Grid.Container>
    )
}

export default Footer;