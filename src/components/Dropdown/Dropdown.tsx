import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { apiGet, apiPost } from '../../config/api';

interface DropdownProps {
    url: string;
    name: string;
    options: string[];
    defaultValue: string;
}

interface DropdownData {
    value: string;
}

const Dropdown: React.FC<DropdownProps> = ({ url, name, options, defaultValue }) => {
    const [selectedValue, setSelectedValue] = useState<string>('');

    const fetchDropdownData = async () => {
        try {
            const data = await apiGet(`${url}`);
            const value = data.value;
            // const formattedData: DropdownData = {
            //     name: data.name ? data.name : 'Select a source',
            //     options: data.sources,
            //     defaultValue: data.source,
            // };
            // setDropdownData(formattedData);
            setSelectedValue(value);
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

    return (
        <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{name}</InputLabel>
            <Select
                value={selectedValue}
                label={name}
                onChange={handleChange}
            >
                {options && options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default Dropdown; 
export type { DropdownProps };