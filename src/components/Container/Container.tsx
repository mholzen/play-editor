import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Slider from '../Slider/Slider';
import DropdownComponent from '../Dropdown/Dropdown';
import Toggle from '../Toggle/Toggle';

interface ContainerProps {
  name: string;
  path: string;
}

type ItemType = 'slider' | 'dropdown' | 'toggle';

interface ContainerData {
  name: string;
  type: ItemType;
}

const determineType = (data: any): ItemType => {
  if (data.sources) {
    return 'dropdown';
  }
  
  if (typeof data.defaultValue === 'boolean' || typeof data.value === 'boolean' || typeof data === 'boolean') {
    return 'toggle';
  }
  
  return 'slider';
};

const Container: React.FC<ContainerProps> = ({ name, path }) => {
  const [items, setItems] = useState<ContainerData[]>([]);

  const fetchContainerData = async () => {
    try {
      const response = await fetch(`${path}/${name}`);
      const data = await response.json();
      
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

  useEffect(() => {
    fetchContainerData();
  }, [name, path]);

  const renderComponent = (item: ContainerData) => {
    switch (item.type) {
      case 'slider':
        return <Slider name={item.name} path={path} defaultValue={0} step={1} min={0} max={255} onChange={() => {}} />;
      case 'dropdown':
        return <DropdownComponent name={item.name} path={path} />;
      case 'toggle':
        return <Toggle name={item.name} path={path} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <table>
        <tr>
          {items.map((item, index) => (
            <th>
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
            <td>
              {renderComponent(item)}
            </td>
          ))}
        </tr>
      </table>
    </div>
  );
};

export default Container; 