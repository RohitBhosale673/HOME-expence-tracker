# PROJECT REPORT
# ON
# “HOME EXPENSE TRACKER SYSTEM”

### Submitted By
1) [YOUR NAME] (ROLL N0. [YOUR ROLL NUMBER])
2) [YOUR PARTNER'S NAME] (ROLL NO. [PARTNER'S ROLL NUMBER])

### IN PARTIAL FULLFILLMENT OF
**BACHELOR OF SCIENCE (COMPUTER SCIENCE)**
For
**SHRI CHHATRAPATI SHIVAJI MAHAVIDYALAYA COLLEGE OF ARTS, COMMERCE & SCIENCE COLLEGE, SHRIGONDA.**
**NAAC RE-ACCREDITED: A+ GRADE**

### Affiliated To
**SAVITRIBAI PHULE PUNE UNIVERSITY**
**ACADEMIC YEAR 2025-26**
**Department of B.C.S.(C.S.)**

---

## Certificate

This is to certify that project entitled **“HOME EXPENSE TRACKER SYSTEM”** is submitted by –

**[YOUR NAME]** (ROLL N0. [YOUR ROLL NUMBER])
**[YOUR PARTNER'S NAME]** (ROLL NO. [PARTNER'S ROLL NUMBER])

Students of Bachelor of Computer Science Department, Shri Chhatrapati Shivaji Mahavidyalaya College of arts, commerce & science, Shrigonda in fulfilment of the requirement for the Bachelors of Business Administration(Computer Science) Degree of Savitribai Phule Pune University , is a record of students own study carried under my supervision and guidance.

<br/>
<br/>

**Prof. A.B.Borade** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Prof. A.B.Borade**
**Project Guide** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Head of Department**

<br/>

**Internal Examiner Date:-** ________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Examiner Date :-** ________________

---

## Acknowledgement

I have taken efforts in this project. However, it would not have been possible without the kind support and help of my faculty members and friends. I would like to extend my sincere thanks to all of them. 

I am highly indebted to **Prof. A.B.Borade** for their guidance and constant supervision as well as for providing necessary information regarding the project & also for their support in completing the project. I am extremely thankful to him for providing such a nice support and guidance, although he had a busy schedule managing the corporate affairs.

I would like to express my gratitude towards my parents & member of Shri Chhatrapati Shivaji Mahavidyalaya College of Arts, Commerce & Science for their kind co-operation and encouragement which help me in completion of this project.

I am thankful to and fortunate enough to get constant encouragement, support and guidance from all Teaching staffs of the Computer Science Department which helped us in successfully completing our project work.

---

## Abstract

The Home Expense Tracker System is a robust web-based application designed to streamline the process of monitoring, managing, and categorizing construction and home-related expenses for users. This system provides a fully private, offline-capable platform where users can log their daily transactions, categorize them smartly by material type (e.g., Cement, Plumbing, Electrical), and visualize their total expenditures against pre-defined budget limits. 

For the user, the system functions entirely on the client-side utilizing IndexedDB, guaranteeing exceptional data privacy and preventing data leakage across multiple users. It is designed to act as an all-in-one ledger offering comprehensive management tools such as managing contractor payments, uploading and encoding progress photos and receipts, generating dynamic visual feedback on budget constraints, and exporting complete budget reports via PDF. Features like 'Load Dummy Data' and 'Clear Data' also offer rapid verification of system capabilities.

By automating local data storage, the system enhances accurate budgeting, ensures data isolation, and provides a convenient, paperless analytical dashboard for users balancing large expenditures. 

**Key Features:**
- Complete Data Privacy using browser-native IndexedDB.
- Offline-capable Transaction & Category tracking.
- Secure, Base64-encoded receipt and photo gallery management.
- Real-time analytical Dashboard with budget limit validation.
- Automated Contractor Ledger generating distinct payment summaries.
- PDF Report generation for all aggregated category data.

This system aims to simplify complex budget tracking, increase analytical efficiency, and provide a secure, seamless experience without server-side vulnerabilities.

---

## Objective

The primary objective of the Home Expense Tracker System is to provide a highly secure, efficient, and user-friendly platform that simplifies the process of tracking large-scale project budgets for typical users. The system aims to:

