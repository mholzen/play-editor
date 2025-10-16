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

export class SingleSliderDefaultProps {
  url: string;
  step?: number;
  min?: number;
  max?: number;
  marks?: { value: number; label: string }[];

  constructor(input: any) {
    this.url = '';
    this.step = 1;
    this.min = 0;
    this.max = 255;
    this.marks = [];

    if (typeof input === 'object') {
      this.url = input.url;
      this.step = input.step;
      this.min = input.min;
      this.max = input.max;
      this.marks = input.marks;
    }
  }
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
    <Box sx={{
      height: 240,
      display: 'flex',
      justifyContent: 'center',
      paddingLeft: marks && marks.length > 0 ? '40px' : '0px',
      paddingRight: '8px',
    }}>
      <Slider
        value={selectedValue}
        orientation="vertical"
        onChange={handleChange}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={step}
        marks={marks}
        min={min ? min : 0}
        max={max ? max : 255}
        sx={{
          '& .MuiSlider-markLabel': {
            fontSize: '0.7rem',
            transform: 'translateX(-100%)',
            left: '-8px !important',
          },
        }}
      />
    </Box>
  );
};

export default SingleSlider;
export type { SingleSliderProps };