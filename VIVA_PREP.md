# 🎓 College Viva Preparation Guide: Chhattisgarh Tourist Guide Platform

## 1. Project Synopsis (Speak this in 60 seconds)
> "Our project is a full-stack MERN web application called **Chhattisgarh Tourist Guide Platform**. It connects tourists visiting Chhattisgarh with certified, knowledgeable local guides. Tourists can discover popular attractions across districts like Bastar, Surguja, and Sirpur, filter guides by local language (such as Halbi, Gondi, Chhattisgarhi), budget, and specialization, and send booking requests. Guides can accept or reject requests on their dashboard and mark tours as completed. Once a tour is completed, tourists can submit a verified review and rating, which dynamically recalculates the guide's rating using MongoDB aggregation pipelines. An administrative dashboard allows state tourism officials to monitor metrics, verify guide credentials, manage destinations catalog, and moderate reviews."

---

## 2. Technology Stack & Why We Chose Them

| Technology | Role | Why we chose it (Viva Answer) |
| :--- | :--- | :--- |
| **React (Vite)** | Frontend Library | Component-based, fast virtual DOM, and Vite provides sub-second Hot Module Replacement (HMR). |
| **Tailwind CSS v4** | Styling | Utility-first CSS framework enabling a modern, responsive, mobile-first design system without bulky CSS files. |
| **Node.js & Express.js** | Backend REST API | Non-blocking, asynchronous I/O with high concurrency, perfect for RESTful API services. |
| **MongoDB & Mongoose** | NoSQL Database & ODM | Schema flexibility, JSON-like BSON storage, native aggregation pipelines, and clean ObjectId cross-referencing. |
| **JWT (JSON Web Token)** | Authentication | Stateless authorization; eliminates server-side session memory overhead by cryptographically signing payloads. |
| **bcryptjs** | Password Hashing | Adaptive hashing algorithm with salt rounds, resistant to rainbow table and brute-force attacks. |

---

## 3. Frequently Asked Viva Questions & Model Answers

### Q1: What is the difference between Authentication and Authorization?
* **Authentication**: Verifying **who** the user is (e.g. logging in with email and password via `POST /api/auth/login`).
* **Authorization**: Determining **what permissions** the authenticated user has (e.g. using our `authorize('guide')` middleware so tourists cannot access guide management routes).

### Q2: What is the lifecycle of a JWT?
1. Tourist inputs credentials $\rightarrow$ server verifies password via `bcrypt.compare`.
2. Server signs a JWT with user's `_id` using `process.env.JWT_SECRET` and sends it back.
3. Client saves it in `localStorage`.
4. On every subsequent request, an **Axios Request Interceptor** attaches `Authorization: Bearer <token>`.
5. Server middleware (`authMiddleware.js`) intercepts the token, verifies the cryptographic signature with `jwt.verify`, finds the user, and attaches it to `req.user`.

### Q3: Why is MongoDB called a NoSQL database? What are Collections and Documents?
* In SQL databases (MySQL/PostgreSQL), data is stored in rigid tabular rows and columns with fixed schemas.
* In MongoDB, data is stored in flexible, JSON-like **BSON (Binary JSON) documents** organized into **collections**.
* In our project:
  * Table $\rightarrow$ Collection (e.g. `destinations`, `users`, `guiderequests`).
  * Row $\rightarrow$ Document (e.g. a single tourist place or guide booking).

### Q4: How is a Guide's average rating calculated?
* We use a **MongoDB Aggregation Pipeline** (`Review.aggregate`):
  ```javascript
  Review.aggregate([
    { $match: { guide: guideId } },
    { $group: { _id: '$guide', avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
  ])
  ```
* Rather than running this query on every page load, we calculate it upon review creation and persist the result directly onto `GuideProfile.rating`. This is **strategic denormalization** that gives $O(1)$ read performance.

### Q5: How do we prevent fake reviews?
* A review can only be submitted if:
  1. The user has an authenticated `tourist` role.
  2. The booking request ID exists and belongs to that specific tourist.
  3. The guide has officially updated the request status to `completed`.
  4. The Mongoose `Review` schema has a **unique index** on `request: { type: ObjectId, unique: true }`, ensuring one review per completed trip.

---

## 4. Five-Minute Live Demo Script for Evaluators

1. **Open Landing Page** (`http://localhost:5173`):
   - Highlight the responsive Hero banner, popular destinations (Chitrakote, Sirpur, Bhoramdeo), and metrics.
2. **Explore Destinations** (`/destinations`):
   - Click category filter pills (**Waterfall**, **Historical**, **Wildlife**).
   - Filter by district (**Bastar** or **Surguja**).
   - Click **Chitrakote Waterfall** to view destination details and recommended local guides.
3. **Find Guides** (`/guides`):
   - Show the filter sidebar: filter by language (*Chhattisgarhi / Halbi*) and max daily rate.
   - Click **Ramesh Baghel** or **Devendra Patel** to open their profile.
4. **Demonstrate Booking as Tourist**:
   - Log in as **Rahul Sharma** (`rahul@example.com` / `tourist123`).
   - Click **Request Guide** $\rightarrow$ select destination, date, and group size $\rightarrow$ click Submit.
   - Show the booking in **My Requests** with status **Pending**.
5. **Switch to Guide Portal**:
   - Log in as Guide (`ramesh.bastar@example.com` / `guide123`).
   - Go to **Incoming Requests** $\rightarrow$ click **Accept** $\rightarrow$ click **Mark Tour Completed**.
   - Show the **Availability Toggle Switch** on the Guide Dashboard.
6. **Tourist Reviews Tour**:
   - Switch back to Tourist $\rightarrow$ go to **My Requests** $\rightarrow$ click **Write a Review**.
   - Pick 5 Stars $\rightarrow$ submit feedback $\rightarrow$ observe guide rating updated!
7. **Demonstrate Admin Console** (`/admin`):
   - Log in as Admin (`admin@cg.gov.in` / `adminpassword123`).
   - Show total platform counts, toggle a guide's **Verified Badge**, show the **Add Destination** modal, and view the review moderation panel.
