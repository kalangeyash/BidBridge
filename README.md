# BidBridge
### Project Overview / Introduction

**BidBridge** is a full‑stack tender and bidding management platform designed to streamline how buyers publish tenders and how vendors discover, evaluate, and submit bids. It provides role‑based experiences for buyers, vendors, and admins, offering an end‑to‑end workflow from tender creation to bid evaluation. 

The project is built with a **React + TypeScript + Vite** frontend and a **Spring Boot** backend secured with **JWT‑based authentication**, exposing a clean REST API for all core operations.

---

### Problem Statement

Traditional tendering and procurement processes are often:

- **Fragmented**: Information is scattered across emails, spreadsheets, and shared drives.
- **Opaque**: Vendors struggle to discover relevant tenders and track bid status.
- **Manual**: Repetitive tasks like tender publication, bid collection, and status notifications consume significant time.
- **Error‑prone**: Inconsistent data capture and unstructured communication lead to misalignment and disputes.

There is a need for a centralized, secure, and transparent platform where buyers and vendors can manage tenders and bids with clear workflows, auditable records, and minimal manual overhead.

---

### Objectives and Goals

- **Centralize tender and bid management** into a single, role‑aware web application.
- **Enable buyers** to create, update, and monitor tenders with clear status tracking (e.g., Open, Closed).
- **Enable vendors** to discover relevant tenders, view details, and submit structured bids.
- **Provide admins** with a consolidated view of tenders, categories, users, and system health.
- **Enforce robust security** using authenticated, role‑based access and JWT tokens.
- **Improve operational efficiency** by reducing manual steps, ensuring consistent data capture, and surfacing key information via a modern UI.
- **Lay a scalable foundation** for future analytics, reporting, and integrations.

---

### Target Users / Stakeholders

- **Buyers / Procurement Teams**
  - Create and manage tenders.
  - Define categories, deadlines, and evaluation criteria.
  - Review and compare bids.

- **Vendors / Suppliers**
  - Discover active tenders relevant to their categories.
  - View detailed tender information.
  - Submit and track bids.

- **Administrators**
  - Oversee users, roles, and profiles.
  - Monitor all tenders and bids across the system.
  - Maintain categories and handle exceptions.

- **Business Stakeholders**
  - Procurement managers, operations heads, and compliance teams interested in transparency, auditability, and performance metrics.

---

### Key Features and Functionalities

- **Authentication & Authorization**
  - Email/password login via `/api/auth/login`.
  - JWT token issuance and validation.
  - Role‑based access control for `ROLE_BUYER`, `ROLE_VENDOR`, and admin roles.

- **User & Profile Management**
  - `User` entity with role mapping.
  - Separate `BuyerProfile` and `VendorProfile` entities linked to users.
  - Services to fetch profile information by user ID (e.g., used to resolve `profileId` on login).

- **Tender Management**
  - Create, update, and manage tenders with metadata such as title, category, status, and end date.
  - **Vendor view of active tenders**: `/api/tenders/active` returns all open tenders.
  - **Tender detail view**: `/api/tenders/{id}` returns detailed information for a given tender.
  - **Buyer update workflow**: `/api/buyers/tenders/{tenderId}` returns a pre‑filled `TenderUpdateDTO` for editing.
  - **Admin‑friendly overview**: `/api/all` (via `TenderController`) returns `AdminTenderDTO` entries to avoid cyclic serialization and expose a concise view.

- **Bid Management**
  - `Bid` entity with relations to `Tender`, `VendorProfile`, and `BidStatus`.
  - `BidService` and `BidController` (from the codebase) handle bid submission and retrieval (e.g., by tender, by vendor).
  - Status tracking for bids (e.g., Submitted, Accepted, Rejected).

- **Category Management**
  - `Category` entity and corresponding repository and service.
  - Category controllers (`CategoryController`) to handle creation/update/listing of categories.
  - Categories linked to tenders to support filtering and reporting.

- **Role‑aware Frontend Experience**
  - React + React Router‑based navigation for different roles.
  - UI components built with Radix UI, TailwindCSS, and Lucide icons for a modern, responsive interface.
  - Forms and validation implemented via `react-hook-form` and `zod`.

