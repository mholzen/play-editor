import React, { useState, useEffect } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { apiGet, apiPost } from '../../config/api';

interface SingleSliderProps {
  url: string;
  step?: number;
  min?: number;
  max?: number;
  marks?: { value: number; label: string }[];
}

const SingleSlider = ({ 
  url, 
  step, 
  min, 
  max,
  marks,
}: SingleSliderProps) => {
  const [selectedValue, setSelectedValue] = useState<number>(0);
  const fetchSliderData = async () => {
    try {
        const data = await apiGet(`${url}`);
        if (typeof data == 'number') {
          setSelectedValue(data);
        } else if (typeof data == 'object' && typeof data.value == 'number') {
            setSelectedValue(data.value);
        } else {
          console.error('Failed to fetch slider data:', data);
        }
    } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
    }
};

  const handleChange = async (event: any) => {
    apiPost(`${url}`, event.target.value);
    setSelectedValue(event.target.value);
  }

  let scale: any;
  if (marks) {
    scale = (value: number) => {
      return marks[value];
    }
  }
  // console.log(scale);

  useEffect(() => {
    fetchSliderData();
  }, [url]);

  return (
    <div>
      <Box sx={{ height: 200 }}>
        <Slider        
          value={selectedValue}
          orientation="vertical"
          // defaultValue={defaultValue}
          onChange={handleChange}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          // scale={scale}
          step={step}
          marks={marks}
          min={min ? min : 0}
          max={max ? max : 255}
        />
      </Box>
    </div>
  );
};

export default SingleSlider; 
export type { SingleSliderProps };