1. **Ensure Absolute Data Isolation:** Store all transactions and user interactions natively in the browser via IndexedDB so that personal financial data is never exposed to a central server or shared erroneously with other users.
2. **Streamline Expense Categorization:** Offer users an easy-to-use graphical interface where expenses can be grouped logically by type (e.g., electrical, steel, labor) against configurable budget caps.
3. **Enhance Analytical Reporting:** Generate real-time comparative metrics showing total budget vs. total spent natively within a Dashboard, and providing a tool to export detailed transaction reports straight into PDF format for external use.
4. **Digitize Receipt and Image Tracking:** Eliminate paper clutter by allowing users to upload and base64 encode billing receipts and progress photos natively into local storage, providing visual proofs alongside financial entries.
5. **Manage Contractor Payments:** Equip the user with an automated ledger system that dynamically aggregates and tracks exactly how much has been paid uniquely to distinct vendors and contractors over time.

---

## Purpose

The purpose of the Home Expense Tracker System is to revolutionize how individuals monitor and track heavy home-building and renovation capital by providing a modern, digital solution that automates analytical calculations locally without relying on vulnerable cloud storage.

Key purposes include:
1. **Convenience for Customers:** Allow users to rapidly input expenses (via forms capturing Date, Amount, Payment Mode, and Contractor Info) entirely offline or from any browser with zero login friction.
2. **Elimination of Notebook Ledgers:** Provide users with a streamlined platform to replace manual tracking, thereby eliminating the reliance on pen-and-paper processes and minimizing mathematical errors mathematically.
3. **Data Security and Anonymity:** Ensure maximal customer privacy protection. Unlike cloud competitors, this product intentionally lacks a server payload; it exists natively inside the browser instance interacting strictly via local IndexedDB tables.
4. **Enhanced Visual Feedback:** Provide instant alerts when an expense exceeds a preset budget boundary, offering automated color-changing visual feedback (green/amber/red UI indicators).
5. **Report Archiving:** Facilitate safe and reliable extraction of analytical data straight to PDF so that contractors and family members can be notified of remaining capital and budget burn rates.

---

## Scope

The Home Expense Tracker System is a progressive web platform targeted toward homeowners, self-builders, and casual budgeters. It is an isolated desktop-class platform designed to log daily financial constraints efficiently. The scope covers the following:
- Managing a dynamic array of custom expense categories.
- Logging structured transaction data (amount, description, date, receipt).
- Handling vendor histories (Contractor Ledger).
- Managing visual history via a Progress Photo Gallery.
- Performing fast exports to JS-based PDF reporting files.
- Providing immediate dummy-fill testing facilities.

It completely bypasses traditional relational network databases by utilizing IDB-Keyval libraries, restricting its scope specifically to the immediate device context—maximizing speed and anonymity.

---

## Introduction

The Home Expense Tracker is a browser-based application that offers users an innovative solution, modernizing personal finance operations in a reliable, network-agnostic, and efficient manner. This application provides a beautifully designed React-based interface allowing users to orchestrate a digital budget without technical knowledge.

Users can seamlessly navigate between distinct application pages (Dashboard, Reports, Contractors, Gallery) acting like specialized toolsets. By merely submitting a form, IndexedDB records the data instantly and prompts recalculation algorithms to display the newly formulated totals. 

Given the user-centric architecture, the app comprises fundamental client-side modules rather than traditional Admin/Sub-admin layers:

**User Modules:**
1. **Dashboard:** The central nervous system showing 'Total Spent', 'Total Budget', 'Recent Expenses' and visual progress bars. Features the 'Load Dummy Data' and 'Clear Data' mechanics.
2. **Reports:** An analytical view presenting categorized breakdowns, sort/search features, remaining budget figures, and an execution trigger for exporting tables into professional PDF files.
3. **Contractors Ledger:** Automatically maps unique contractor labels attached to transactions, parsing them into aggregated sums showing exactly how much capital each contractor has processed.
4. **New Expense/Transactions Form:** An input interface supporting strict type protections, file selections mapping to base64, and dropdown dependencies dynamically adjusting to active categories.
5. **Site Gallery:** A visual timeline utilizing the browser's FileReader API to natively convert and store local system images directly inside the application's memory for layout viewing and description editing.

---

## Requirement Specification

### Hardware Configuration

