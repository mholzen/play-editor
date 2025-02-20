import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SingleSlider from './Slider';

describe('SingleSlider Component', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    url: 'http://localhost:3000/slider',
    defaultValue: 50,
    step: 1,
    min: 0,
    max: 100,
    marks: [
      { value: 0, label: 'Min' },
      { value: 50, label: 'Mid' },
      { value: 100, label: 'Max' }
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders slider with correct props', () => {
    render(<SingleSlider {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders with default min and max when not provided', () => {
    const propsWithoutMinMax = {
      ...defaultProps,
      min: undefined,
      max: undefined
    };
    
    render(<SingleSlider {...propsWithoutMinMax} />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '255');
  });

  it('calls onChange handler when value changes', () => {
    render(<SingleSlider {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 75 } });
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('renders with marks when provided', () => {
    render(<SingleSlider {...defaultProps} />);
    
    // Check if marks are rendered
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Mid')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
  });
}); 