- **Error Handling & Observability**
  - `GlobalExceptionHandler` to standardize API error responses through `ApiErrorResponse`.
  - Custom exceptions like `ResourceNotFoundException`, `InvalidOperationException`, `DuplicateResourceException`, `BadRequestException`.

- **Async Operations**
  - `@EnableAsync` on the application (`BidbridgeApplication`) for asynchronous processing, e.g., email sending via `EmailService`.

---

### System Architecture and Design Explanation

- **Architecture Style**
  - **Backend**: Layered, service‑oriented architecture using **Spring Boot**.
    - **Controller layer**: Exposes REST endpoints (`AuthController`, `TenderController`, `BuyerController`, `VendorController`, `BidController`, `CategoryController`, `AdminController`).
    - **Service layer**: Encapsulates business logic (`TenderService`, `BidService`, `UserService`, `BuyerProfileService`, `VendorProfileService`, `CategoryService`).
    - **Repository layer**: Spring Data JPA repositories for persistence (`TenderRepository`, `BidRepository`, `UserRepository`, etc.).
    - **Domain layer**: Entities capturing core domain models (`User`, `Tender`, `Bid`, `BuyerProfile`, `VendorProfile`, `Category`, and enums like `Role`, `TenderStatus`, `BidStatus`, `OrganizationType`).

  - **Frontend**: SPA (**Single Page Application**) built on **React + TypeScript** using **Vite**.
    - UI components: Built with Radix primitives, TailwindCSS, and custom components (e.g., `Hero` and other screens).
    - State and data fetching: `@tanstack/react-query`, `axios`.
    - Routing: `react-router-dom`, providing distinct views per role.

- **Communication**
  - The frontend communicates with the backend via REST over HTTP.
  - CORS configured to allow `http://localhost:5173` as an origin for API calls (`@CrossOrigin` annotations on controllers).

- **Security Layer**
  - `SecurityConfig` defines the Spring Security filter chain, permitted endpoints, and role restrictions.
  - `JwtAuthenticationFilter` intercepts requests, extracts and validates JWT tokens via `JwtUtil`.
  - `CustomUserDetailsService` and `CustomUserDetails` adapt the `User` entity to Spring Security.

- **Design Patterns**
  - **DTO pattern**: For external API contracts (`LoginRequest`, `AuthResponse`, `TenderRequest`, `TenderUpdateDTO`, `BidRequest`, `BidResponse`, `CategoryRequest`, `CategoryResponse`, `VendorRegistrationRequest`, `BuyerRegistrationRequest`, etc.).
  - **Service/Repository pattern**: Clear separation between business logic and persistence.
  - **Global exception handling**: Centralized error responses via `GlobalExceptionHandler`.

---

### Technology Stack with Justification

- **Frontend**
  - **React 18 + TypeScript**: Strong typing for maintainable, large‑scale frontends with modern React patterns.
  - **Vite**: Fast dev server and optimized builds, improving DX and CI/CD performance.
  - **TailwindCSS + tailwind-merge + tailwindcss-animate**: Utility‑first styling for rapid UI prototyping and consistent design.
  - **Radix UI** (`@radix-ui/react-*`): Accessible, low‑level UI primitives for building robust, composable components.
  - **React Router (`react-router-dom`)**: SPA routing and role‑based navigation.
  - **React Query**: Declarative data fetching, caching, and synchronization with backend APIs.
  - **Axios**: Simplified HTTP client with interceptors (e.g., for JWT injection).
  - **Zod + react-hook-form**: Strongly typed client‑side validation and ergonomic forms.

- **Backend**
  - **Spring Boot**: Mature, production‑grade Java framework with strong ecosystem support for REST APIs, security, and data access.
  - **Spring Security + JWT**: Industry‑standard approach for stateless authentication in SPAs.
  - **Spring Data JPA**: Simplifies ORM and database access through repositories.
  - **Jakarta Validation** (`@Valid`, validation annotations): Ensures request payloads adhere to constraints at the boundary.

- **Database**
  - **Relational Database (JPA‑backed)**: The entity and repository structure is designed for SQL databases such as PostgreSQL or MySQL. The schema is normalized to capture clear relationships between users, profiles, tenders, bids, and categories.

- **Tooling & Build**
  - **Maven/Gradle (backend)**: Standard Java build and dependency management (based on typical Spring Boot conventions).
  - **Node.js + npm (frontend)**: Package management, scripts for `dev`, `build`, `lint`, `preview`, and `typecheck`.

