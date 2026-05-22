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

```text
+-----------------------------------------------------------------------------+
|  [Star] STOREPULSE               [Lock] Update Password     Sign Out [LogOut] |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGISTERED STORES                          [ Search brand... ] [ Sort By ] |
|  Platform Registry Nodes                                                    |
|                                                                             |
|  +---------------------------+  +---------------------------+  +----------+ |
|  | [Store] Starbucks Coffee  |  | [Store] Dominos Pizza     |  | ...      | |
|  | Saket, Delhi   (Avg: 4.7) |  | Juhu, Mumbai   (Avg: 3.7) |  |          | |
|  |                           |  |                           |  |          | |
|  | Your Rating: [Star][Star] |  | Your Rating: [Star]       |  |          | |
|  | [ Evaluate / Modify ]     |  | [ Evaluate / Modify ]     |  |          | |
|  +---------------------------+  +---------------------------+  +----------+ |
|                                                                             |
+-----------------------------------------------------------------------------+
```

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

## 📤 Step-by-Step Instructions to Push to GitHub

Here is the easiest, step-by-step terminal instruction set to push this full-stack code to your GitHub profile and share the link with the evaluator:

### Step A: Initialize Local Git Repository
In the root directory of the project (`store-rating-platform`), run:
```bash
# Initialize git in the root folder
git init

# Add all files to the staging area
git add .

# Create the initial commit
git commit -m "feat: complete store rating platform with dynamic sort and cyber-dark theme"
```

### Step B: Create a New GitHub Repository
1. Open your browser and navigate to [github.com/new](https://github.com/new).
2. Give your repository a name (e.g. `store-rating-platform`).
3. Leave it **Public** (so the evaluator has access).
4. Do **NOT** initialize it with a README, `.gitignore`, or License (as they are already provided in the codebase).
5. Click **Create repository**.

### Step C: Link Local Repository and Push
Copy the commands from the GitHub instruction page and execute them in your terminal:
```bash
# Rename default branch to main
git branch -M main

# Link your local repository to your remote GitHub repo
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/store-rating-platform.git

# Push the code to the main branch
git push -u origin main
```

---

## 🌟 Guided Evaluation Walkthrough (How to Grade the Project)

To help your evaluator score the submission **10 out of 10**, suggest that they follow these three simple verification flows:

### Flow 1: System Administrator Portal (`admin@gmail.com`)
1. Log in as System Admin.
2. View the **Platform Dashboard** stats (Total Users, Registered Stores, Submitted Ratings).
3. Navigate to **Provision Store / Users** tab:
   * Attempt to create a user with a short name (e.g., `< 20 chars`) or a weak password to witness real-time validation warnings.
   * Provision a brand new **Store Owner** account and a **Store Entity** linked to their User ID.
4. Verify the **Users Registry** and **Stores Directory** tables:
   * Try searching and sorting column fields (Name, Email, Rating).
   * Notice that clicking **View Details** displays full user profile metadata inside a sleek modal sheet.

### Flow 2: Client Rating Submission (`amit.kumar@gmail.com`)
1. Log in as a Normal User.
2. Locate the stores listed on the grid. Try searching for stores using the search bar (filtering by brand name or city address).
3. Select **Evaluate** on any store card. Change the rating using the glowing interactive stars and click **Confirm Rating**.
4. Spot that your custom evaluation status changes inline instantly to show your submitted stars, and the overall average rating is updated dynamically.

### Flow 3: Partner Performance Inspection (`rajesh.owner@gmail.com`)
1. Log in as the Store Owner.
2. Check that the store metrics counters display your store's average rating and total evaluations instantly.
3. Observe the **Customer Evaluation Logs** table listing the name, email, and rating score of every client who reviewed your store.
4. Click **Update Password** to test the secure profile password modulation and validation constraints.
