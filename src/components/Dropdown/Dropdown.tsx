import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { apiGet, apiPost } from '../../config/api';

interface DropdownProps {
    url: string;
}

interface DropdownData {
    name: string;
    options: string[];
    defaultValue: string;
}

const Dropdown: React.FC<DropdownProps> = ({ url }) => {
    const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);
    const [selectedValue, setSelectedValue] = useState<string>('');

    // Function to fetch dropdown data from the API
    const fetchDropdownData = async () => {
        try {
            const data = await apiGet(`${url}`);
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
    }, [url]);

    const handleChange = async (event: any) => {
        const value = event.target.value;
        setSelectedValue(value);

        try {
            const result = await apiPost(`${url}`, value);
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

export default Dropdown; 