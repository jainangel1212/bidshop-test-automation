# Bidshop Test Automation

This project contains API and UI automation tests for the Bidshop application using Playwright with TypeScript.

## Framework Choice

I chose Playwright for both API and UI automation.

Using the same framework and language for both suites keeps the setup simple and consistent. Playwright provides built-in API testing, browser automation, assertions and auto-waiting. I also configured HTML reporting and screenshots on failure to help with test investigation.

TypeScript was used because the Bidshop application is already written in TypeScript and it provides type checking and IDE support.

For the scope of this exercise, I kept the framework lightweight and extracted repeated test-data and authentication setup into reusable helpers.

## Test Structure

### API Tests

Location:

```text
backend/tests/api/
```

Test suites:

- `products.spec.ts`
- `auth.spec.ts`
- `cart.spec.ts`
- `orders.spec.ts`

Reusable test setup:

```text
backend/tests/helpers/test-data.ts
```

The API suite covers:

- Product catalogue
- Successful customer registration and login
- Registration validation for duplicate email, invalid email and short password
- Invalid login credentials
- Adding, updating and removing cart items
- Creating and retrieving customer orders
- Order totals and GST calculation
- Cart clearing after successful checkout
- Unauthenticated cart and order access

### UI Tests

Location:

```text
frontend/tests/ui/
```

Test suites:

- `shop.spec.ts`
- `auth.spec.ts`
- `auth-validation.spec.ts`
- `cart.spec.ts`
- `cart-management.spec.ts`
- `checkout.spec.ts`

Reusable test data:

```text
frontend/tests/helpers/test-data.ts
```

The UI suite covers:

- Viewing, searching and filtering the product catalogue
- Customer registration
- Successful and invalid login
- Login navigation when a logged-out customer attempts to buy
- Adding, updating and removing cart items
- Clearing the cart
- Checkout summary and successful order confirmation

## Prerequisites

- Node.js 20+
- npm

## Installation

From a clean checkout, install the backend dependencies:

```bash
cd backend
npm install
```

Install the frontend dependencies:

```bash
cd ../frontend
npm install
```

Install the Chromium browser required by Playwright:

```bash
npx playwright install chromium
```

## Running the Application

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

The API will be available at:

```text
http://localhost:4000
```

## Running the Tests

With the backend running, run the API suite from the `backend` directory:

```bash
npm test
```

With both the backend and frontend running, run the UI suite from the `frontend` directory:

```bash
npm test
```

## Test Reports

To open the latest Playwright HTML report:

```bash
npx playwright show-report
```

The UI configuration also captures screenshots on failure to help investigate test failures.

## Current Test Suite

The suite contains:

- 15 API tests
- 12 UI tests
- 27 automated tests in total

The tests focus on high-value customer journeys and API behaviours rather than exhaustive code coverage.

## Trade-offs and Further Improvements

Given more time, I would:

- Introduce Page Objects or reusable UI components as the UI suite grows.
- Add further boundary and negative scenarios around stock, cart quantities and checkout validation.
- Add API contract validation against the provided OpenAPI specification.
- Add CI execution so the suites run automatically on pull requests.
- Add cross-browser UI coverage where it provides value.

## Product Code Changes

No application source code was changed for the automation implementation.

Only test-related files, Playwright configuration, test dependencies/scripts and supporting documentation were added or updated.

## Observation

During testing, I observed an inconsistency in GST calculation between the cart and order flows. The cart calculation uses 12.5%, while the order calculation and UI indicate 15%.

I did not change the application implementation. In a real project, I would clarify the expected GST rule with the product/development team and raise the discrepancy for investigation.

## Bonus Task

The proposed approach for the 10% order discount feature is documented in:

```text
DISCOUNT.md
```