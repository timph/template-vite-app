
# Template App

### React + TypeScript + Vite + Mantine UI

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

- [React](https://react.dev/) is library and framework for Web and Mobile
- [Vite](https://vitejs.dev/) is Next Generation FrontEnd tooling
- [Mantine](https://mantine.dev/) is React component library

### Let's start

Install:
```
yarn
```

Run:
```
yarn dev
```

Lint:
```
yarn lint
```


## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
