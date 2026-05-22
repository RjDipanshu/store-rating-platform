# StorePulse - Enterprise Store Rating Platform ⚡

Welcome to **StorePulse**, a high-performance, full-stack store evaluation registry built to satisfy the **FullStack Intern Coding Challenge**. 

This system features a state-of-the-art **cyberpunk developer theme** (deep-space dark backgrounds, custom neon indigo/cyan border rings, glassmorphic layout containers, glowing input fields, and custom popover dropdown controls) paired with robust architectural design.

---

## 🗺️ Architectural Flow Structures

### 1. Unified Authentication & Gated Access Flow
This diagram illustrates how users are authenticated and dynamically routed to their secure dashboards depending on their specific security roles (`ADMIN`, `STORE_OWNER`, or `USER`), as well as how invalid access attempts are handled by our custom guarded route modules:

```mermaid
graph TD
    A[Visitor Client Browser] -->|Enters Route /| B{Has JWT Token?}
    B -->|No / Expired| C[Cyber Login/Signup Page]
    B -->|Valid Token| D{Decoded User Role}
    
    D -->|ADMIN| E[Admin Dashboard /admin/dashboard]
    D -->|STORE_OWNER| F[Owner Dashboard /owner/dashboard]
    D -->|USER| G[User Dashboard /dashboard]
    
    E -.->|Attempt Unauthorized Access| H[Guarded Route Control]
    F -.->|Attempt Unauthorized Access| H
    G -.->|Attempt Unauthorized Access| H
    H -->|Access Blocked| I[Glassmorphic 403 Forbidden Page]
```

### 2. In-Memory Sorting & Rating Processing Sequence
To avoid Prisma syntax exceptions and database-level query crashes when ordering listings by virtual computed fields like `averageRating` (which do not exist as static database columns), we designed an in-memory sorting pipeline. 

Here is the exact sequence of data flow during a sorted request:

```mermaid
sequenceDiagram
    participant Client as Client Browser
    participant API as Express API Gateway
    participant DB as MySQL Database (Prisma)
    
    Client->>API: GET /stores?search=saket&sort=averageRating&order=desc
    API->>DB: Query matches where Name/Address contains 'saket' (Includes Ratings table relation)
    DB-->>API: Returns raw Store records & linked Ratings list
    Note over API: 1. Map stores & calculate averageRating on-the-fly<br/>2. Retrieve current user's submitted rating
    Note over API: 3. Dynamic Javascript sorting based on computed averageRating (desc)
    API-->>Client: Returns sorted mappedStores JSON payload
    Note over Client: Renders responsive Cyber Cards grid in precise descending rating order
```

### 3. Store Rating Submission & Evaluation Pipeline
This represents the lifecycle of a store evaluation submission, ensuring instant aggregate recalculation and visibility across the Admin, Owner, and User portals:

```mermaid
flowchart LR
    A[User clicks 'Evaluate'] --> B[Pre-populates past stars]
    B --> C[Selects stars 1 to 5]
    C --> D{Is rating active?}
    D -->|Yes| E[Update existing rating record]
    D -->|No| F[Create new rating record]
    E --> G[Recalculate Store Avg Rating]
    F --> G
    G --> H[Sync platforms metrics instantly]
```

---

## 🎨 System UI Wireframe (Cyber Theme Layout)

Below is an ASCII schematic of the **StorePulse Client Dashboard**, showing the sleek glassmorphic navigation header, integrated filter tools, and custom visual cards:

<img width="1919" height="875" alt="Screenshot 2026-05-22 122048" src="https://github.com/user-attachments/assets/35079176-1983-40ef-b7c4-8cf3682a1652" />

<img width="1898" height="864" alt="Screenshot 2026-05-22 122352" src="https://github.com/user-attachments/assets/8e3de8a2-4bd4-4f3c-bd95-b49529afb5f3" />

<img width="1919" height="869" alt="Screenshot 2026-05-22 122905" src="https://github.com/user-attachments/assets/405fd04a-b091-4509-a97f-32660d4bc13f" />




---

## 📋 Strict Input & Validation Constraints

To satisfy real-world production specifications, both the client signup pages and administrative provisioning forms are bound to strict database-level constraint validators:

* 👤 **Full Name**: Minimum **20 characters**, Maximum **60 characters** (e.g. `Rajesh Kumar Singhal Gupta`).
* 🔒 **Password Key**: Length **8 to 16 characters**, strictly requiring at least **one uppercase letter** and **one special character/symbol** (e.g., `Password123!`).
* 📧 **Email**: Standard email composition screening via `validator.isEmail` standard rules.
* 📍 **Physical Address**: Maximum **400 characters** in length.

---

## 🖥️ Evaluator Test Accounts (Default Seed)

The database includes a comprehensive seeding script that pre-populates the platform with **1 System Admin**, **3 Normal Users**, **10 Store Owners**, **10 physical Stores**, and **30 mock ratings** with distinct averages.

**Master Password for ALL accounts:** `Password123!`

### Credentials Table

| # | Authorization Role | Test Account Email | Pre-Loaded Platform Metrics & Data |
|---|---------------------|--------------------|-----------------------------------|
| 1 | **System Administrator** | `admin@gmail.com` | Has full view of dashboard totals (Users, Stores, Ratings). Can provision new users/stores. Has global user/store directories with search, role filters, sorting, and inline computed rating summaries. |
| 2 | **Normal User** | `amit.kumar@gmail.com` | Pre-evaluated stores: Star rating is shown inline on store cards. Can evaluate/re-evaluate all 10 stores. Supports search by brand/address. |
| 3 | **Normal User** | `priya.sri@gmail.com` | Second client account to verify multi-user rating modifications instantly. |
| 4 | **Normal User** | `sid.roy@gmail.com` | Third client account with unique pre-submitted evaluations. |
| 5 | **Store Owner** | `rajesh.owner@gmail.com` | Owns **Starbucks Premium Coffee** (Saket, Delhi). Dashboard displays a calculated rating average, overall review counts, and customer feedback logs. |
| 6 | **Store Owner** | `ananya.owner@gmail.com` | Owns **Dominos Artisanal Pizza** (Juhu, Mumbai). Displays isolated partner metrics, ratings, and logs. |
| 7 | **Store Owner** | `karthik.owner@gmail.com` | Owns **Subway Gourmet Sandwiches** (Nungambakkam, Chennai). |

---

## 🛠️ Step-by-Step Local Deployment Guide

To run this project locally, ensure you have **Node.js** and **MySQL** (or PostgreSQL) active on your system.

### 1. Database Configuration
Open [backend/.env](file:///c:/Users/dipan/OneDrive/Desktop/Roxiler%20system/store-rating-platform/backend/.env) and ensure the connection string matches your database server address:
```env
DATABASE_URL="mysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/store_rating"
```

### 2. Backend Server Deployment
Navigate to the `backend` folder, install dependencies, sync database schemas, run the seed script, and launch the nodemon server:
```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run dev
```
*The API gateway will launch instantly on **Port 5000**.*

### 3. Frontend Client Launch
Navigate to the `frontend` folder, install dependencies, and launch Vite development build:
```bash
cd ../frontend
npm install
npm run dev
```
*The client dashboard will launch instantly on **Port 5173** (`http://localhost:5173`).*

---
---