---

### Database Design / ER Diagram Explanation

The conceptual ER design (entities inferred from the codebase) can be summarized as:

- **User**
  - Attributes: `userId`, `email`, `password`, `role`, etc.
  - Relationships:
    - One‑to‑one with `BuyerProfile` (for buyer accounts).
    - One‑to‑one with `VendorProfile` (for vendor accounts).
    - Possibly one‑to‑many with `Bid` (through profile entities).

- **BuyerProfile**
  - Attributes: `buyerProfileId`, `organizationName`, `organizationType`, contact details.
  - Relationships:
    - One‑to‑one with `User`.
    - One‑to‑many with `Tender` (buyers create multiple tenders).

- **VendorProfile**
  - Attributes: `vendorProfileId`, `companyName`, `organizationType`, capabilities, etc.
  - Relationships:
    - One‑to‑one with `User`.
    - One‑to‑many with `Bid` (vendors submit multiple bids).

- **Tender**
  - Attributes: `tenderId`, `title`, `description`, `status` (`TenderStatus`), `endDate`, budget, etc.
  - Relationships:
    - Many‑to‑one with `BuyerProfile`.
    - Many‑to‑one with `Category`.
    - One‑to‑many with `Bid`.

- **Bid**
  - Attributes: `bidId`, `amount`, `bidStatus` (`BidStatus`), proposal details, timestamps.
  - Relationships:
    - Many‑to‑one with `Tender`.
    - Many‑to‑one with `VendorProfile`.

- **Category**
  - Attributes: `categoryId`, `name`, `description`.
  - Relationships:
    - One‑to‑many with `Tender`.

- **Enums**
  - `Role`: User roles like `ROLE_BUYER`, `ROLE_VENDOR`, possibly `ROLE_ADMIN`.
  - `TenderStatus`: e.g., `OPEN`, `CLOSED`, `AWARDED`.
  - `BidStatus`: e.g., `SUBMITTED`, `ACCEPTED`, `REJECTED`.
  - `OrganizationType`: e.g., `PUBLIC`, `PRIVATE`, `GOVERNMENT`, etc.

**Design rationale:**

- Splitting **user** and **profile** entities allows one authentication layer (`User`) with flexible domain‑specific data (`BuyerProfile`, `VendorProfile`).
- Linking **tenders** to **categories** supports filtering and analytics.
- Having separate **status enums** centralizes business logic and avoids string literals in code.
- Using **DTOs** for requests/responses ensures the DB schema can evolve without breaking API contracts.

---

### API Design

The backend follows REST principles with resource‑oriented endpoints under the `/api` namespace. Representative endpoints (inferred from controllers and DTOs):

- **Authentication (`AuthController`)**
  - `POST /api/auth/login`
    - Request: `LoginRequest { email, password }`
    - Response: `AuthResponse { token, username, role, profileId, message }`
    - Flow: Performs authentication, generates JWT via `JwtUtil`, resolves the user’s `profileId` via `BuyerProfileService` / `VendorProfileService`.

- **Tender Management (`TenderController`)**
  - `GET /api/tenders/active`
    - Returns a list of `Tender` entities representing all open tenders (for vendors).
  - `GET /api/tenders/{id}`
    - Returns detailed `Tender` information by ID.
  - `GET /api/buyers/tenders/{tenderId}`
    - Returns `TenderUpdateDTO` for buyer update forms, mapping fields from the `Tender` entity (title, categoryId, endDate, etc.) in a null‑safe way.
  - `GET /api/all`
    - Returns a list of `AdminTenderDTO` objects with flattened data for admin dashboards (e.g., tender title, status, category name, buyer organization).
  - `PUT /api/buyers/tenders/{tenderId}`
    - Accepts `TenderUpdateDTO` and updates the selected tender.

- **Buyer & Vendor Management (`BuyerController`, `VendorController`)**
  - Endpoints inferred for:
    - Registering buyers and vendors (`BuyerRegistrationRequest`, `VendorRegistrationRequest`).
    - Fetching and updating profile details (`BuyerProfileResponse`, `VendorProfileResponse`, `BuyerUpdateDTO`, `VendorUpdateDTO`).
    - Resolving profile info by `userId`.

