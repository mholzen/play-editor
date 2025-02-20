import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toggle from './Toggle';
import { apiGet, apiPost } from '../../config/api';

// Mock the API functions
jest.mock('../../config/api');
const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

describe('Toggle Component', () => {
  const mockToggleData = {
    value: true,
    defaultValue: true
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockedApiGet.mockResolvedValue(mockToggleData);
    mockedApiPost.mockResolvedValue({ success: true });
  });

  it('renders toggle with fetched data', async () => {
    render(<Toggle url="/api/test" defaultValue={true} />);
    
    // Wait for the toggle to be loaded
    await waitFor(() => {
      expect(screen.getByLabelText('foo')).toBeInTheDocument();
    });

    // Check if the toggle is checked by default
    const toggle = screen.getByRole('checkbox') as HTMLInputElement;
    expect(toggle.checked).toBe(true);
  });

  it('handles toggle change', async () => {
    render(<Toggle url="/api/test" defaultValue={true} />);

    // Wait for the toggle to be loaded
    await waitFor(() => {
      expect(screen.getByLabelText('Test Toggle')).toBeInTheDocument();
    });

    // Simulate toggling the switch
    const toggle = screen.getByRole('checkbox');
    fireEvent.click(toggle);

    // Verify that apiPost was called with the correct value
    expect(mockedApiPost).toHaveBeenCalledWith('/api/test/0');
  });

  it('handles API error gracefully', async () => {
    // Mock API error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockedApiGet.mockRejectedValue(new Error('API Error'));

    render(<Toggle url="/api/test" defaultValue={true} />);

    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
}); 