# ShopSmart Mini Mobile App Challenge

### Time Required: 15 – 25 hours

## Challenge Overview

![Important!](https://img.shields.io/badge/Important-Read%20the%20challenge%20thoroughly%20before%20proceeding-red?style=for-the-badge&logo=mobile&link=# 'Important')

Welcome to our Mobile Application Developer Challenge. This assessment is designed to evaluate your React Native expertise, architecture skills, and ability to deliver a production ready app.
This **mini** assessment focuses on your ability to build a clean, well-architected React Native CLI (no Expo) app with just **three** screens:

1. **Product List**
2. **Cart**
3. **Profile**
   You’ll demonstrate state management, API integration, basic image upload, and clean code—all within a minimal footprint.

---

## Technology Requirements

- **_React Native CLI_** (≥0.70) — _no Expo_
- **_TypeScript_** (strict mode enabled) — _mandatory_
- **Redux ** (or equivalent) for global state
- **_Axios_** or built-in `fetch` for network requests
- Image & Picker for upload - Permission Handling — _mandatory_
- **_Redux Persist_** / **_AsyncStorage_** (optional, for caching)

---

## Screens & Core Requirements

### Product List Screen

- Fetch & display a paginated list of products from a public or mock REST API.
- Show loading spinner and an error state with retry.
- Each item shows image, title, price, and two buttons: “Add to Cart” and “Add to Wishlist.”
- Tapping either toggles that state in Redux.

### Cart Screen

- List all items added to cart.
- Allow removing items.
- Display the total sum of item prices.
- Show an empty-cart state when no items.

### Profile Screen

- Edit **name** and **email** fields (local state is fine).
- Upload an **avatar** from camera or gallery, showing upload progress.
- Display the uploaded avatar on this screen.

---

## Architecture & Code Organization

- **Redux** handles cart & wishlist.
- **Services** layer isolates API calls.
- **Components** are small and reusable.

---

## Submission Guidelines

1. Push to a **public GitHub repo** (include this `README.md`).
2. Add **screenshots** of each screen (Android & iOS).
3. Optionally, include a **30 sec recording** demoing:
   - Loading the product list
   - Adding/removing items in cart
   - Editing profile and uploading avatar
4. In your `README.md`, briefly explain:
   - Why you chose each library/framework
   - Your folder structure & architecture decisions
   - Any trade-offs or shortcuts due to time
