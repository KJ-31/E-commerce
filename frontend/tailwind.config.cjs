/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
  // 동적 그라데이션을 문자열로 합쳤다면 safelist 권장
  safelist: [
    "bg-gradient-to-br",
    "from-pink-100", "to-rose-100",
    "from-blue-100", "to-indigo-100",
    "from-emerald-100", "to-teal-100",
  ],
};
