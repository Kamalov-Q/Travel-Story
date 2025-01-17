/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#05B6D3",
        seconary: "#EF863E",
      },
      backgroundImage: {
        "login-bg-img": "url('./src/assets/login.png')",
        "signup-bg-img": "url('./src/assets/signUp.png')",
      },
      screens: {
        xxs: "375px",
      },
    },
  },
  plugins: [],
};
