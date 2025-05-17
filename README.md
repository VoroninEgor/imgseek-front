# Поиск товаров по изображению

Фронтенд-приложение для поиска похожих товаров по фотографии. Позволяет пользователям загружать изображения товаров и находить похожие товары в каталоге магазина.

## Основные возможности

- 🔍 Поиск товаров по фотографии
- 🏪 Поддержка множества магазинов
- 🔐 Авторизация пользователей
- 👤 Личный кабинет
- ⚙️ Панель администратора для управления магазинами

## Технологии

- React + TypeScript
- Material-UI для интерфейса
- Vite для сборки
- React Router для навигации

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите в режиме разработки:
```bash
npm run dev
```

3. Для production сборки:
```bash
npm run build
```

## Структура проекта

- `/src/pages` - страницы приложения
- `/src/components` - переиспользуемые компоненты
- `/src/services` - сервисы для работы с API
- `/src/types` - TypeScript типы
- `/src/utils` - вспомогательные функции

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
