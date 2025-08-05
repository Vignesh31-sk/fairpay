# FairPay - Voice-First Job Platform for India

A React Native app built with Expo that helps low-income and blue-collar workers in India find fair jobs, manage grievances, and view job analytics through a voice-first interface.

## 🚀 Features

### Voice-First Navigation

- **Voice Hub (Home)**: Central hub with microphone button for voice commands
- **Voice Commands**: Navigate using natural language like "Show me jobs", "Go to profile", etc.
- **Speech Recognition**: Uses expo-speech-recognition package for real-time voice processing

### Screens & Functionality

#### 📱 Voice Hub (Home)

- Large microphone button to start listening
- Voice status indicator with visual feedback
- Quick action cards showing available voice commands
- Real-time transcript display
- Help section with usage instructions

#### 👤 Profile Screen

- User profile with dummy data (राहुल शर्मा)
- Contact information and work experience
- Rating and completed jobs statistics
- Member since information

#### 💼 Jobs Screen

- Display of 6 hardcoded dummy job listings
- Voice search functionality ("search for electrician jobs")
- Category filters with chips
- Search bar for text-based filtering
- Job application simulation via voice commands

#### 📊 Analytics Screen

- Key statistics cards (Total Jobs, Applications, Grievances)
- Interactive pie chart showing jobs by category
- Bar chart for job distribution
- Summary insights with key metrics

#### 📝 Grievance Screen

- Voice-based complaint filing system
- Modal form with category and urgency selection
- Voice note recording simulation
- List of submitted grievances with status tracking
- FAB button for quick grievance filing

## 🎯 Voice Commands Supported

### Navigation

- "Go to profile" / "Show me profile" / "Open profile"
- "Show me jobs" / "Open jobs" / "Find jobs"
- "Open analytics" / "Show analytics" / "Show stats"
- "File a complaint" / "Raise grievance" / "Report issue"

### Job Search

- "Search for electrician" / "Find electrician jobs"
- "Search for plumber" / "Find plumber jobs"
- "Search for construction" / "Find construction jobs"
- And similar for mechanic, welder, carpenter

### Job Actions

- "Apply for job" / "Apply for this job"
- "Apply for plumbing job" / "Apply for electrician job"

## 🛠️ Tech Stack

- **React Native** with **Expo SDK 53**
- **React Navigation** for routing
- **React Native Paper** for Material Design UI
- **expo-speech-recognition** for voice processing
- **react-native-chart-kit** for analytics charts
- **react-native-svg** for chart rendering
- **TypeScript** for type safety

## 📱 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Expo Go app on your mobile device or Android/iOS simulator

### Installation

1. Clone and navigate to the project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app or run on simulator:
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   ```

## 🎮 Usage

1. **Start on Voice Hub**: The app opens to the main Voice Hub screen
2. **Tap Microphone**: Press the large microphone button to start listening
3. **Speak Commands**: Say any of the supported voice commands clearly
4. **Auto Navigation**: The app will automatically navigate to the requested screen
5. **Explore Features**: Try different voice commands to explore all functionality

## 📋 Dummy Data

The app includes realistic dummy data for Indian job market:

### Jobs (6 listings)

- Electrician (Mumbai) - ₹25K-35K
- Plumber (Delhi) - ₹20K-30K
- Construction Worker (Bangalore) - ₹18K-25K
- Mechanic (Pune) - ₹22K-32K
- Welder (Chennai) - ₹24K-34K
- Carpenter (Hyderabad) - ₹20K-28K

### Analytics

- 156 total jobs across categories
- 42 applications submitted
- Job distribution charts
- Grievance tracking (8 total, 5 resolved)

### Grievances

- Payment issues, job mismatches, safety concerns
- Status tracking (pending, in progress, resolved)
- Voice note recording capability

## 🔧 Project Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Voice Hub (Home)
│   ├── profile.tsx        # User Profile
│   ├── jobs.tsx          # Job Listings & Search
│   ├── analytics.tsx     # Analytics Dashboard
│   ├── grievance.tsx     # Grievance Management
│   └── _layout.tsx       # Tab Navigation Layout
├── _layout.tsx           # Root Layout with Paper Provider
constants/
├── Data.ts              # Dummy data and voice commands
├── Colors.ts            # Theme colors
types/
└── index.ts             # TypeScript interfaces
hooks/
└── useVoiceProcessing.ts # Voice recognition logic
components/              # Reusable UI components
```

## 🎯 Features Not Implemented (Future Scope)

- User authentication and KYC
- Backend API integration
- Real job data from external APIs
- Push notifications for job matches
- Real voice note storage
- Multi-language support (Hindi, regional languages)
- Offline functionality
- Job application tracking
- Employer portal

## 🎨 Design Highlights

- **Material Design 3** with React Native Paper
- **Voice-first UX** with clear audio cues
- **Accessibility-focused** with large touch targets
- **Indian context** with local job categories and salary ranges
- **Progressive disclosure** with intuitive information hierarchy

## 🚀 Next Steps

1. Add voice synthesis for audio feedback
2. Implement Hindi language support
3. Add more sophisticated NLP for command parsing
4. Connect to real job APIs
5. Add user onboarding flow
6. Implement push notifications
7. Add map integration for location-based jobs

---

**Note**: This is a prototype focusing on voice-first navigation and UI/UX. No backend connectivity or authentication is implemented - the app works entirely with dummy data for demonstration purposes.
