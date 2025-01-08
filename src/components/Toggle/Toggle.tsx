import React, { useEffect, useState } from 'react';
import { Switch, FormControlLabel, Box } from '@mui/material';

interface ToggleProps {
    name: string;
    path: string;
}

interface ToggleData {
    value: string;
    defaultValue: boolean;
}

const Toggle = ({ name, path }: ToggleProps) => {
    const [toggleData, setToggleData] = useState<ToggleData | null>(null);

    const fetchData = async () => {
        try {
            const response = await fetch(`${path}/${name}`);
            const data = await response.json();
            
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
    }, [name, path]);

    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;

        try {
            const response = await fetch(`${path}/${name}/${checked ? 1 : 0}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
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