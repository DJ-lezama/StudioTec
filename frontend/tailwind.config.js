/** @type {import('tailwindcss').Config} */
// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FCEDF1",
        tertiary: "#EC9CC8",
        primary: "#F9D2DE", //used for cards
        secondary: "#6F112D", //used for the dashboard view cards
        textMain: "#3E0A21",
        white: "#FFFFFF"
      },
      fontFamily: {
        heading: ['"Rufina"', ...defaultTheme.fontFamily.serif],
        body: ['"Rufina"', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        // Headings
        'h1': ['54px', {lineHeight: '110%'}],
        'h2': ['42px', {lineHeight: '110%'}],
        'h3': ['32px', {lineHeight: '110%'}],
        'h4': ['24px', {lineHeight: '110%'}],
        'h5': ['20px', {lineHeight: '110%'}],
        'h6': ['18px', {lineHeight: '110%'}],
        // Subtitles
        'subtitle-m': ['16px', {lineHeight: '110%'}],
        'subtitle-s': ['14px', {lineHeight: '110%'}],
        // Body
        'body-l': ['18px', {lineHeight: '140%'}],
        'body-m': ['16px', {lineHeight: '140%'}],
        'body-s': ['14px', {lineHeight: '140%'}],
        'body-xs': ['12px', {lineHeight: '140%'}],
        'body-xxs': ['10px', {lineHeight: '140%'}],
        // Buttons & Captions
        'button-l': ['20px', {lineHeight: '100%', letterSpacing: '0.5px'}],
        'button-m': ['16px', {lineHeight: '100%', letterSpacing: '0.5px'}],
        'button-s': ['14px', {lineHeight: '100%', letterSpacing: '0.5px'}],
        'caption': ['20px', {lineHeight: '100%', letterSpacing: '1px'}],
        'tabs': ['16px', {lineHeight: '100%'}],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700,
      }
    },
  },
  plugins: [],
}
