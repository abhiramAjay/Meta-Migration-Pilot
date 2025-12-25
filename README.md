# 🎵 Meta Migration Pilot (MMP)

![Status](https://img.shields.io/badge/Status-Prototype_Complete-success)
![Java](https://img.shields.io/badge/Backend-Java_Spring_Boot-orange)
![Angular](https://img.shields.io/badge/Frontend-Angular_17-red)
![Docker](https://img.shields.io/badge/Deployment-Docker_Compose-blue)

## 🚀 Executive Summary

The **Meta Migration Pilot** is a strategic Proof of Concept (PoC) designed to simulate the modernization of legacy music metadata systems.

In the music technology sector, vast amounts of copyright and royalty data reside on aging mainframe infrastructure. This project demonstrates a **"Strangler Fig" migration pattern**, allowing users to interact with a unified backend through both a **Legacy Command Line Interface (CLI)** and a **Modern Cloud-Native Dashboard**.

This application proves that legacy data structures can be successfully mapped to modern microservice architectures without data loss, featuring real-time synchronization between the two environments.

---

## 📸 System Views

### 1. The Legacy Environment (Mainframe)
*Simulates the existing 1980s infrastructure used by many rights organizations.*
*(Add a screenshot here: `![Legacy View](screenshots/legacy.png)`)*

### 2. The Modern Dashboard (Cyberdeck)
*The target state: A responsive, Angular-based data visualization platform.*
*(Add a screenshot here: `![Modern View](screenshots/modern.png)`)*

---

## ⚡ Key Features

### 🛡️ Dual-Mode Interface
* **Legacy Terminal:** A fully functional CLI that mimics DB2 mainframe interaction. Supports commands like `LIST`, `SEARCH`, `FILTER`, and `STATUS`.
* **Modern Dashboard:** A futuristic "Cyberdeck" UI featuring glassmorphism, HUD analytics, and grid layouts.
* **Real-Time Sync:** Changes made in the Modern view (updates/deletes) are instantly reflected in the Legacy terminal queries.

### 🎧 Interactive Media Integration
* **Live Audio Preview:** Integrated with the **iTunes Public API** to fetch and play 30-second samples of artist tracks upon hover.
* **Smart Caching:** Implemented a lazy-loading strategy to minimize API calls and reduce latency.
* **Genre-Based Fallback:** Automatic algorithmic fallback to genre-specific loops for artists not found in the public database.

### ⚙️ Administrative Control (CRUD)
* **Metadata Management:** Full "Edit Mode" allows authorized users to modify artist metadata (Name, Genre, Stream Counts).
* **Data Purge:** Secure deletion protocols to remove obsolete records from the PostgreSQL database.
* **Bulk Ingestion:** Capable of handling 600+ records with client-side pagination and filtering.

---

## 🛠️ Technical Architecture

### Backend (Java Spring Boot)
* **Framework:** Spring Boot 3.2 (Java 17)
* **Data Access:** Spring Data JPA with Hibernate
* **API:** RESTful endpoints for CRUD operations (`/api/artists`)
* **Database:** PostgreSQL 15 (Containerized)

### Frontend (Angular)
* **Framework:** Angular 17 (Standalone Components)
* **Styling:** SCSS with CSS Variables for dynamic theming
* **State Management:** RxJS Observables for reactive data streams
* **Network:** Angular `HttpClient` with JSONP support for CORS-restricted APIs

### DevOps & Deployment
* **Containerization:** Fully Dockerized application (Frontend + Backend + Database).
* **Orchestration:** `docker-compose` for one-command startup.

---

## 🔧 Installation & Setup

### Prerequisites
* Docker & Docker Compose installed.

### Quick Start
1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/meta-migration-pilot.git](https://github.com/YOUR_USERNAME/meta-migration-pilot.git)
    cd meta-migration-pilot
    ```

2.  **Launch the System**
    ```bash
    docker-compose up --build
    ```

3.  **Access the Application**
    * **Frontend UI:** `http://localhost:4200`
    * **Backend API:** `http://localhost:8080/api/artists`
    * **Database Port:** `5432`

---

## 🧪 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/artists` | Retrieve all artist records |
| `POST` | `/api/artists` | Create a new artist record |
| `PUT` | `/api/artists/{id}` | Update existing metadata |
| `DELETE` | `/api/artists/{id}` | Permanently remove a record |

---

## 👨‍💻 Developer Notes

**Why this project exists:**
Migrating from on-premise mainframes to the cloud is the #1 challenge in Music Tech today. This pilot demonstrates my ability to understand "Old World" data constraints while building "New World" user experiences.

**Future Roadmap:**
* [ ] Implement JWT Authentication for Admin routes.
* [ ] Add batch processing for royalty calculation simulation.
* [ ] Deploy to AWS ECS using Terraform.

---

*(c) 2025 Meta Migration Pilot. Built for the future of Music Tech.*
