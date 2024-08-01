import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'react-camera-pro';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, TextField } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { useAlert } from '@/context';
import { collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

const CameraComponent = ({ refreshItems }) => {
    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [cameraSupported, setCameraSupported] = useState(true);
    const { user } = useAuth();
    const alert = useAlert();
    const [apiKey, setApiKey] = useState("")

    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            console.log("Camera API is not supported in this browser");
            setCameraSupported(false);
            alert.error("Camera is not supported on this device or browser");
        }
    }, []);

    const takePhoto = () => {
        if (camera.current) {
            const photo = camera.current.takePhoto();
            setImage(photo);
            setOpenModal(true);
        }
    };

    const handleCancel = () => {
        setOpenModal(false);
        setImage(null);
    };

    const handleAdd = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/imageRecognition", {
                method: "POST",
                body: JSON.stringify({
                    messages:
                        [
                            {
                                role: "system",
                                content: [
                                    {
                                        type: "text",
                                        text: "You are a pantry item predictor that can predict an item I am holding in my hand in the image. Return only the name of the item that I am holding in the image. If it is not a pantry item, then reply 'false' as an answer.",
                                    },
                                ],
                            },
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: image,
                                        },
                                    },
                                ],
                            },
                        ],
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': apiKey
                }
            })

            
            const result = (await response.json()).data
            if (result !== "false") {
                const pantryRef = collection(db, `users/${user.uid}/pantry`);
                const q = query(pantryRef, where("name", "==", result));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    await addDoc(pantryRef, {
                        name: result,
                        quantity: 1
                    });
                    alert.success(`${result} added to your pantry list`);
                } else {
                    const docRef = querySnapshot.docs[0].ref;
                    await updateDoc(docRef, {
                        quantity: querySnapshot.docs[0].data().quantity + 1
                    });
                    alert.success(`${result} quantity updated in your pantry list`);
                }
                refreshItems();
            } else {
                alert.error(`This item can't be added to your pantry list`)
            }
        } catch (error) {
            console.error(error)
            alert.error(error)
        } finally {
            setOpenModal(false);
            setLoading(false);
            setImage(null);
            setApiKey("")
        }
    };

    useEffect(() => {
        console.log(apiKey)
    }, [apiKey])

    return (
        <Box className="flex flex-col items-center">
            {cameraSupported ? (
                <>
                    <Box className="border-2 border-gray-300" sx={{ width: '320px', height: '240px' }}>
                        <Camera
                            facingMode="environment"
                            ref={camera}
                            aspectRatio={4 / 3}
                            numberOfCamerasCallback={(numberOfCameras) => console.log('Number of cameras detected:', numberOfCameras)}
                        />
                    </Box>
                    <Button onClick={takePhoto} variant="contained" color="primary" className="mt-4">
                        Take Photo
                    </Button>
                </>
            ) : (
                <p className='text-red-600'>
                    Camera is not supported on this device or browser. Please try using a different device or updating your browser.
                </p>
            )}

            <Dialog
                open={openModal}
                onClose={!loading ? handleCancel : undefined}
                disableBackdropClick={loading}
                disableEscapeKeyDown={loading}
            >
                <DialogTitle>Photo Taken</DialogTitle>
                <DialogContent className='flex flex-col justify-center items-center'>
                    <DialogContentText>
                        Review the photo. Click "Add" to save the item or "Cancel" to discard.
                    </DialogContentText>
                    <TextField
                        required
                        label="Enter Your OpenAI API Key"
                        variant="outlined"
                        className='mt-10'
                        onChange={(e) => { setApiKey(e.target.value) }}
                    />
                    {image && <img src={image} alt="Taken photo" style={{ width: '100%', marginTop: '10px' }} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} disabled={loading} startIcon={<Cancel />}>
                        Cancel
                    </Button>
                    <Button type='submit' onClick={handleAdd} variant="contained" color="primary" disabled={loading || !apiKey}>
                        {loading ? <CircularProgress size={24} /> : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CameraComponent;