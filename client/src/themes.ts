

// Define the shape of the theme configuration for Ant Design
export interface AppTheme {
  token: {
    colorPrimary: string;
    backgroundColor: string;
    colorText: string;
    // Add any other token properties you need here
  };
}

// Define the light theme
export const lightTheme: AppTheme = {
  token: {
    colorPrimary: '#1890ff',  // Primary color for light theme
    backgroundColor: '#ffffff',
    colorText: '#000000',  // Text color for light theme
  },
};

// Define the dark theme
export const darkTheme: AppTheme = {
  token: {
    colorPrimary: '#ff4d4f',  // Primary color for dark theme
    backgroundColor: '#141414',
    colorText: '#ffffff',  // Text color for dark theme
  },
};