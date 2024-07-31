import { useState } from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Box, IconButton, Skeleton } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import AnimatedRainbowButton from './RainbowButton';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const drawerBleeding = 56;

interface Props {
    window?: () => Window;
}

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor:
        theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

const ChatMessage = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
}));

export default function SwipeableEdgeDrawer(props: Props) {
    const { window } = props;
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<React.JSX.Element[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
        if(!newOpen){
            setMessages([]);
        }
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    const handleButtonClick = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'pantry'));
            const items = querySnapshot.docs.map(doc => { return `${doc.data().name}, quantity: ${doc.data().quantity}` }).join("; ");

            if (items !== "") {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                        "HTTP-Referer": `https://pantrymanagement.vercel.app/`,
                        "X-Title": `https://pantrymanagement.vercel.app/`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": "meta-llama/llama-3.1-8b-instruct:free",
                        "messages": [
                            { "role": "system", "content": "You are a world class chef with the best culinary practices. I will give you the list of all the ingredients and it's quantity I have in my pantry and I want you to only return a delicious recipe made out of these items." },
                            { "role": "user", "content": items },
                        ],
                    })
                }).then(res => res.json());

                setMessages(parseApiResponse(response.choices[0].message.content));
            } else {
                setMessages([<p className='text-xl'>You have No Item in your pantry</p>]);
            }
        } catch (error) {
            setMessages([<p>Error: Something Fucked Up</p>]);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseApiResponse = (text: string) => {
        const lines = text.split('\n');

        return lines.map((line, index) => {
            if (line.startsWith('* ')) {
                return <li key={index}>{formatBold(line.substring(2))}</li>;
            } else if (line.startsWith('\t* ')) {
                return <li key={index} style={{ marginLeft: '20px' }}>{formatBold(line.substring(3))}</li>;
            } else {
                return <p key={index}>{formatBold(line)}</p>;
            }
        });
    };

    const formatBold = (text: string) => {
        const parts = text.split('**');
        return parts.map((part, index) =>
            index % 2 === 0 ? part : <strong key={index}>{part}</strong>
        );
    };

    return (
        <Root className='bg-transparent w-full'>
            <CssBaseline />
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: `calc(90% - ${drawerBleeding}px)`,
                        overflow: 'visible',
                    },
                }}
            />
            <div style={{ border: '2px solid gray', borderRadius: '50%', display: 'inline-block' }}>
                <IconButton onClick={toggleDrawer(true)}>
                    <AutoAwesome color="primary" />
                </IconButton>
            </div>
            <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                disableBackdropTransition={true}
                disableEscapeKeyDown={true}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <StyledBox
                    sx={{
                        position: 'absolute',
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                    }}
                    className='justify-center items-center text-center'
                >
                    <Puller />
                    <Typography sx={{ p: 2, color: 'text.primary', fontWeight:"bold", fontFamily:"fantasy" }} variant='h6'>Find Some Good Recipes</Typography>
                </StyledBox>
                <StyledBox
                    sx={{
                        px: 1,
                        pb: 1,
                        height: '100%',
                        overflow: 'auto',
                    }}
                >
                    <Box height="100%" width="100%" 
                        sx={{
                            display:"flex", 
                            justifyContent: "center", 
                            alignItems: (messages.length > 0) ? "flex-start" : "center", 
                            flexDirection:"column", 
                            backgroundColor: "rgb(243,243,243)", 
                            overflow: "auto"
                        }}
                    >
                        {loading ? (
                            <div className='w-full'>
                                <Skeleton />
                                <Typography variant="h1">{loading ? <Skeleton /> : 'h1'}</Typography>
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation={false} />
                            </div>
                        ) : messages.length > 0 ? (
                            <div className='pt-5'>
                                {messages.map((message, index) => (
                                    <ChatMessage className='text-lg' key={index}>{message}</ChatMessage>
                                ))}
                            </div>
                        ) : (
                            <AnimatedRainbowButton onClick={handleButtonClick}>
                                <AutoAwesome className='text-white p-0' />
                                <span className='ml-2'>Do your Magic</span>
                            </AnimatedRainbowButton>
                        )}
                    </Box>
                </StyledBox>
            </SwipeableDrawer>
        </Root>
    );
}