- **Bid Management (`BidController`)**
  - Endpoints inferred for:
    - Submitting a bid to a tender (`BidRequest`).
    - Listing bids for a tender or vendor (`BidResponse`).
    - Updating bid status (admin/buyer driven).

- **Category Management (`CategoryController`)**
  - Endpoints inferred:
    - `POST /api/categories` with `CategoryRequest` to create categories.
    - `GET /api/categories` returning `CategoryResponse` list.

All APIs are designed to:

- Use **DTOs** as contracts, decoupling external payloads from internal entities.
- Enforce validation via `@Valid` and Jakarta Bean Validation annotations.
- Return consistent error envelopes via `GlobalExceptionHandler`.

---

### User Interface Description

- **Design Language**
  - Clean, modern UI built with **TailwindCSS**, **Radix UI**, and **Lucide** icons.
  - Responsive layouts adapted for desktop first, with mobile‑friendly components.

- **Core UI Areas**
  - **Landing / Hero Section** (React component `Hero.tsx` in `bidbridge-frontend`):
    - Introduces the platform value proposition.
    - High‑level CTAs for buyers and vendors (e.g., “Post a Tender”, “Browse Tenders”).
  - **Authentication Screens**
    - Login form with email/password fields.
    - Client‑side validation and clear error messages.
  - **Buyer Dashboard**
    - List of the buyer’s tenders with status, category, and end date.
    - Actions to create a new tender, edit existing ones, and view bid summaries.
  - **Vendor Dashboard**
    - List of active tenders from `/api/tenders/active`.
    - Search/filter by category, organization, and status.
    - Detail pages per tender with description and bidding instructions.
  - **Admin View**
    - Overview list built from `AdminTenderDTO`, showing flattened fields (tender ID, title, status, category name, buyer organization).
    - Useful to monitor the health and usage of the system.

- **Form and Interaction Patterns**
  - Forms built with `react-hook-form` + `zod` for type‑safe validation.
  - Optimistic UI / loading states managed via React Query.
  - Toast notifications via libraries like `sonner` for feedback (success, error, info).

---

### Workflow / User Journey

- **Vendor Journey**
  1. Vendor registers and logs in.
  2. On successful login, they receive a JWT and a resolved `profileId`.
  3. They access the vendor dashboard; the SPA uses the token in an `Authorization` header.
  4. They browse active tenders via `GET /api/tenders/active`.
  5. They open a tender detail view (`GET /api/tenders/{id}`) and submit a bid.
  6. They can return to see bid status updates as `BidStatus` evolves.

- **Buyer Journey**
  1. Buyer registers and logs in as `ROLE_BUYER`.
  2. They create tenders using tender creation forms mapping to `TenderRequest`.
  3. To update a tender, the UI first calls `GET /api/buyers/tenders/{tenderId}` to pre‑fill the update form with `TenderUpdateDTO`.
  4. The buyer submits updates via `PUT /api/buyers/tenders/{tenderId}`.
  5. Buyers monitor bids per tender (via `BidService`/`BidController` endpoints).

- **Admin Journey**
  1. Admin logs in and receives an admin role token.
  2. Admin views all tenders via `GET /api/all`, backed by `AdminTenderDTO`.
  3. Admin can inspect categories, manage users, and react to system‑wide issues.

---

### Challenges Faced and Solutions

- **Cyclic JSON Serialization and Over‑exposed Entities**
  - Problem: Direct serialization of JPA entities with bidirectional relationships (e.g., `Tender` ↔ `BuyerProfile` ↔ `User`) can lead to infinite recursion and overly verbose payloads.
  - Solution: Introduced **DTOs** like `AdminTenderDTO` and `TenderUpdateDTO`, manually mapping only required fields. This avoids cyclic references and gives the frontend a clean, stable contract.

- **Role‑Specific Workflows**
  - Problem: Different roles (buyer, vendor, admin) require distinct views, yet share overlapping models.
  - Solution: Implemented clear controller segmentation (`BuyerController`, `VendorController`, `AdminController`) and strongly typed DTOs per use case. The frontend uses React Router and role metadata from `AuthResponse` to route users accordingly.

