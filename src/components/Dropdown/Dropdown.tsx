import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface DropdownProps {
    controlId: number;
}

interface DropdownData {
    name: string;
    options: string[];
    defaultValue: string;
}

const DropdownComponent: React.FC<DropdownProps> = ({ controlId }) => {
    const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);
    const [selectedValue, setSelectedValue] = useState<string>('');

    // Function to fetch dropdown data from the API
    const fetchDropdownData = async () => {
        try {
            const response = await fetch(`/api/v2/root/${controlId}`);
            const data = await response.json();

            const formattedData: DropdownData = {
                name: data.name ? data.name : 'Select a source',
                options: data.sources,
                defaultValue: data.source,
            };

            setDropdownData(formattedData);
            setSelectedValue(formattedData.defaultValue);
        } catch (error) {
            console.error('Failed to fetch dropdown data:', error);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, [controlId]);

    const handleChange = async (event: any) => {
        const value = event.target.value;
        setSelectedValue(value);

        try {
            const response = await fetch(`/api/v2/root/${controlId}/${value}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Failed to update dropdown:', error);
        }
    };

    if (!dropdownData) return null;

    return (
        <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{dropdownData.name}</InputLabel>
            <Select
                value={selectedValue}
                label={dropdownData.name}
                onChange={handleChange}
            >
                {dropdownData.options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default DropdownComponent; 