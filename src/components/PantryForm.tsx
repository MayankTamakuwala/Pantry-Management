import React, { useState, ChangeEvent, FormEvent, ReactElement, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface PantryItem {
    id?: string;
    name: string;
    quantity: number;
}

interface PantryFormProps {
    className?: string;
    children?: ReactElement | null;
    refreshItems: () => void;
}

const PantryForm: React.FC<PantryFormProps> = ({ className, children, refreshItems }) => {
    const [item, setItem] = useState<PantryItem>({ name: '', quantity: 0 });
    const { user } = useAuth()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        if(user){
            e.preventDefault();
            await addDoc(collection(db, `users/${user.uid}/pantry`), item);
            setItem({ name: '', quantity: 0 });
            refreshItems();
        }
    };

    return (
        <form onSubmit={handleSubmit} className={className + ' flex-wrap gap-4'}>
            <TextField
                label="Item Name"
                name="name"
                value={item.name}
                onChange={handleChange}
                required
            />
            <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0} }}
                required
            />
            <Button type="submit" variant="contained" color="primary">
                Add Item
            </Button>
            {children}
        </form>
    );
};

export default PantryForm;