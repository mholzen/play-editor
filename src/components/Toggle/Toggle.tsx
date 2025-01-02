import React, { useEffect, useState } from 'react';
import { Switch, FormControlLabel, Box } from '@mui/material';

interface ToggleProps {
    controlId: number;
    name: string;
    defaultValue: boolean;
}

const Toggle = ({ controlId, name, defaultValue }: ToggleProps) => {
    const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;

        try {
            const response = await fetch(`/api/v2/root/${controlId}/${name}/${checked ? 1 : 0}`, {
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

    return (
        <FormControlLabel
            control={
                <Switch
                    defaultChecked={defaultValue}
                    onChange={onChange}
                />
            }
            label={name}
        />
    );
};

export default Toggle; 