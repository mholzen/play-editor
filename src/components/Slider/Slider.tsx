import React from 'react';
import { Box, Slider, Typography } from '@mui/material';

interface SliderProps {
  name: string;
  path: string;
  defaultValue: number;
  step: number;
  min: number;
  max: number;
  onChange: (event: any) => void;
}

const SingleSlider = ({ 
  name, 
  path,
  defaultValue, 
  step, 
  min, 
  max, 
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
          marks
          min={min ? min : 0}
          max={max ? max : 255}
        />
      </Box>
    </div>
  );
};

export default SingleSlider; 