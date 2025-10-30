import { createTheme } from '@mui/material/styles';

/**
 * T-Rex Material UI Theme
 * Combines Material Design principles with Apple's clean, minimal aesthetic
 * 
 * Design Philosophy:
 * - Clean, spacious layouts with generous white space
 * - Subtle shadows and elevation for depth
 * - Smooth animations and transitions
 * - Apple-inspired color palette
 * - System fonts for optimal readability
 */

const tRexTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Material Design blue - professional and modern
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#333333', // Professional dark gray
      light: '#666666',
      dark: '#212121',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50', // Clean green
      light: '#81C784',
      dark: '#388E3C',
    },
    error: {
      main: '#f44336', // Standard red
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ff9800', // Orange warning
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3', // Clean blue
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#ffffff', // Clean white background
      paper: '#ffffff',
    },
    text: {
      primary: '#333333', // Professional dark gray text
      secondary: '#666666', // Lighter gray
      disabled: '#cccccc',
    },
    divider: 'rgba(0, 0, 0, 0.08)', // Subtle divider
  },

  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    
    h1: {
      fontSize: '2rem', // 32px
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#212121',
    },
    h2: {
      fontSize: '1.75rem', // 28px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: '#212121',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
      color: '#212121',
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#212121',
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#212121',
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#212121',
    },
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#212121',
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#757575',
    },
    button: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02em',
      textTransform: 'none', // No uppercase, Apple-style
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.66,
      color: '#757575',
    },
    overline: {
      fontSize: '0.625rem', // 10px
      fontWeight: 600,
      lineHeight: 2.66,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#757575',
    },
  },

  shape: {
    borderRadius: 12, // Soft, rounded corners (Apple-style)
  },

  spacing: 8, // Base spacing unit

  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.08)', // Elevation 1 - subtle
    '0 2px 6px rgba(0, 0, 0, 0.08)', // Elevation 2
    '0 4px 12px rgba(0, 0, 0, 0.08)', // Elevation 3
    '0 8px 24px rgba(0, 0, 0, 0.12)', // Elevation 4
    '0 12px 32px rgba(0, 0, 0, 0.12)', // Elevation 5
    '0 16px 40px rgba(0, 0, 0, 0.14)', // Elevation 6
    '0 20px 48px rgba(0, 0, 0, 0.14)', // Elevation 7
    '0 24px 56px rgba(0, 0, 0, 0.16)', // Elevation 8
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 9
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 10
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 11
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 12
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 13
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 14
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 15
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 16
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 17
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 18
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 19
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 20
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 21
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 22
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 23
    '0 2px 4px rgba(0,0,0,0.08)', // Elevation 24
  ],

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24, // More rounded for that iOS feel
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600, // Bolder like the image
          textTransform: 'none',
          boxShadow: 'none',
          minHeight: 48, // Touch-friendly
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          },
        },
        containedPrimary: {
          background: '#1976d2',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          '&:hover': {
            background: '#1565c0',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          '&:disabled': {
            background: 'rgba(25, 118, 210, 0.3)',
            color: 'rgba(255, 255, 255, 0.6)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        },
        sizeLarge: {
          padding: '14px 28px',
          fontSize: '1.125rem',
          minHeight: 56,
          borderRadius: 28, // More rounded for large buttons
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.875rem',
          minHeight: 36,
          borderRadius: 18,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
          '&.MuiListItem-button:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            transform: 'translateX(4px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            transform: 'translateX(4px)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
            '& fieldset': {
              borderColor: '#e0e0e0',
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
              borderWidth: '2px',
              boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.1)',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '1rem',
            padding: '16px 14px',
            height: 'auto',
            minHeight: 24,
          },
        },
      },
      defaultProps: {
        variant: 'outlined',
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          height: 32,
          fontSize: '0.875rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        clickable: {
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
        },
        bar: {
          borderRadius: 4,
          backgroundColor: '#1976d2',
        },
      },
    },

    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '24px 0',
        },
      },
    },

    MuiStep: {
      styleOverrides: {
        root: {
          '& .MuiStepLabel-label': {
            fontSize: '1rem',
            fontWeight: 500,
            marginTop: 8,
            '&.Mui-active': {
              color: '#1976d2',
              fontWeight: 600,
            },
            '&.Mui-completed': {
              color: '#34C759',
            },
          },
        },
      },
    },

    MuiStepIcon: {
      styleOverrides: {
        root: {
          fontSize: '2rem',
          '&.Mui-active': {
            color: '#1976d2',
          },
          '&.Mui-completed': {
            color: '#34C759',
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: 8,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          fontWeight: 600,
          padding: '24px 24px 16px',
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '8px 24px',
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          gap: 12,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 16px',
          fontSize: '0.875rem',
        },
        standardSuccess: {
          backgroundColor: 'rgba(52, 199, 89, 0.1)',
          color: '#248A3D',
          '& .MuiAlert-icon': {
            color: '#34C759',
          },
        },
        standardError: {
          backgroundColor: 'rgba(255, 59, 48, 0.1)',
          color: '#D70015',
          '& .MuiAlert-icon': {
            color: '#FF3B30',
          },
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 149, 0, 0.1)',
          color: '#C93400',
          '& .MuiAlert-icon': {
            color: '#FF9500',
          },
        },
        standardInfo: {
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          color: '#0051D5',
          '& .MuiAlert-icon': {
            color: '#1976d2',
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(97, 97, 97, 0.92)',
          backdropFilter: 'blur(20px)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.875rem',
          fontWeight: 400,
        },
        arrow: {
          color: 'rgba(97, 97, 97, 0.92)',
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 51,
          height: 31,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            '& + .MuiSwitch-track': {
              backgroundColor: '#34C759',
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 27,
          height: 27,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
        track: {
          borderRadius: 16,
          backgroundColor: '#e0e0e0',
          opacity: 1,
        },
      },
    },
  },

  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

export default tRexTheme;
