import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Dropdown from '../Dropdown/Dropdown';
import Toggle from '../Toggle/Toggle';
import SingleSlider from '../Slider/Slider';
import { apiGet, apiPost } from '../../config/api';

interface ContainerProps {
  url: string;
}

interface ContainerData {
  type: string;
  name: string;
  value: any;
}

const determineType = (item: any): string => {
  if (Array.isArray(item)) {
    return 'container';
  }
  if (typeof item === 'boolean' || (typeof item === 'object' && 'type' in item && item.type === 'toggle')) {
    return 'toggle';
  }
  if (typeof item === 'number' || (typeof item === 'object' && 'type' in item && item.type === 'slider')) {
    return 'slider';
  }
  if (typeof item === 'object') {
    if ('type' in item) {
      return item.type; // the object tells us what type it is
    }
    if ('max' in item && 'min' in item) {
      return 'slider';
    }
    if ('value' in item && typeof item.value === 'number') {
      return 'slider';
    }
    if ('sources' in item) {
      return 'dropdown';
    }
  }
  if (typeof item === 'string' && !isNaN(Number(item))) {
    return 'slider';
  }
  console.log("dropdown?", item);
  return 'dropdown';
};

const Container: React.FC<ContainerProps> = ({ url }) => {
  const [items, setItems] = useState<ContainerData[]>([]);

  const fetchContainerData = async () => {
    try {
      const data = await apiGet(url);
      
      if (Array.isArray(data)) {
        const processedItems = data.map((item, index) => ({
          type: determineType(item),
          name: item.name,
          value: item.value
        }));
        setItems(processedItems);
      } else {
        // If data is an object, process each key-value pair
        const processedItems = Object.entries(data).map(([key, value], index) => ({
          type: determineType(value),
          name: key,
          value: value
        }));
        setItems(processedItems);
      }
    } catch (error) {
      console.error('Failed to fetch container data:', error);
    }
  };

  const onChange = (itemName: string) => async (event: any) => {
    const { value } = event.target;

    try {
      const result = await apiPost(`${url}/${itemName}`, value);
    } catch (error) {
      console.error('Failed to update slider:', error);
    };
  };

  useEffect(() => {
    fetchContainerData();
  }, [url]);

  const renderComponent = (itemType: string, item: ContainerData) => {
    const childUrl = `${url}/${item.name}`;
    
    switch (itemType) {
      case 'slider':
        return <SingleSlider {...item} onChange={onChange(item.name)} />;
      case 'dropdown':
        return <Dropdown url={childUrl} />;
      case 'toggle':
        return <Toggle url={childUrl} />;
      case 'container':
        return <Container url={childUrl} />;
      default:
        return "unknown type " + itemType;
        // panic
        console.log("panic", item);
        return null;
    }
  };

  if (!items) {
    return null;
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            {items.map((item, index) => (
              <th key={index}>
                <Box sx={{ width: 50 }}>
                  <Typography>
                    {item.name}
                  </Typography>
                </Box>
              </th>
            ))}
          </tr>
          <tr>
            {items.map((item, index) => (
              <td key={index}>
                {renderComponent(determineType(item), item)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Container; 