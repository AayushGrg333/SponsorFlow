# SponsorFlow - Influencer & Brand Sponsorship Platform

SponsorFlow is a platform designed to connect brands and influencers for sponsorship and collaboration opportunities. Companies can find influencers tailored to their product type, while influencers can discover brands that match their niche.

### Features
- **Company Profiles**: Companies can create profiles detailing their products, target audience, and marketing needs.
- **Influencer Profiles**: Influencers can showcase their content type, past collaborations, social media reach, and experience.
- **Category-Based Matching**: Companies and influencers can be matched based on shared categories (e.g., skincare, tech, gaming).
- **AI-Powered Matchmaking (Coming soon)**: A feature to suggest the best matches between brands and influencers based on their profiles.
- **Messaging**: Companies and influencers can communicate and discuss collaboration details.
- **Payment Integration (Coming soon)**: Once a collaboration is finalized, users can make payments through the platform.

### Tech Stack
- **Frontend**: Next.js (React-based framework with server-side rendering)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (for storing company and influencer profiles)
- **Payment Integration**: Stripe 
- **Messaging**: Socket.io (for real-time communication)
- **AI Integration**: Gemini API (for AI-powered matchmaking)

### Getting Started

#### Prerequisites
Ensure you have the following installed:
- Node.js (Version 14 or higher)
- npm (or Yarn / pnpm)

#### Steps

##### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/sponsorflow.git
cd sponsorflow
```

##### 2. Install Dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

##### 3. Set Up Environment Variables
Create a .env file in the root directory and add the following:
```plaintext
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
GEMINI_API_KEY=your_gemini_api_key (if using Gemini API)
```
Make sure to replace the placeholders with your actual keys and URIs.

##### 4. Start the Development Servers

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run dev
```

After running the above commands, you can access the platform at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Contributing
We welcome contributions to improve SponsorFlow! Here's how you can contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

### Learn More
Explore these resources to dive deeper into SponsorFlow and the technologies used:
- [Next.js Documentation](https://nextjs.org/docs): Official documentation for Next.js features and API.
- [MongoDB Documentation](https://docs.mongodb.com): For integrating MongoDB with Next.js and using MongoDB features.
- [Stripe Documentation](https://stripe.com/docs): To learn about payment integration with Stripe.
- [Socket.io Documentation](https://socket.io/docs): For real-time messaging and communication.
- [Gemini API Documentation](https://gemini.com/docs): For AI-powered matchmaking integration.

### Deploy on Vercel
Deploying SponsorFlow to Vercel is simple. Follow these steps:
1. Go to Vercel and link your GitHub repository.
2. Deploy the app following the instructions provided by Vercel.
3. Your app will be live on a Vercel URL within moments.

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).
