import React from 'react';
import PantryManager from '@/components/PantryManager';

const Home = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-2  md:p-24 gap-y-7">
            <h1>Pantry Management</h1>
            <PantryManager />
        </main>
    );
};

export default Home;
