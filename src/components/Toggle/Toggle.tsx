import React, { useEffect, useState } from 'react';
import { Switch, FormControlLabel, Box } from '@mui/material';
import { apiGet, apiPost } from '../../config/api';

interface ToggleProps {
    url: string;
    defaultValue: boolean;
}

interface ToggleData {
    value: boolean;
}

const Toggle = ({ url, defaultValue }: ToggleProps) => {
    const [toggleData, setToggleData] = useState<boolean>(defaultValue);

    const fetchData = async () => {
        try {
            const data = await apiGet(`${url}`);
            if (typeof data == 'boolean') {
                setToggleData(data);
              } else if (typeof data == 'object' && typeof data.value == 'boolean') {
                  setToggleData(data.value);
              } else {
                console.error('Failed to fetch slider data:', data);
              }
        } catch (error) {
            console.error('Failed to fetch toggle data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    const onChange = async (event: any) => {
        apiPost(`${url}`, event.target.value);
        setToggleData(event.target.value);
      }

    return (
        <Switch
            defaultChecked={defaultValue}
            onChange={onChange}
        />
    );
};

export default Toggle; 
export type { ToggleProps };