**Minimum System Requirements:**
- **RAM:** 2 GB Minimum (4 GB Recommended for Base64 Image Processing)
- **Hard Disk:** 500 MB Free Space (Local Storage Allocation)
- **Processor:** 1.5 GHz Dual Core or higher

### Software Requirement

- **Web Browser:** Google Chrome, Mozilla Firefox, Microsoft Edge, Safari (ES6 and IndexedDB compatible).
- **Operating System:** Windows 10/11, macOS, Linux, Android/iOS.
- **Framework & Libraries:** Next.js 14, React 18, Tailwind CSS, Lucide React, idb-keyval, jsPDF, jsPDF-autotable.
- **Development Environment:** Node.js v18+, NPM/Yarn.

---

## Theoretical Background

### Next.js & React
Next.js is a powerful React framework developed by Vercel that allows for the creation of robust, fast, and highly scalable web applications. In the context of this project, it is utilized primarily for its powerful App Router structure and its capacity for rapid client-side rendering (using the 'use client' directive). React provides the foundation of component-based UI organization, ensuring the page never has to artificially refresh upon submitting new financial data.

### IndexedDB & idb-keyval
IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files and blobs. It is crucial for offline-first applications. Because vanilla IndexedDB relies heavily on callbacks and complex object stores, this project utilizes `idb-keyval`, a super-simple, Promise-based wrapper that interacts with IndexedDB, abstracting transactions to behave identically to standard key-value setups but with massive storage capabilities.

### Tailwind CSS
Tailwind CSS is an open-source, utility-first CSS framework. It is the primary stylistic engine used to shape the look and feel of the Home Expense Tracker. It allows for the rapid creation of custom designs (including responsive grid designs, glassmorphous buttons, dynamic hover states, and color indicators) directly inside the JSX components.

### jsPDF
jsPDF is a robust client-side JavaScript library to generate PDF documents. In combination with the `jspdf-autotable` plugin, it enables the extraction of dynamic internal JavaScript object data (budget reports) into structured, stylized PDF grids entirely inside the user's browser without transferring data to a third-party server.

---

## Analysis and Design

### Analysis
Prior to implementation, manual home expenditures are often maintained disjointedly on physical registers or disorganized spreadsheets. Generating a fast category-based report (for example, finding exactly how much was spent on "Labor") involves manually parsing and aggregating lines.
**Disadvantages of present (manual) system:**
- Data loss vulnerabilities due to lack of backups or paper degeneration.
- Calculation inaccuracies occurring during manual aggregation.
- Inability to instantly view comparisons between budget goals and actual burn rates.
- Difficulty keeping physical receipts aligned sequentially with written registers.

### Design Introduction
Design translates requirements into structured, implementable models. The preliminary design transforms business logic to data. For a client-scoped local architecture like the Home Expense Tracker, system design relies heavily on functional behavior states managed locally. 

### UML Diagrams

**Actor:** The sole actor in this architecture is the "User" (Homeowner / Manager), given that the system inherently revolves around total data isolation.

**Use Case Diagram Outline:**
1. **User** -> *Manage Categories* (Add, Edit, Delete Category)
2. **User** -> *Manage Transactions* (Add Expense, Upload Receipt, Edit, Delete)
3. **User** -> *View Dashboard* (Load Dummy Data, Clear Data)
4. **User** -> *Generate Reports* (Search/Sort Data, Download PDF)
5. **User** -> *Manage Gallery* (Upload Base64 Photo, Update Description)
6. **User** -> *View Contractor Ledgers*

### Data Models & Relationships (Logical ER Equivalent)
Though the project relies on a NoSQL Key-Value object store native to the browser, the logical representation maps strictly to relational principles:

**Entity: Categories**
- id (Primary Key)
- name (String)
- budget_limit (Number)
- icon (String)
- created_at (Timestamp)

**Entity: Transactions**
- id (Primary Key)
- category_id (Foreign Key -> Categories.id)
- amount (Number)
- date (Date)
- description (String)
- payment_mode (String format: Cash/UPI/Bank)
- contractor_name (String - Optional)
- receipt_url (String Base64 - Optional)
- created_at (Timestamp)

**Entity: Progress Photos**
- id (Primary Key)
- image_url (String Base64)
- description (String)
- uploaded_at (Timestamp)

