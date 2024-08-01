import { useState } from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Box, IconButton, Skeleton, Avatar, Menu, MenuItem, Button, Tooltip, TextField } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import AnimatedRainbowButton from './RainbowButton';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signInWithGoogle } from '@/lib/auth';

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
    const [apiKey, setApiKey] = useState("")
    const { user } = useAuth();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await signOut(auth);
        setAnchorEl(null);
    };

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
        if (!newOpen) {
            setMessages([]);
        }
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    const handleButtonClick = async () => {
        setLoading(true);
        try {
            if (user) {
                const querySnapshot = await getDocs(collection(db, `users/${user.uid}/pantry`));
                const items = querySnapshot.docs.map(doc => `${doc.data().name}, quantity: ${doc.data().quantity}`).join("; ");

                if (items !== "") {
                    const response = await fetch("/api/getRecipe", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": apiKey
                        },
                        body: JSON.stringify({
                            items: items
                        })
                    }).then(res => res.json())

                    setMessages(parseApiResponse(response.data));
                } else {
                    setMessages([<p className='text-xl'>You have No Item in your pantry</p>]);
                }
            }
        } catch (error) {
            setMessages([<p>Error: Something Went Wrong</p>]);
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
            <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }} className='justify-between '>
                <div style={{ border: '2px solid gray', borderRadius: '50%', }}>
                    <Tooltip title={user ? "Find Some Great Recipes" : "Sign In to get Recipes"}>
                        <IconButton onClick={toggleDrawer(true)} disabled={!user}>
                            <AutoAwesome color="primary" />
                        </IconButton>
                    </Tooltip>
                </div>
                {user ? (
                    <>
                        <Avatar
                            alt={user.displayName || "User"}
                            src={user.photoURL || ""}
                            onClick={handleMenuClick}
                            style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                        />
                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button onClick={() => { signInWithGoogle() }} variant='contained'>Sign In</Button>
                )}
            </div>
            <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={!user}
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
                    <Typography sx={{ p: 2, color: 'text.primary', fontWeight: "bold", fontFamily: "fantasy" }} variant='h6'>Find Some Good Recipes</Typography>
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
                            display: "flex",
                            justifyContent: "center",
                            alignItems: (messages.length > 0) ? "flex-start" : "center",
                            flexDirection: "column",
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
                            <>
                                <TextField
                                    required
                                    label="Enter Your OpenRouter API Key"
                                    variant="outlined"
                                    className='mb-10 w-64'
                                    onChange={(e) => { setApiKey(e.target.value) }}
                                />
                                <AnimatedRainbowButton onClick={handleButtonClick} disabled={!apiKey}>
                                    <AutoAwesome className='text-white p-0' />
                                    <span className='ml-2'>Do your Magic</span>
                                </AnimatedRainbowButton>
                            </>
                        )}
                    </Box>
                </StyledBox>
            </SwipeableDrawer>
        </Root>
    );
}