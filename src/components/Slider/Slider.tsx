import React from 'react';
import { Box, Slider, Typography } from '@mui/material';

interface SliderProps {
  name: string;
  defaultValue?: number;
  step?: number;
  min?: number;
  max?: number;
  marks?: { value: number; label: string }[];
  onChange: (event: any) => void;
}

const SingleSlider = ({ 
  name, 
  defaultValue, 
  step, 
  min, 
  max,
  marks,
  onChange 
}: SliderProps) => {
  return (
    <div>
      <Box sx={{ height: 200 }}>
        <Slider
          orientation="vertical"
          defaultValue={defaultValue}
          onChange={onChange}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
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