*Relationships:*
A **Category** has a *One-to-Many* relationship with **Transactions**. 
A **Contractor** (Derived attribute) has a *One-to-Many* relationship with **Transactions**.

### Data Flow Diagram (DFD)

**Zero Level DFD:**
- Entities: [USER]
- Process: (Home Expense Management System)
- Data Stores: [IndexedDB Native Storage]
- *Flow:* User submits expense data to System, System executes internal math aggregations, System pipes final statistical readout back to User Interface. System requests storage updates to IndexedDB. IndexedDB routes saved payloads to the System upon initialization.

---

## Database Design

The data in the system has to be stored and retrieved efficiently. Data elements and structures to be stored have been identified at the analysis stage. Because absolute privacy was the core parameter, standard MYSQL server routing was replaced by standard HTTP IndexedDB.

The Local database uses 3 core table groupings inside the browser storage (under keys):
1. `buildtrack_categories`
2. `buildtrack_transactions`
3. `buildtrack_photos`

**Categories Table Schema Details:**
Stores the limits and icons utilized to format the system visually. Requires Name and numerical constraints. When deleted, associated logic triggers a cascade deletion of associated transactions.

**Transactions Table Schema Details:**
Stores the quantitative load of the application. Amount variables are strictly typed as Numbers. Receipts are converted upon upload from binary Files into lightweight, globally compatible Base64 strings, ensuring the database parses imagery without utilizing local machine file directories.

**Photos Table Schema Details:**
Stores chronological project timeline statuses, supporting large base64 image strings heavily compressed visually prior to injection.

---

## Design Implementation and Results

*(Note for formatting: As requested by college standards, take manual screenshots of your fully functioning application and insert them beneath the following headings inside your final Word Document prior to printing).*

**1. Main Dashboard View**
Represents the primary landing grid, featuring mathematical totalization logic, percentage-based progress bars turning Red when budgets are exceeded, and recent transactions populated instantly. *(Insert Screenshot Here)*

**2. New Expense Entry Form**
Displays the validated input structure mapping categorized dropdowns, payment method selectors, and visually distinct drag-and-drop file uploaders utilizing FileReader rendering. *(Insert Screenshot Here)*

**3. Reports View UI**
A deeply organized list mapping category limits mapped directly against total amounts extracted. The section prominently features the "Download PDF" logic trigger alongside search bars. *(Insert Screenshot Here)*

**4. Contractor Ledger View**
An algorithmically generated view parsing unique strings defined in transactions out into standalone table rows mapping transactional behavior isolated per Vendor/Contractor. *(Insert Screenshot Here)*

**5. Site Gallery Panel**
A modern photo gallery displaying zoom-capable image inputs representing stored Base64 progress checks alongside editable descriptors. *(Insert Screenshot Here)*

**6. Exported PDF Output Result**
A snapshot of the output executed via `jsPDF`, demonstrating grid generation and header styling automatically generated client-side containing financial proofs offline. *(Insert Screenshot Here)*

---

## Conclusion

The Home Expense Tracker System was designed in such a robust, client-first manner that future modifications can be done swiftly without concern for cloud API breakdown. The following conclusions can be deduced from the development of the project:

- Complete local isolation guarantees unparalleled data privacy; user data can never be externally intercepted because there is no external connection.
- Automation of the expenditure formulas vastly improves calculation efficiency over paper management.
- Dynamic React-based Graphical User Interfaces drastically reduce input errors associated with typing.
- Image encoding utilizing native binary-to-string conversion enables rich media storage directly in-memory, solving historical problems surrounding image retention in offline environments.
- Report exporting via JS parsing allows the system to act authentically as a mature enterprise tool directly from the consumer's web browser.
- The use of dummy data injection and rapid data clearance demonstrates high system scalability and testing flexibility.

---

## Bibliography

1. **Next.js Documentation** - https://nextjs.org/docs
2. **React Official Guides** - https://react.dev/
3. **Tailwind CSS Utility Classes** - https://tailwindcss.com/docs
4. **MDN Web Docs (IndexedDB API)** - https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
5. **idb-keyval Github Utility** - https://github.com/jakearchibald/idb-keyval
6. **jsPDF and AutoTable Documentation** - https://artskydj.github.io/jsPDF/docs/jsPDF.html
7. **Lucide React Icons** - https://lucide.dev/
