import React, { useEffect, useState } from 'react';
import { Switch, FormControlLabel, Box } from '@mui/material';
import { apiGet, apiPost } from '../../config/api';

interface ToggleProps {
    url: string;
    name?: string;
}

interface ToggleData {
    value: boolean;
    defaultValue: boolean;
}

const Toggle = ({ url, name }: ToggleProps) => {
    const [toggleData, setToggleData] = useState<ToggleData | null>(null);

    const fetchData = async () => {
        try {
            const data = await apiGet(`${url}`);
            
            setToggleData({
                value: data.value,
                defaultValue: data.defaultValue
            });
        } catch (error) {
            console.error('Failed to fetch toggle data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;

        try {
            const result = await apiPost(`${url}/${checked ? 1 : 0}`);
            console.log(result);
        } catch (error) {
            console.error('Failed to update toggle:', error);
        }
    };

    if (!toggleData) return null;

    return (
        <FormControlLabel
            control={
                <Switch
                    defaultChecked={toggleData.defaultValue}
                    onChange={onChange}
                />
            }
            label={name}
        />
    );
};

export default Toggle; 