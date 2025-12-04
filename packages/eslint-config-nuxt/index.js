// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier';
import tailwind from 'eslint-plugin-tailwindcss';
import perfectionist from 'eslint-plugin-perfectionist';

export default [...tailwind.configs['flat/recommended'], eslintConfigPrettier, perfectionist.configs['recommended-natural']];

