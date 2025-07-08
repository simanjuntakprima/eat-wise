# Minimal Production-Grade Next.js App (JavaScript)

This is an example of a minimal production-grade Next.js application built with JavaScript. It serves as a starting point for building robust and scalable web applications.

## Core Technologies

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** JavaScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Linting:** [ESLint](https://eslint.org/)

## Project Structure

A brief overview of the key directories and files:

```
.
├── prisma/               # Prisma schema and migrations
├── src/
│   ├── app/              # Application routes (App Router)
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions
│   ├── services/         # Business logic (e.g., auth, user services)
│   └── ...
├── public/               # Static assets
├── next.config.mjs       # Next.js configuration
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
- Bun

### Installation

1.  Clone the repository:

    ```bash
    git clone <your-repo-url>
    cd nextjs-prod
    ```

2.  Install dependencies:

    ```bash
    bun install
    ```

3.  **Database Setup**
    - You'll need a PostgreSQL database.
    - Create a `.env` file in the root of the project.
    - Add your database connection string to the `.env` file:
      ```
      DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
      ```
    - Push the database schema:
      ```bash
      bunx prisma db push
      ```

### Running the Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
