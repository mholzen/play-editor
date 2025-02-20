import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Dropdown, { DropdownProps } from '../Dropdown/Dropdown';
import Toggle, { ToggleProps } from '../Toggle/Toggle';
import SingleSlider, { SingleSliderProps } from '../Slider/Slider';
import { apiGet, apiPost } from '../../config/api';

interface ContainerProps {
  url: string;
}

interface Item {
  name: string;
  type: string; // if we can't determine the type, we're probably not going to be able to render it
  item: any;
}

const determineType = (item: any): string => {
  if (Array.isArray(item)) {
    return 'container';
  }
  if (typeof item === 'boolean') {
    return 'toggle';
  }
  if (typeof item === 'number') {
    return 'slider';
  }
  if (typeof item === 'string') {
    if (!isNaN(Number(item))) {
      return 'slider';
    } else {
      return 'dropdown';
    }
  }

  if (typeof item === 'object') {
    if ('type' in item) {
      return item.type; // the object tells us what type it is
    }
    if (typeof item.value === 'boolean') {
      return 'toggle';
    }
    if (typeof item.value === 'number') {
      return 'slider';
    }
    if (typeof item.value === 'string') {
      return 'dropdown';
    }

    if ('max' in item && 'min' in item) {
      return 'slider';
    }
    if ('marks' in item) {
      return 'slider';
    }
    if ('sources' in item) {
      return 'dropdown';
    }
  }
  return "dropdown"; // default is to display a list of options
};

const getName = (item: any, index: number) => {
  if (typeof item === 'object' && typeof item.name === 'string') {
    return item.name;
  }
  return `${index}`;
}

const Container: React.FC<ContainerProps> = ({ url }) => {
  const [items, setItems] = useState<Item[]>([]);

  const fetchContainerData = async () => {
    try {
      const data = await apiGet(url);
      
      if (Array.isArray(data)) {
        const processedItems = data.map((item, index) => {
          return {
            name: getName(item, index),
            type: determineType(item),
            item: item,
          }
        });
        setItems(processedItems);
      } else {
        const processedItems = Object.entries(data).map(([key, value], index) => {
          let results = {
            name: key,
            type: determineType(value),
            item: value,
          };
          // if (typeof value == 'object') {
          //   results = Object.assign(results, value);
          // }
          return results;
        });
        setItems(processedItems);
      }
    } catch (error) {
      console.error('Failed to fetch container data:', error);
    }
  };

  useEffect(() => {
    fetchContainerData();
  }, [url]);

  const renderItem = (item: Item) => {
    const childUrl = `${url}/${item.name}`;

    switch (item.type) {
      case 'slider':
        let sliderProps : SingleSliderProps = item.item;
        sliderProps.url = childUrl;
        return <SingleSlider {...sliderProps} />;
      case 'dropdown':
        let dropdownProps : DropdownProps = item.item;
        dropdownProps.url = childUrl;
        return <Dropdown {...dropdownProps} />;
      case 'toggle':
        let toggleProps : ToggleProps;
        console.log("toggle", item.item);
        if (typeof item.item === 'boolean') {
          toggleProps = {
            url: childUrl,
            defaultValue: item.item,
          };
        } else if (typeof item.item === 'object') {
          toggleProps = item.item
        } else {
          throw new Error("unknown type " + item.type);
        }
        toggleProps.url = childUrl;
        return <Toggle {...toggleProps} />;
      case 'container':
        return <Container url={childUrl} />;
      default:
        return "unknown type " + item.type;
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
                {renderItem(item)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Container; 