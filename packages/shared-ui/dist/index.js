'use strict';

var jsxRuntime = require('react/jsx-runtime');
var material = require('@mui/material');
var react = require('react');
var styles = require('@mui/material/styles');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var Button = function (_a) {
    var loading = _a.loading, children = _a.children, disabled = _a.disabled, sx = _a.sx, props = __rest(_a, ["loading", "children", "disabled", "sx"]);
    var isContained = props.variant === 'contained';
    return (jsxRuntime.jsx(material.Button, __assign({}, props, { disabled: disabled || loading, sx: __spreadArray([
            // Base styles for contained buttons
            isContained && {
                px: 4,
                py: 1,
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: 2,
                textTransform: 'none',
                backgroundColor: '#1e3a8a',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(30, 58, 138, 0.2)',
                '&:hover': {
                    backgroundColor: '#1e40af',
                    boxShadow: '0 3px 10px rgba(30, 58, 138, 0.3)',
                },
                '&.Mui-disabled': {
                    backgroundColor: '#cbd5e1',
                    color: '#ffffff',
                    boxShadow: 'none',
                }
            }
        ], (Array.isArray(sx) ? sx : [sx]), true), children: loading ? 'Loading...' : children })));
};

var StepperComponent = function (_a) {
    var steps = _a.steps, activeStep = _a.activeStep, _b = _a.orientation, orientation = _b === void 0 ? 'horizontal' : _b;
    return (jsxRuntime.jsx(material.Box, { sx: { width: '100%', mb: 3 }, children: jsxRuntime.jsx(material.Stepper, { activeStep: activeStep, orientation: orientation, children: steps.map(function (label, index) { return (jsxRuntime.jsx(material.Step, { children: jsxRuntime.jsx(material.StepLabel, { children: jsxRuntime.jsx(material.Typography, { variant: "body2", children: label }) }) }, label)); }) }) }));
};

