import { signInWithGoogle } from '@/lib/auth';
import { Container, Typography, Button, Box } from '@mui/material';

const LandingPage: React.FC = () => {

    const handleGetStarted = () => {
        signInWithGoogle();
    };

    return (
        <Container maxWidth="lg" className="py-20">
            <Box className="text-center">
                <Typography variant="h2" component="h1" className="font-bold mb-4">
                    Welcome to Pantry Manager
                </Typography>
                <Typography variant="h5" component="p" className="mb-12">
                    Easily manage your pantry items and keep track of what you have.
                </Typography>
                <Button variant="contained" color="primary" size="large" onClick={handleGetStarted}>
                    Get Started
                </Button>
            </Box>
            <Box className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <Box className="text-center">
                    {/* <Image src="/images/easy_to_use.png" alt="Easy to Use" width={150} height={150} /> */}
                    <Typography variant="h6" component="h3" className="font-bold mt-4">
                        Easy to Use
                    </Typography>
                    <Typography variant="body1" component="p">
                        Our user-friendly interface makes managing your pantry a breeze.
                    </Typography>
                </Box>
                <Box className="text-center">
                    {/* <Image src="/images/track_items.png" alt="Track Items" width={150} height={150} /> */}
                    <Typography variant="h6" component="h3" className="font-bold mt-4">
                        Track Items
                    </Typography>
                    <Typography variant="body1" component="p">
                        Keep an inventory of all your pantry items with ease.
                    </Typography>
                </Box>
                <Box className="text-center">
                    {/* <Image src="/images/get_notified.png" alt="Get Notified" width={150} height={150} /> */}
                    <Typography variant="h6" component="h3" className="font-bold mt-4">
                        Get Notified
                    </Typography>
                    <Typography variant="body1" component="p">
                        Receive notifications when items are running low.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default LandingPage;