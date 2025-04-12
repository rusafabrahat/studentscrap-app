# StudentScrap: A Visual To-Do List

## description
Overview of the Concept:
The web application aims to be akin to that of a Pinterest/Polyvore type collage page to mix aesthetics with productivity. Students can upload and/or select PNG images and have each image correspond to a to-do list item. This makes for a visual list embodying the user’s mood and project(s). The actual goal is to make studying or tasks much more engaging as well as motivational for people.


## features of the app
- Drag and drop image uploads
- The user interface allows users to create visual task items through image integration with text content.
- Users can manage task sequence using interactive drag-and-drop functionality among other items.
- The application implements an adaptive design which adapts to show perfectly on every screen size.
- Persistent data storage

## technical components
- Frontend: HTML + CSS for proper code structure and stylised aspects. JavaScript and React.js for the dynamic parts
- Backend: Node.js + Express.js (a RESTful API)
- Database: MongoDB

## installation
1. Clone this repository
2. The first step is to run 'npm install' inside the project root directory.
3. Users can instal frontend dependencies by navigating to client using cd command followed by npm instal command.
4. The application requires a 'server/uploads' folder to store images.

## running the appl
1. Run 'npm start' from the root folder
2. You will access the frontend through 'http://localhost:3000' after it launches in your browser.
3. The backend will run on 'http://localhost:5000'

## architecture documentation
The application uses a client-server structure for its operation.
- Frontend: React-based single-page application
- Backend: Node.js along with Express operates the backend through their REST API function.
- Database: MongoDB for data persistence
- Image storage: Cloudinary

## design choices:
The application employs React because its components along with state management capabilities made them suitable.
The choice of MongoDB due to compatiility and password security.
Users can drag files within the system for both file upload operations and task reorganisation through drag-and-drop interfaces.
The application uses CSS Grid and Flexbox for responsive design.