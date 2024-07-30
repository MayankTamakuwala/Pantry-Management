import React, { useState, ChangeEvent } from 'react';
import { TextField } from '@mui/material';

interface PantrySearchProps {
    onSearch: (query: string) => void;
    className?: string;
}

const PantrySearch: React.FC<PantrySearchProps> = ({ onSearch, className }) => {
    const [query, setQuery] = useState<string>('');

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <TextField
            label="Search Pantry"
            value={query}
            onChange={handleSearch}
            fullWidth
            className={className}
        />
    );
};

export default PantrySearch;