var gradientAnimation = material.keyframes(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  0% {\n    background-position: 0% 50%;\n  }\n  50% {\n    background-position: 100% 50%;\n  }\n  100% {\n    background-position: 0% 50%;\n  }\n"], ["\n  0% {\n    background-position: 0% 50%;\n  }\n  50% {\n    background-position: 100% 50%;\n  }\n  100% {\n    background-position: 0% 50%;\n  }\n"])));
var spinAnimation = material.keyframes(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n"], ["\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n"])));
var LoadingSpinner = function (_a) {
    var _b = _a.message, message = _b === void 0 ? 'Loading...' : _b, _c = _a.size, size = _c === void 0 ? 40 : _c;
    return (jsxRuntime.jsxs(material.Box, { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3, children: [jsxRuntime.jsx(material.Box, { sx: {
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: "conic-gradient(\n            from 0deg,\n            #FF6B35 0deg 80deg,\n            #F7B801 100deg 170deg,\n            #4CAF50 190deg 260deg,\n            #2196F3 280deg 350deg,\n            #FF6B35 370deg\n          )",
                    animation: "".concat(spinAnimation, " 0.6s linear infinite"),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&::before': {
                        content: '""',
                        width: "".concat(size * 0.7, "px"),
                        height: "".concat(size * 0.7, "px"),
                        borderRadius: '50%',
                        backgroundColor: 'background.paper',
                        position: 'absolute',
                    }
                } }), message && (jsxRuntime.jsx(material.Typography, { variant: "body2", sx: {
                    mt: 2,
                    background: 'linear-gradient(90deg, #FF6B35, #F7B801, #4CAF50, #2196F3)',
                    backgroundSize: '300% 300%',
                    animation: "".concat(gradientAnimation, " 1.8s ease infinite"),
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 500
                }, children: message }))] }));
};
var templateObject_1, templateObject_2;

var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            hasError: false
        };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    };
    ErrorBoundary.prototype.render = function () {
        var _a;
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (jsxRuntime.jsx(material.Box, { p: 3, children: jsxRuntime.jsxs(material.Alert, { severity: "error", children: [jsxRuntime.jsx(material.AlertTitle, { children: "Something went wrong" }), ((_a = this.state.error) === null || _a === void 0 ? void 0 : _a.message) || 'An unexpected error occurred'] }) }));
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(react.Component));

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
var tRexTheme = styles.createTheme({
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

/**
 * South African Localization Utilities
 * Handles currency formatting, metric system conversions, and local preferences
 */
// Currency formatting for South African Rand (ZAR)
var formatCurrency = function (amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};
// Format currency with decimals when needed
var formatCurrencyDetailed = function (amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
// Distance formatting (kilometers)
var formatDistance = function (distanceInKm) {
    if (distanceInKm < 1) {
        return "".concat(Math.round(distanceInKm * 1000), " m");
    }
    return "".concat(distanceInKm.toLocaleString('en-ZA'), " km");
};
// Fuel consumption (liters per 100km)
var formatFuelConsumption = function (litersPerHundredKm) {
    return "".concat(litersPerHundredKm.toFixed(1), " L/100km");
};
// Engine size (liters)
var formatEngineSize = function (liters) {
    return "".concat(liters.toFixed(1), "L");
};
// Weight formatting (kilograms/tonnes)
var formatWeight = function (weightInKg) {
    if (weightInKg >= 1000) {
        return "".concat((weightInKg / 1000).toFixed(1), " tonnes");
    }
    return "".concat(weightInKg.toLocaleString('en-ZA'), " kg");
};
// Speed formatting (km/h)
var formatSpeed = function (speedInKmh) {
    return "".concat(speedInKmh, " km/h");
};
// Power formatting (kW and HP)
var formatPower = function (powerInKw) {
    var hp = Math.round(powerInKw * 1.34102);
    return "".concat(powerInKw, " kW (").concat(hp, " HP)");
};
// Torque formatting (Nm)
var formatTorque = function (torqueInNm) {
    return "".concat(torqueInNm, " Nm");
};
// Number formatting with South African locale
var formatNumber = function (num) {
    return num.toLocaleString('en-ZA');
};
// Percentage formatting
var formatPercentage = function (decimal) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }).format(decimal);
};
// Date formatting for South Africa
var formatDate = function (date) {
    return new Intl.DateTimeFormat('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};
// Short date formatting
var formatDateShort = function (date) {
    return new Intl.DateTimeFormat('en-ZA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
};
// Convert miles to kilometers
var milesToKm = function (miles) {
    return miles * 1.60934;
};
// Convert kilometers to miles
var kmToMiles = function (km) {
    return km / 1.60934;
};
// Convert MPG to L/100km
var mpgToLitersPer100km = function (mpg) {
    return 235.214 / mpg;
};
// Convert L/100km to MPG
var litersPer100kmToMpg = function (liters) {
    return 235.214 / liters;
};
// Convert HP to kW
var hpToKw = function (hp) {
    return hp / 1.34102;
};
// Convert kW to HP
var kwToHp = function (kw) {
    return kw * 1.34102;
};
// South African provinces for location selection
var southAfricanProvinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape',
];
// Major South African cities
var majorCities = [
    'Cape Town',
    'Johannesburg',
    'Durban',
    'Pretoria',
    'Port Elizabeth',
    'Bloemfontein',
    'East London',
    'Pietermaritzburg',
    'Kimberley',
    'Polokwane',
    'Nelspruit',
    'Mahikeng',
];
// Vehicle registration format validation for South Africa
var validateSARegistration = function (registration) {
    // South African registration format: ABC 123 GP or ABC123GP
    var saRegex = /^[A-Z]{2,3}\s?\d{3,4}\s?[A-Z]{2}$/i;
    return saRegex.test(registration.trim());
};
// Format South African phone number
var formatPhoneNumber = function (phone) {
    // Remove all non-digits
    var digits = phone.replace(/\D/g, '');
    // Format as +27 XX XXX XXXX
    if (digits.startsWith('27') && digits.length === 11) {
        return "+27 ".concat(digits.slice(2, 4), " ").concat(digits.slice(4, 7), " ").concat(digits.slice(7));
    }
    // Format as 0XX XXX XXXX
    if (digits.startsWith('0') && digits.length === 10) {
        return "".concat(digits.slice(0, 3), " ").concat(digits.slice(3, 6), " ").concat(digits.slice(6));
    }
    return phone; // Return original if doesn't match expected format
};
var localization = {
    formatCurrency: formatCurrency,
    formatCurrencyDetailed: formatCurrencyDetailed,
    formatDistance: formatDistance,
    formatFuelConsumption: formatFuelConsumption,
    formatEngineSize: formatEngineSize,
    formatWeight: formatWeight,
    formatSpeed: formatSpeed,
    formatPower: formatPower,
    formatTorque: formatTorque,
    formatNumber: formatNumber,
    formatPercentage: formatPercentage,
    formatDate: formatDate,
    formatDateShort: formatDateShort,
    milesToKm: milesToKm,
    kmToMiles: kmToMiles,
    mpgToLitersPer100km: mpgToLitersPer100km,
    litersPer100kmToMpg: litersPer100kmToMpg,
    hpToKw: hpToKw,
    kwToHp: kwToHp,
    southAfricanProvinces: southAfricanProvinces,
    majorCities: majorCities,
    validateSARegistration: validateSARegistration,
    formatPhoneNumber: formatPhoneNumber,
};

// Vehicle Image Utilities - Provides consistent image selection across components
var FALLBACK_VEHICLE_IMAGES = [
    'https://images.unsplash.com/photo-1591293836027-e05b48473b67?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1283',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1125',
    'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764',
    'https://images.unsplash.com/photo-1588258219511-64eb629cb833?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.unsplash.com/photo-1593544340816-93d84a106415?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1195',
    'https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1172',
];
// Simple seeded random function to ensure consistent image selection
var seededRandom = function (seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};
/**
 * Get a consistent array of images for a vehicle based on its ID
 * @param vehicle - Vehicle object with id or usedVehicleStockId
 * @param count - Number of images to return (default: 5)
 * @returns Array of image URLs
 */
var getVehicleImages = function (vehicle, count) {
    if (count === void 0) { count = 5; }
    // Use vehicle ID as seed to ensure consistent image selection
    var seed = vehicle.id || vehicle.usedVehicleStockId || 1;
    // Create a deterministic shuffle based on vehicle ID
    var shuffledImages = __spreadArray([], FALLBACK_VEHICLE_IMAGES, true).map(function (img, index) { return ({ img: img, sort: seededRandom(seed + index) }); })
        .sort(function (a, b) { return a.sort - b.sort; })
        .map(function (_a) {
        var img = _a.img;
        return img;
    })
        .slice(0, count);
    return shuffledImages;
};
/**
 * Get the main/primary image for a vehicle
 * @param vehicle - Vehicle object
 * @returns Primary image URL
 */
var getVehicleMainImage = function (vehicle) {
    // Priority: selectedImage > imageUrl > first from consistent gallery > fallback
    if (vehicle.selectedImage)
        return vehicle.selectedImage;
    if (vehicle.imageUrl)
        return vehicle.imageUrl;
    var images = getVehicleImages(vehicle, 1);
    return images.length > 0 ? images[0] : FALLBACK_VEHICLE_IMAGES[0];
};
/**
 * Enrich a vehicle object with consistent image information
 * @param vehicle - Vehicle object to enrich
 * @returns Vehicle object with selectedImage and imageGallery properties
 */
var enrichVehicleWithImages = function (vehicle) {
    return __assign(__assign({}, vehicle), { selectedImage: getVehicleMainImage(vehicle), imageGallery: getVehicleImages(vehicle) });
};
/**
 * Enrich an array of vehicles with consistent image information
 * @param vehicles - Array of vehicle objects
 * @returns Array of vehicles with image information
 */
var enrichVehiclesWithImages = function (vehicles) {
    return vehicles.map(enrichVehicleWithImages);
};

exports.Button = Button;
exports.ErrorBoundary = ErrorBoundary;
exports.FALLBACK_VEHICLE_IMAGES = FALLBACK_VEHICLE_IMAGES;
exports.LoadingSpinner = LoadingSpinner;
exports.StepperComponent = StepperComponent;
exports.enrichVehicleWithImages = enrichVehicleWithImages;
exports.enrichVehiclesWithImages = enrichVehiclesWithImages;
exports.formatCurrency = formatCurrency;
exports.formatCurrencyDetailed = formatCurrencyDetailed;
exports.formatDate = formatDate;
exports.formatDateShort = formatDateShort;
exports.formatDistance = formatDistance;
exports.formatEngineSize = formatEngineSize;
exports.formatFuelConsumption = formatFuelConsumption;
exports.formatNumber = formatNumber;
exports.formatPercentage = formatPercentage;
exports.formatPhoneNumber = formatPhoneNumber;
exports.formatPower = formatPower;
exports.formatSpeed = formatSpeed;
exports.formatTorque = formatTorque;
exports.formatWeight = formatWeight;
exports.getVehicleImages = getVehicleImages;
exports.getVehicleMainImage = getVehicleMainImage;
exports.hpToKw = hpToKw;
exports.kmToMiles = kmToMiles;
exports.kwToHp = kwToHp;
exports.litersPer100kmToMpg = litersPer100kmToMpg;
exports.localization = localization;
exports.majorCities = majorCities;
exports.milesToKm = milesToKm;
exports.mpgToLitersPer100km = mpgToLitersPer100km;
exports.southAfricanProvinces = southAfricanProvinces;
exports.theme = tRexTheme;
exports.validateSARegistration = validateSARegistration;
//# sourceMappingURL=index.js.map
