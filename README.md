# Food Rescue (Next.js Version)

A Vercel-ready, full-stack application connecting food donors, NGOs, and recipients. Built with Next.js 14, Tailwind CSS, and MongoDB.

## 🚀 Key Features

- **Monolithic Next.js**: Frontend and Backend (API Routes) in a single GitHub repository.
- **Serverless API**: Optimized for Vercel's serverless functions.
- **Tailwind UI**: Modern green-white theme with responsive sidebar layout.
- **Full Auth**: JWT-based login/register with role-based dashboard access.
- **Live NGO Map**: Interactive Leaflet.js map for donation tracking (No Google API keys needed).
- **Impact Analytics**: Responsive charts using Recharts.

## 🛠️ Installation

1.  **Clone & Install**:
    ```bash
    cd food-rescue-next
    npm install
    ```
2.  **Environment Variables**:
    Create a `.env.local` file:
    ```env
    MONGODB_URI=your_mongodb_cluster_url
    JWT_SECRET=your_jwt_secret
    ```
3.  **Run Locally**:
    ```bash
    npm run dev
    ```

## 🔐 Deployment (Vercel)

1.  Push your code to **GitHub**.
2.  Connect your repository to **Vercel**.
3.  Add `MONGODB_URI` and `JWT_SECRET` in the Vercel **Environment Variables** section.
4.  Deploy! Vercel will automatically handle building and hosting the API routes.

## 🏗️ Project Structure

- `src/app/api`: Serverless backend endpoints.
- `src/app/(pages)`: App Router pages.
- `src/models`: Mongoose database schemas.
- `src/lib`: Shared utilities (DB connection).
- `src/components`: UI components (Navbar, Sidebar, Map).

---
Built with ❤️ for a Zero-Waste Future.
