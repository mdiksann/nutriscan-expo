# NutriScan

NutriScan is a high-performance, user-centric mobile application designed for daily nutritional tracking. The application leverages Artificial Intelligence (AI) to simplify caloric and macronutrient logging via image recognition, providing users with a seamless and intuitive experience to maintain their dietary goals.

## Core Features

### 🍽️ Food & Nutrition Logging
- **AI-Powered Image Recognition:** Take a photo of your meal and let AI identify the food items and calculate nutritional data.
- **Manual Entry:** Search a comprehensive database to log food items manually.
- **Macronutrient Tracking:** Real-time tracking of Calories (kcal), Protein (g), Fats (g), and Carbohydrates (g).
- **Daily Log:** A chronological view of all meals consumed within a 24-hour period.

### 📊 Reporting & Analytics
- **Weekly Summaries:** Automated generation of weekly reports highlighting nutritional trends, average caloric intake, and macronutrient distribution.
- **Progress Visualization:** Graphical representations of daily vs. weekly goals.

## Technology Stack

- **Frontend:** React Native (Expo)
- **AI Integration:** Google Gemini Vision API for food imagery processing
- **Design:** Premium Neumorphic UI focusing on "one-tap" actions

## Getting Started

### Prerequisites
- Node.js installed
- Expo CLI (`npm install -g expo-cli`)
- A Google Gemini API Key

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd nutriscan-expo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `nutriscan-expo` directory and add your Gemini API Key:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the application:
   ```bash
   npx expo start
   ```

## Security & Privacy
All user nutritional data and images are encrypted. The app supports secure login via Apple ID or Biometrics (FaceID/TouchID) for enhanced privacy.