- **Profile Resolution upon Login**
  - Problem: Frontend needed a **profileId** for subsequent calls without an extra round trip.
  - Solution: Enhanced `AuthController` to resolve `BuyerProfile` or `VendorProfile` directly after authentication and return a `profileId` in `AuthResponse`, relying on `BuyerProfileService` and `VendorProfileService`.

- **Safe Category and Relationship Handling**
  - Problem: Null categories or profiles could cause `NullPointerException` during DTO mapping.
  - Solution: Added explicit null checks when mapping nested objects (e.g., in `TenderController` when setting `categoryId` and `categoryName`) to ensure robust behavior even with incomplete data.

---

### Performance / Impact Metrics

Conceptual performance and impact targets for BidBridge include:

- **Responsiveness**
  - Frontend optimized with Vite and React for fast initial load and navigation.
  - React Query caches responses to reduce redundant API calls.
  - Async operations (e.g., email notifications) are handled off the main request thread using `@EnableAsync`.

- **Scalability**
  - Stateless backend using JWT allows horizontal scaling (no sticky sessions).
  - Layered architecture enables distribution of services and DB scaling as usage grows.
  - API design supports pagination and filtering extensions (e.g., for large tender/bid lists).

- **Reliability & Data Integrity**
  - Centralized exception handler produces consistent error responses, simplifying frontend handling and observability.
  - Validation at both API boundary (Jakarta validation) and client forms reduces invalid writes.

In a production deployment, these would translate into measurable KPIs such as reduced time‑to‑publish for tenders, reduced manual errors, and improved bid throughput.

---

### Security Considerations

- **Authentication & Authorization**
  - JWT‑based authentication via `AuthController` and `JwtUtil`.
  - Tokens embedded in `Authorization: Bearer <token>` headers on API calls.
  - Role‑based access enforced in `SecurityConfig` using Spring Security authorities.

- **Input Validation**
  - `@Valid` on controller method parameters to enforce DTO constraints.
  - Rejection of malformed or incomplete payloads via standardized error responses.

- **Data Protection**
  - Passwords stored in hashed form (standard Spring Security convention).
  - Role separation ensures:
    - Vendors cannot modify tenders directly.
    - Buyers cannot view or manipulate other buyers’ private data.
    - Admin actions are restricted to privileged users.

- **CORS and Origin Control**
  - `@CrossOrigin(origins = "http://localhost:5173")` limits which frontends can call sensitive endpoints during development.
  - This can be tightened or parameterized for production environments.

- **Error Handling**
  - `GlobalExceptionHandler` ensures no internal stack traces or implementation details leak to the client.
  - Custom exception types map to well‑defined HTTP status codes.

---

### Future Enhancements / Scope

- **Advanced Search & Filtering**
  - Full‑text search on tenders and bids.
  - Filtering by organization type, budget range, geography, and category.

- **Bid Evaluation & Scoring**
  - Configurable evaluation criteria (price, timeline, experience).
  - Automated scoring and ranking of bids.
  - Recommendation engine for shortlisting vendors.

- **Reporting & Analytics**
  - Dashboards for buyers and admins to visualize tender success rates, vendor participation, and lead times.
  - Exportable reports (CSV/PDF).

- **Notifications & Communication**
  - Email and in‑app notifications for tender opening/closing, bid status changes, and clarifications.
  - Message threads between buyers and vendors per tender.

- **Multi‑Tenant & Multi‑Org Support**
  - Tenant isolation for large enterprises managing separate procurement units.
  - Organization‑level settings and branding.

- **Compliance & Audit**
  - Detailed audit logs for tender changes, bid submissions, and evaluations.
  - Compliance reports for regulated sectors (e.g., public procurement).

- **Deployment & DevOps**
  - Containerization with Docker.
  - CI/CD pipelines to automate testing, builds, and deployments.

---

### Conclusion

BidBridge is a structured, full‑stack tender and bidding platform that addresses key pain points in procurement workflows by centralizing tenders, bids, and stakeholder interactions. With a modern React + TypeScript frontend, a robust Spring Boot backend, JWT‑based security, and a well‑normalized data model, it offers a strong foundation for real‑world deployment.

The project’s clean architecture, clear separation of concerns, and DTO‑driven API design make it suitable for showcasing in **resumes**, **academic submissions**, and **professional portfolios**, and it is well‑positioned for further extension into a production‑ready procurement solution.