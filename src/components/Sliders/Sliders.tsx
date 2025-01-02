import React, { useEffect, useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';

interface SliderData {
  name: string;
  defaultValue: number;
  step: number;
  min: number;
  max: number;
}

const DEFAULT_SLIDER_CONFIG = {
  step: 1,
  min: 0,
  max: 255
};

const parseItem = (item: any, name: string): SliderData => {
  if (typeof item === 'number') {
    return {
      name: name,
      defaultValue: item,
      ...DEFAULT_SLIDER_CONFIG
    };
  }
  return {
    name: name,
    defaultValue: item.Value,
    min: item.Min ? item.Min : DEFAULT_SLIDER_CONFIG.min,
    max: item.Max ? item.Max : DEFAULT_SLIDER_CONFIG.max,
    step: item.Step ? item.Step : DEFAULT_SLIDER_CONFIG.step,
  };
};

const parseResponse = (data: any): SliderData[] => {
  if (!Array.isArray(data)) {
    return Object.keys(data)
      .sort()
      .map((key, index) => parseItem(data[key], key));
  }

  return data.map((item: any, index: number): SliderData => parseItem(item, data[index].Channel));
};

const SlidersComponent = ({ controlId }: { controlId: number }) => {
  const [slidersData, setSlidersData] = useState<SliderData[]>([]);

  const fetchSlidersData = async () => {
    try {
      const response = await fetch(`/api/v2/root/${controlId}`);
      const data = await response.json();
      let sliders: SliderData[] = parseResponse(data);
      setSlidersData(sliders);
    } catch (error) {
      console.error('Failed to fetch sliders data:', error);
    }
  };

  // useEffect to call fetchSlidersData on component mount
  useEffect(() => {
    fetchSlidersData();
  }, []);

  const onChange = (name: string) => async (event: any) => {
    const { value } = event.target; // value of the slider
    console.log(event);
    // const name = event.currentTarget.getAttribute('data-name')

    try {
      const response = await fetch(`/api/v2/root/${controlId}/${name}/${value}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json(); // Assuming the server responds with JSON
      console.log(result); // Handle the response data as needed
    } catch (error) {
      console.error('Failed to update slider:', error);
    };
  };

  return (
    <div>
      <table>
        <tr>
          {slidersData.map((slider, index) => (
            <th>
              <Box sx={{ width: 50 }}>
                <Typography>
                  {slider.name}
                </Typography>
              </Box>
            </th>
          ))}
        </tr>
        <tr>
          {slidersData.map((slider, index) => (
            <td>
              <Box sx={{ height: 200 }}>
                <Slider
                  orientation="vertical"
                  defaultValue={slider.defaultValue}
                  onChange={onChange(slider.name)}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={slider.step}
                  marks
                  min={slider.min}
                  max={slider.max}
                />
              </Box>
            </td>
          ))}
        </tr>
      </table>
    </div>
  );
};

export default SlidersComponent;
