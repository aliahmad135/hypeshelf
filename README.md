# HypeShelf

A shared recommendations hub where friends can collect and share the stuff they're hyped about.

## Tech Stack

- Next.js 14+ (App Router)
- Clerk for authentication
- Convex for backend and database
- TypeScript
- shadcn/ui and Tailwind CSS for the UI

## Features

### Public Page
Anyone can browse the latest recommendations. Sign in to add your own.

### Authenticated Experience
Once you're signed in, you can:
- Add recommendations with a title, genre, link, and short blurb
- See all recommendations from everyone
- Filter by genre
- Delete your own recommendations
- See who added each recommendation

### Roles

**Admin:**
- Can delete any recommendation
- Can mark recommendations as "Staff Pick"

**User:**
- Can create recommendations
- Can only delete their own recommendations

The first person to sign up automatically becomes an admin.

## Getting Started

### Prerequisites

You'll need:
- Node.js 18 or higher
- A Clerk account (free tier works fine)
- A Convex account (also free)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Clerk API keys:**
   - Head over to https://dashboard.clerk.com
   - Select your application (or create one)
   - Go to "API Keys" in the sidebar
   - Copy both keys:
     - The publishable key (starts with `pk_test_`)
     - The secret key (starts with `sk_test_`) - keep this one private!
   
3. **Set up the JWT template in Clerk:**
   - In your Clerk dashboard, go to "Configure" → "JWT Templates"
   - Create a new template
   - Name it exactly `convex` (lowercase)
   - In the "Customize session token" section, add a claim:
     - Key: `aud`
     - Value: `convex`
   - Save it

4. **Set up Convex:**
   - Sign up at https://convex.dev if you haven't already
   - Run this in your project directory:
     ```bash
     npx convex dev
     ```
   - It'll ask you to log in and create a project
   - This creates a `.env.local` file with your Convex URL
   - Keep this terminal running - it watches for changes

5. **Add your environment variables:**
   
   Open `.env.local` and add your Clerk keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   ```
   
   The Convex URL should already be there from step 4. Just add your Clerk keys.

6. **Run the app:**
   
   You'll need two terminals:
   
   Terminal 1 (Convex):
   ```bash
   npx convex dev
   ```
   
   Terminal 2 (Next.js):
   ```bash
   npm run dev
   ```
   
   Open http://localhost:3000 in your browser.

7. **Test it out:**
   - Sign up with your email (you'll be the first admin)
   - Add a recommendation
   - Try the genre filter
   - As admin, you can mark things as Staff Picks and delete any recommendation

## Security

All the important security stuff happens on the server side in Convex. The client never sends role information - we check everything server-side. All mutations validate permissions before doing anything.

User roles are stored in Convex and synced when someone signs in. The first user becomes admin automatically.

## Project Structure

```
HypeShelf/
├── app/                    # Next.js pages
│   ├── (public)/          # Public routes
│   └── (authenticated)/   # Protected routes
├── components/
│   ├── ui/                # Reusable UI components
│   ├── public/            # Public page components
│   └── authenticated/     # Dashboard components
├── convex/                # Backend functions and schema
├── lib/                   # Shared utilities and types
└── hooks/                 # React hooks
```

## Troubleshooting

**"Missing NEXT_PUBLIC_CONVEX_URL"**
- Make sure you ran `npx convex dev` first - it creates the `.env.local` file

**"Not authenticated" errors**
- Check that your Clerk keys are correct in `.env.local`
- Make sure the JWT template is named `convex` and has the `aud: convex` claim
- Try signing out and back in after setting up the JWT template

**Convex functions not working**
- Is `npx convex dev` running? It needs to be running for the backend to work

**Can't see admin features**
- Only the first user becomes admin. If you're not the first, you'll need to change your role in the Convex dashboard

**"No auth provider found matching the given token"**
- The JWT template needs the audience claim. Make sure you added `aud: convex` in the template settings
- Sign out and back in after making changes

## Development Notes

To add a new genre, edit `lib/constants.ts` and add it to the genres array with a label and color.

To change role permissions, edit the mutation handlers in `convex/recommendations.ts`.
