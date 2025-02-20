import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown from './Dropdown';
import { apiGet, apiPost } from '../../config/api';

// Mock the API functions
jest.mock('../../config/api');
const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

describe('Dropdown Component', () => {
  const mockDropdownData = {
    name: 'Test Dropdown',
    sources: ['Option 1', 'Option 2', 'Option 3'],
    source: 'Option 1'
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockedApiGet.mockResolvedValue(mockDropdownData);
    mockedApiPost.mockResolvedValue({ success: true });
  });

  it('renders dropdown with fetched data', async () => {
    render(<Dropdown url="/api/test" name="source" options={[]} defaultValue={""}/>);
    
    // Wait for the dropdown to be loaded and find the select element
    await waitFor(() => {
      // Look for the button that triggers the select dropdown
      const selectButton = screen.getByRole('button', { name: mockDropdownData.name });
      expect(selectButton).toBeInTheDocument();
    });

    // Check if all options are available in the document
    mockDropdownData.sources.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('handles selection change', async () => {
    render(<Dropdown url="/api/test" name="source" options={[]} defaultValue={""}/>);

    // Wait for the dropdown to be loaded
    await waitFor(() => {
      const selectButton = screen.getByRole('button', { name: mockDropdownData.name });
      expect(selectButton).toBeInTheDocument();
    });

    // Get the select button and click it to open the dropdown
    const selectButton = screen.getByRole('button', { name: mockDropdownData.name });
    fireEvent.mouseDown(selectButton);

    // Find and click the option
    const option = screen.getByText('Option 2');
    fireEvent.click(option);

    // Verify that apiPost was called with the correct value
    expect(mockedApiPost).toHaveBeenCalledWith('/api/test', 'Option 2');
  });

  it('handles API error gracefully', async () => {
    // Mock API error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockedApiGet.mockRejectedValue(new Error('API Error'));

    render(<Dropdown url="/api/test" name="source" options={[]} defaultValue={""}/>);

    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
}); 