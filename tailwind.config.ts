import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F3F4EE",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#16231F",
          soft: "#3C4A44",
          faint: "#6B776F",
        },
        border: "#DFE2D8",
        pine: {
          DEFAULT: "#2B6F63",
          dark: "#1E4F46",
          light: "#E4EFEC",
        },
        amber: {
          DEFAULT: "#C9852E",
          light: "#F7E9D3",
        },
        danger: {
          DEFAULT: "#B4432F",
          light: "#F6E1DC",
        },
        success: {
          DEFAULT: "#3D7A45",
          light: "#E2EFE1",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        lg: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
