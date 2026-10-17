# Interna

**Website localization management.**

Interna is a localization management application designed to help developers manage translation keys, source text, and translations across multiple languages in one place.

Instead of manually maintaining localization files, developers can organize translation keys, manage their translations, and work with localization data through a dedicated interface.

## Features

- **Project Management** — Organize localization work into separate projects.
- **Translation Keys** — Create, edit, and manage translation keys and their source text.
- **Multilingual Translations** — Manage translations for multiple target languages.
- **Translation Progress** — Track translation coverage across target languages.
- **Import & Export** — Work with localization data through import and export functionality.
- **AI-Assisted Translation** — Generate translations with DeepL to speed up the localization workflow.
- **Authentication** — Create an account, sign in, and manage account settings.
- **Dark & Light Themes** — Choose a theme that suits your preferences.
- **Internationalized Interface** — Use the application in multiple interface languages.

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [React](https://react.dev/) — User interface
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Material UI](https://mui.com/) — UI components and theming
- [PostgreSQL](https://www.postgresql.org/) — Relational database
- [Prisma ORM](https://www.prisma.io/) — Database access
- [Better Auth](https://www.better-auth.com/) — Authentication
- [next-intl](https://next-intl.dev/) — Internationalization
- [DeepL API](https://www.deepl.com/) — Machine translation

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL
- A [DeepL API account](https://www.deepl.com/pro-api)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/panchukdev/interna
    cd interna
    ```

2. Install dependencies:

    ```bash
    npm install --legacy-peer-deps
    ```

    The --legacy-peer-deps flag is required because Better Auth currently has peer dependency compatibility issues with Prisma 8.

3. Configure your environment variables in a .env file.

4. Set up the database using the project's configured Prisma workflow.

5. Start the development server:

    ```bash
    npm run dev
    ```

6. Open http://localhost:3000 in your browser.

### Environment Variables

Create a `.env` file in the project root and configure the following variables:

| Variable             | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`       | Connection string for your PostgreSQL database.            |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth for cryptographic operations.   |
| `BETTER_AUTH_URL`    | Base URL of the application, e.g. `http://localhost:3000`. |
| `DEEPL_API_KEY`      | Your DeepL API authentication key.                         |

#### Obtaining the Required Values

- **`DATABASE_URL`** — Use the connection string for your PostgreSQL database.
- **`BETTER_AUTH_SECRET`** — Generate a secure secret using the [Better Auth documentation](https://www.better-auth.com/docs/installation).
- **`BETTER_AUTH_URL`** — Set this to `http://localhost:3000` for local development.
- **`DEEPL_API_KEY`** — Sign up for [DeepL API](https://www.deepl.com/pro-api) and obtain your own API key.

Example `.env` configuration:

```env
DATABASE_URL="your_postgresql_connection_string"
BETTER_AUTH_SECRET="your_generated_secret"
BETTER_AUTH_URL="http://localhost:3000"
DEEPL_API_KEY="your_deepl_api_key"
```

Replace the placeholder values with your own configuration. Never commit your .env file or expose your API keys and secrets publicly.

### Development

Start the development server:

```bash
npm run dev
```

Run the production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Check package.json for the exact scripts available in the current version of the project.

## Project Goals

Interna aims to make website localization easier to manage by providing a dedicated interface for translation keys and multilingual content.

The goal is to reduce the friction of maintaining localization data and provide developers with a more organized workflow as their projects grow.
