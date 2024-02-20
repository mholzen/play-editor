import React, { useEffect, useState } from 'react';
import { Box, Grid, Slider, Stack } from '@mui/material';

interface SliderData {
  name: string;
  defaultValue: number;
  step: number;
  min: number;
  max: number;
}
const SlidersComponent = () => {
  const [slidersData, setSlidersData] = useState<SliderData[]>([]);

  // Function to fetch sliders data from the API
  const fetchSlidersData = async () => {
    try {
      const response = await fetch('/controls/');
      const data = await response.json();

      let sliders: SliderData[] = data.map((item: any, i: number): SliderData => {
        let res: SliderData = {
          name: item.Channel,
          defaultValue: item.Value,
          step: 1,
          min: 0,
          max: 255,
        };
        return res;
      });

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
      const response = await fetch(`/controls/${name}/${value}`, {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // body: JSON.stringify(value),
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
              <Box sx={{ width: 100 }}>
                {slider.name}
              </Box>
            </th>
          ))}
        </tr>
        <tr>
          {slidersData.map((slider, index) => (
            <td>
              <Box sx={{ height: 300 }}>
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
