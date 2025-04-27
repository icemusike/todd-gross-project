# Web Overlay System

A responsive web overlay system that allows users to create and share overlays for any website via URL.

## Features

- Create and manage overlay content with videos, images, and text
- Share overlays via URL without modifying the target website
- Responsive design that works on all screen sizes
- Local storage for saving and managing overlays
- Direct access for testing without login

## How It Works

1. Users create an account or use direct access
2. They create overlay content with videos, images, and text
3. They specify the target website URL where the overlay should appear
4. The system generates a shareable URL
5. When someone visits the shareable URL, they see the target website with the overlay displayed on top

## Setup Instructions

1. Clone this repository
2. Run `pnpm install` to install dependencies
3. Run `pnpm run dev` to start the development server

## Usage

### Quick Access Options

- **Demo Account**: Click "Try Demo Account" to log in with pre-filled credentials
- **Direct Access**: Click "Direct Access (No Login)" to bypass the login screen entirely

### Creating an Overlay

1. Access the dashboard using one of the methods above
2. Click "Create New Overlay"
3. Enter a title and target website URL
4. Add content sections (text, images, videos)
5. Save your overlay

### Sharing an Overlay

1. From the dashboard, find the overlay you want to share
2. Click the "Share" button
3. Copy the generated URL
4. Share this URL with your audience

When someone visits this URL, they will see the target website with your overlay displayed on top.

## Technical Details

- Uses local storage for data persistence
- No server-side dependencies or configuration needed
- Sample data is automatically created on first run
- All overlays are stored in the browser's local storage

## License

MIT
