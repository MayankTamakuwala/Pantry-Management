import React from 'react';
import PantryManager from '@/components/PantryManager';
import SwipeableEdgeDrawer from '@/components/Drawer';
import LandingPage from '@/components/LandingPage';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
    const { user } = useAuth()
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-2  md:p-24 gap-y-7">
            <SwipeableEdgeDrawer />
            {!user ? (<>
                <LandingPage />
            </>) : (
                <>
                    <h1>Pantry Management</h1>
                    <PantryManager />
                </>
            )}
        </main>
    );
};

export default Home;
