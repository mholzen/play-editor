import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Dropdown, { DropdownProps } from '../Dropdown/Dropdown';
import Toggle, { ToggleProps } from '../Toggle/Toggle';
import SingleSlider, { SingleSliderDefaultProps, SingleSliderProps } from '../Slider/Slider';
import { apiGet, apiPost } from '../../config/api';

interface ContainerProps {
  url: string;
}

interface Item {
  // a typed named value
  getName(): string;
  getType(): ControllerType | null;
  value: any;
}

enum ControllerType {
  TOGGLE = 'toggle',
  CHECKBOX = 'checkbox',

  SLIDER = 'slider',
  DROPDOWN = 'dropdown',
  KNOB = 'knob',

  CONTAINER = 'container',
  ROW = 'row',
  COLUMN = 'column'
}


const determineType = (item: any): ControllerType | null => {
  if (Array.isArray(item)) {
    return ControllerType.CONTAINER;
  }
  if (typeof item === 'boolean') {
    return ControllerType.TOGGLE;
  }
  if (typeof item === 'number') {
    return ControllerType.SLIDER;
  }
  if (typeof item === 'string') {
    if (!isNaN(Number(item))) {
      return ControllerType.SLIDER;
    } else {
      return ControllerType.DROPDOWN;
    }
  }

  if (typeof item === 'object') {
    if (item == null) {
      return null;
    }
    if ('type' in item) {
      return item.type; // the object tells us what type it is
    }
    if (typeof item.value === 'boolean') {
      return ControllerType.TOGGLE;
    }
    if (typeof item.value === 'number') {
      return ControllerType.SLIDER;
    }
    if (typeof item.value === 'string') {
      return ControllerType.DROPDOWN;
    }

    if ('max' in item && 'min' in item) {
      return ControllerType.SLIDER;
    }
    if ('marks' in item) {
      return ControllerType.SLIDER;
    }
    if ('sources' in item) {
      return ControllerType.DROPDOWN;
    }
  }
  return ControllerType.CONTAINER; // default is to display a list of options
};

const getName = (item: any, index: number) => {
  // if (Array.isArray(item) && item.length >= 2) {
  //   return item[0]; // first item is the name, second item is the value
  // }
  if (typeof item === 'object' && typeof item.name === 'string') {
    return item.name;
  }
  return `${index}`;
}

const makeArray = (data: any) : Item[] => {
  if (Array.isArray(data)) {
    const results = data.map((item, index) => {
      // is the item just a name/value pair?
      if (typeof item === 'object' && item?.name && item?.value) {
        return {
          value: item.value,
          getName: () => item.name,
          getType: () => determineType(item.value),
        }
      } else {
        return {
          value: item,
          getName: () => item?.channel || String(index),
          getType: () => determineType(item),
        }
      }
    });
    return results;
  }

  return Object.entries(data).map(([key, item], index) => {
    return {
      value: item,
      getName: () => key,
      getType: () => determineType(item),
    }
  })
}

const Container: React.FC<ContainerProps> = ({ url }) => {
  const [items, setItems] = useState<Item[]>([]);

  const fetchContainerData = async (url: string) => {
    try {
      const data = await apiGet(url);
      const processedItems = makeArray(data);
      setItems(processedItems);

      // if (Array.isArray(data)) {
      //   const processedItems = data.map((item, index) => {  // TODO: move to function calls when data is needed
      //     if (Array.isArray(item) && item.length >= 2) {
      //       return {
      //         name: getName(item, index),
      //         type: determineType(item[1]),
      //         item: item[1],
      //       }
      //     } else {
      //       return {
      //         name: getName(item, index),
      //         type: determineType(item),
      //         item: item,
      //       }
      //     }
      //   });
      //   setItems(processedItems);
      // } else {
      //   const processedItems = Object.entries(data).map(([key, value], index) => {
      //     return {
      //       name: key,
      //       type: determineType(value),
      //       item: value,
      //     };
      //   });
      //   setItems(processedItems);
      // }
    } catch (error) {
      console.error('Failed to fetch container data:', error);
    }
  };

  useEffect(() => {
    fetchContainerData(url);
  }, [url]);

  const renderItem = (item: Item) => {
    const childUrl = `${url}/${item.getName()}`;

    switch (item.getType()) {
      case 'slider':
        let sliderProps : SingleSliderProps = new SingleSliderDefaultProps(item.value);
        sliderProps.url = childUrl;
        return <SingleSlider {...sliderProps} />;
      case 'dropdown':
        let dropdownProps : DropdownProps = item.value;
        dropdownProps.url = childUrl;
        dropdownProps.options = item.value.options;
        dropdownProps.defaultValue = item.value.source;
        dropdownProps.name = item.value.name;
        return <Dropdown {...dropdownProps} />;
      case 'toggle':
        let toggleProps : ToggleProps;
        if (typeof item.value === 'boolean') {
          toggleProps = {
            url: childUrl,
            defaultValue: item.value,
          };
        } else if (typeof item.value === 'object') {
          toggleProps = item.value
        } else {
          throw new Error("unknown type " + item.getType());
        }
        toggleProps.url = childUrl;
        return <Toggle {...toggleProps} />;
      case 'container':
        // return <p>{childUrl}</p>;
        return <Container url={childUrl} />;
      default:
        return;
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
                    {item.getName()}
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