Here’s the updated **README.md** with a notice that the project is still under development:  

```md
# URL Shortener

🚧 **This project is currently under development. The README will be updated once the project is completed.** 🚧

A URL shortener built with Next.js, TypeScript, and Tailwind CSS, providing an efficient way to shorten URLs with a clean and accessible UI.

## Features

- Generate shortened URLs instantly
- Copy URLs to clipboard with one click
- Responsive and accessible design
- Uses Prisma for database management
- Server-side rendering and API integration

## Technologies Used

- **Next.js** - React framework for server-side rendering
- **TypeScript** - Strongly typed JavaScript for maintainability
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Prisma** - ORM for database management
- **Lucide Icons** - Icon set for UI enhancements

## Installation

### 1. Clone the Repository

```sh
git clone https://github.com/Nuu-maan/URL-Shortener.git
cd URL-Shortener
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the necessary environment variables:

```
DATABASE_URL="your_database_connection_string"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Run Prisma Migrations (if using a database)

```sh
npx prisma migrate dev
```

### 5. Start the Development Server

```sh
npm run dev
```

The application will be available at `http://localhost:3000`.

## Folder Structure

```
src/
 ├── app/             # Next.js application pages
 │   ├── about/       # About page
 │   ├── analytics/   # Analytics page
 │   ├── layout.tsx   # Main layout component
 │   ├── page.tsx     # Home page with URL shortener functionality
 │   ├── globals.css  # Global styles
 │
 ├── components/      # Reusable UI components
 │   ├── main/        # Core functionality components
 │   ├── shared/      # Shared layout and navigation components
 │   ├── ui/          # Styled UI elements (buttons, inputs, alerts, etc.)
 │   ├── analytics/   # Analytics components
 │   ├── theme/       # Theme-related components
 │
 ├── lib/             # Utility functions and database connection
 │   ├── prisma.ts    # Prisma ORM configuration
 │   ├── utils.ts     # General utility functions
 │
 ├── prisma/          # Prisma schema and migrations
 ├── public/          # Static assets
```

## Commands

- **Run in development mode**: `npm run dev`
- **Build for production**: `npm run build`
- **Lint the project**: `npm run lint`
- **Run Prisma migrations**: `npx prisma migrate dev`

## Development Status

🚧 **This project is currently in development. Expect frequent changes and updates.** 🚧  

## License

This project is licensed under the **MIT License**.

## Author

Developed by [Numan](https://github.com/Nuu-maan).
```

Let me know if you want any changes. 🚀