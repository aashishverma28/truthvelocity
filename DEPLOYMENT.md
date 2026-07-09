# Deployment Guide - Render.com (Stateless with Supabase)

Because we have migrated the database to **Supabase**, your Next.js application is now completely **stateless**. This means you **do not need a paid Persistent Disk** on Render! You can deploy this website completely on **Render's 100% Free Tier**.

Here are the step-by-step instructions:

---

## Step 1: Verify GitHub Code

Your repository is already initialized and pushed:
- **Repository URL:** `https://github.com/aashishverma28/truthvelocity`
- **Branch:** `main`

Render will automatically fetch code from this repository and trigger a new build whenever you push commits to GitHub.

---

## Step 2: Create a Web Service on Render

1. Log in to [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Under the Git provider panel, connect your GitHub account and select your **truthvelocity** repository.
4. Configure the Web Service settings:
   - **Name:** `truth-velocity` (or any custom name)
   - **Region:** Choose a region close to your target audience (e.g. `Singapore` or `Oregon`)
   - **Branch:** `main`
   - **Language:** `Node`
5. Configure the Build and Start commands:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
6. Select the **Free** instance type.

---

## Step 3: Add Environment Variables (CRITICAL)

Next.js needs the Supabase credentials at build time to configure the client library.

1. Go to the **Environment** tab on the left sidebar of your Web Service in Render.
2. Click **Add Environment Variable**.
3. Create the first variable:
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://manysysojmorhuxvfosy.supabase.co`
4. Click **Add Environment Variable** again to create the second variable:
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hbnlzeXNvam1vcmh1eHZmb3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1OTcyNDAsImV4cCI6MjA5OTE3MzI0MH0.VClve94BNb0N0cZcZ_NBwHcqya52zmN0G-W4WJe-5bY`
5. Click **Save Changes**.

---

## Step 4: Deploy

1. Render will automatically start the deployment process after you save the environment variables.
2. Monitor the **Deploy logs**.
3. Once the build completes, Render will provide a public URL (e.g. `https://truth-velocity.onrender.com`).
4. Click the link to access your live website! Any updates you make through the Admin CMS panel (`/admin`) will instantly save to your Supabase cloud database and show up globally.
