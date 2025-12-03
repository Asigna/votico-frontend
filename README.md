# Votico

Unlocking Decentralized Governance for Bitcoin Communities

## Technologies

The project is developed using the following technologies:

- React (TypeScript)
- Tailwind CSS
- Vite (with SWC)

## Getting Started

To get started with the project, follow these steps.

### Installation and Running the Project

- `npm install` - install modules
- `npm run dev` - run local server [http://localhost:5173/](http://localhost:5173/)
- `npm run build` - create production build in the `dist` folder
- `npm run lint` - check all application files using ESLint

> Configure **prettier** in your IDE for code formatting

## Project Structure `src`

The project is organized as follows:

- `app` - Root application folder, contains router, layout, and connected providers necessary for the application to work.
- `assets` - Contains static application resources such as images, fonts, and other assets.
- `components` - Folder for reusable components that can be used in various parts of the application.
- `constants` - Stores constants used in the application.
- `hooks` - Contains custom React hooks that can be used in different application components.
- `api` - Folder for logic and middleware used for network operations and HTTP request handling.
- `kit` - Contains basic components from the design system, which serve as the foundation for other components.
- `pages` - Contains application pages, each with its own component structure and used in routing.
- `scss` - Folder with common SCSS/CSS rules for application styling.
- `store` - Contains application state, organized using a state management library (e.g., Jotai).
- `types` - Folder for TypeScript type declarations used in the application.
- `utils` - Contains helper functions and utilities that can be used in various parts of the application to perform common tasks.
- `main.tsx` - Application entry point, where initialization and rendering of the root component occurs.

## Code Organization

- Each component is located in its own folder.
- The main component file is named `index.tsx`.
- The component's style file is named `index.module.scss`.
- Component-specific types are declared in the `types.d.ts` file within the component folder.

### Nested Components Structure

- For components that require breaking down into smaller subcomponents, a `components` subfolder is created inside the component folder.
- Local subcomponents are organized following the same principle as main components, including `index.tsx`, `index.module.scss`, and `types.d.ts` files.

### Utils (Helper Functions)

- For helper functions, hooks, translations, and images, a `utils` folder is used inside the corresponding component or globally if they are reused in different parts of the project.

### Images

- Save images to the `./utils/images folder`, create an `index.ts` file in it where you import and export images

### Hooks

- Logic for fetching data over the network or processing data for a component is encapsulated in local hooks.
- The component only uses calls to these hooks, receiving data and methods from them.
- This reduces the amount of code inside components and simplifies their testing and maintenance.
