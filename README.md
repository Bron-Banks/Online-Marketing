# Online Marketing

A full-stack marketplace web app where users can browse, filter, and buy listings across categories like electronics, furniture, fashion, sports, and toys — or sign in to list, edit, and manage their own items for sale.

This repository is the **frontend** (React). It talks to a separate Node/Express + MongoDB backend over a REST API.

## Features

- **Browse & filter** listings by category, with live search-free category tabs and a sliding-indicator nav
- **Product details** page with an image carousel, live Q&A (ask/answer questions on a listing), and quantity-aware "Add to Cart"
- **Shopping cart** with persistent state (survives page reloads), quantity controls, and a running subtotal/tax/shipping breakdown
- **Checkout flow** — Cart → Shipping → Payment, with a step indicator and (mock) payment method selection
- **Authentication** — register/sign in with JWT, protected routes for authenticated-only actions
- **Seller dashboard** ("My Advertisements") — create, edit, disable, and answer questions on your own listings, with per-category stats and status filters
- **Responsive, themed UI** built on Bootstrap 5 + React-Bootstrap with a custom design system (gradients, custom components, Font Awesome icons)

## Tech Stack

- [React 18](https://react.dev/) (Create React App)
- [React Router 6](https://reactrouter.com/) for routing and protected routes
- [Bootstrap 5](https://getbootstrap.com/) + [React-Bootstrap](https://react-bootstrap.github.io/) for layout/components
- [Font Awesome](https://fontawesome.com/) for icons
- [jwt-decode](https://github.com/auth0/jwt-decode) for reading the auth token client-side
- React Context for cart state management

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- The companion backend API running (Express + MongoDB) — this frontend expects it to be reachable at the URL set in `REACT_APP_APIURL`

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the API URL**

   Create a `.env` file in the project root (or edit the existing one):

   ```
   REACT_APP_APIURL="http://localhost:3001"
   ```

   Point this at wherever your backend is running.

3. **Run the app**

   ```bash
   npm start
   ```

   Opens [http://localhost:3000](http://localhost:3000) in development mode with hot reload.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the app in development mode |
| `npm test` | Launches the test runner in watch mode |
| `npm run build` | Builds an optimized production bundle to `build/` |
| `npm run eject` | Ejects the Create React App config (one-way operation) |

## Project Structure

```
src/
├── assets/          Images used across categories, payment methods, etc.
├── components/
│   ├── auth/        Sign in, register, edit profile, auth helpers, private route guard
│   ├── layout/       Header (nav) and Footer
│   ├── posts/        Add/Edit/List posts, Q&A answer page
│   ├── Posts.js       Home / browse page
│   ├── PostDetails.js Listing detail page
│   ├── Profile.js     Seller dashboard ("My Advertisements")
│   ├── ShoppingCart.js
│   ├── shippingForm.js
│   └── payment.js
├── context/          CartContext (global cart state)
├── datasource/        API clients (posts, users, questions) and data models
├── index.css          Global styles / design system
└── index.js           App entry point and route definitions
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `REACT_APP_APIURL` | Base URL of the backend API (e.g. `http://localhost:3001`) |

## License

MIT © Kxngbron — see [LICENSE](../LICENSE).
