# Welcome to your Lovable project

## Project Information

### Project URL

[Lovable Project](https://lovable.dev/projects/ac8297d1-7da1-4672-b42f-263b1dc5dd96)

## How can I edit this code?

There are several ways of editing your application.

### Using Lovable

1. Visit the [Lovable Project](https://lovable.dev/projects/ac8297d1-7da1-4672-b42f-263b1dc5dd96)
2. Start prompting to make changes

Changes made via Lovable will be committed automatically to this repo.

### Using Your Preferred IDE

1. Clone this repository
2. Make your changes locally
3. Push changes to the repository
4. Changes will be reflected in Lovable

## Load Testing

This project includes load testing using [k6](https://k6.io/). To run the load tests:

1. Install k6: <https://k6.io/docs/get-started/installation/>

2. Copy the example environment file and update with your test credentials:

   ```bash
   cp load-testing/.env.example load-testing/.env
   ```

   Edit the `.env` file and add your test user credentials.

3. Run the load tests:

   ```bash
   cd load-testing
   k6 run k6-load-test.js
   ```

4. For running with specific environment variables:

   ```bash
   k6 run -e TEST_USER_1_EMAIL=user@example.com -e TEST_USER_1_PASSWORD=yourpassword k6-load-test.js
   ```

## Security Notes

### Environment Variables

- Never commit the `.env` file
- Always add `.env` to your `.gitignore`

### Test Accounts

- Use dedicated test accounts only
- Grant minimal required permissions
- Rotate credentials regularly

## Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- Recommended: Install using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)

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

**Edit a file directly in GitHub

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces

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

Simply open [Lovable](https://lovable.dev/projects/ac8297d1-7da1-4672-b42f-263b1dc5dd96) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
