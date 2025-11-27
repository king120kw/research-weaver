# Research Weaver

A multi-modal AI-powered research writing platform for academic excellence.

## How to Edit This Code

**Use your preferred IDE**

Clone this repo and push changes to update the project.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Build and deploy the project using standard deployment tools for your hosting platform.



## OAuth Configuration

To enable Google and Facebook login, you must configure the providers in your Supabase Dashboard.

### Google OAuth
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Select **Web application**.
6. Add the following **Authorized redirect URI**:
   ```
   https://wripeviofzxghjdouifk.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**.
8. Go to your **Supabase Dashboard > Authentication > Providers > Google**.
9. Enable Google, paste the Client ID and Secret, and save.

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/).
2. Create a new App (Select "Authenticate and request data from users with Facebook Login").
3. In the App Dashboard, go to **Facebook Login > Settings**.
4. Add the following **Valid OAuth Redirect URI**:
   ```
   https://wripeviofzxghjdouifk.supabase.co/auth/v1/callback
   ```
5. Go to **Settings > Basic** to find your **App ID** and **App Secret**.
6. Go to your **Supabase Dashboard > Authentication > Providers > Facebook**.
7. Enable Facebook, paste the App ID and Secret, and save.

### Important: Redirect URLs
For the login to work locally, you must also add your local URL to the **Redirect URLs** whitelist in Supabase:
1. Go to **Supabase Dashboard > Authentication > URL Configuration**.
2. Under **Redirect URLs**, add:
   ```
   http://localhost:8080/**
   ```
3. Click **Save**.
