import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NutritionContext = createContext();

export const NutritionProvider = ({ children }) => {
  const defaultDailyProgress = {
    date: new Date().toISOString(),
    meals: [],
    goalCalories: 2000,
    goalProtein: 150,
    goalFats: 65,
    goalCarbs: 200,
    currentCalories: 0,
    currentProtein: 0,
    currentFats: 0,
    currentCarbs: 0,
  };

  const [dailyProgress, setDailyProgress] = useState(defaultDailyProgress);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedProgress = await AsyncStorage.getItem('@dailyProgress');
        const storedHistory = await AsyncStorage.getItem('@history');
        
        let parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];
        let parsedProgress = storedProgress ? JSON.parse(storedProgress) : null;
        
        const todayString = new Date().toDateString();

        if (parsedProgress) {
          const progressDateString = new Date(parsedProgress.date).toDateString();
          
          if (progressDateString !== todayString) {
            // New day: move old progress to history and start fresh
            const historyEntry = {
              date: parsedProgress.date,
              currentCalories: parsedProgress.currentCalories,
              goalCalories: parsedProgress.goalCalories,
            };
            parsedHistory = [historyEntry, ...parsedHistory];
            await AsyncStorage.setItem('@history', JSON.stringify(parsedHistory));
            
            parsedProgress = { ...defaultDailyProgress, date: new Date().toISOString() };
            await AsyncStorage.setItem('@dailyProgress', JSON.stringify(parsedProgress));
          }
        } else {
          // No saved progress, maybe first launch
          parsedProgress = { ...defaultDailyProgress, date: new Date().toISOString() };
          
          // Add some mock history just so it's not totally empty on first launch
          if (parsedHistory.length === 0) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            parsedHistory = [
              {
                date: yesterday.toISOString(),
                currentCalories: 2150,
                goalCalories: 2000,
              }
            ];
            await AsyncStorage.setItem('@history', JSON.stringify(parsedHistory));
          }
        }

        setHistory(parsedHistory);
        setDailyProgress(parsedProgress);
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };

    loadData();
  }, []);

  const addMeal = (meal) => {
    setDailyProgress(prev => {
      const newMeals = [...prev.meals, meal];
      const newCalories = prev.currentCalories + meal.totalCalories;
      const newProtein = prev.currentProtein + meal.totalProtein;
      const newFats = prev.currentFats + meal.totalFats;
      const newCarbs = prev.currentCarbs + meal.totalCarbs;

      const newProgress = {
        ...prev,
        meals: newMeals,
        currentCalories: newCalories,
        currentProtein: newProtein,
        currentFats: newFats,
        currentCarbs: newCarbs,
      };

      AsyncStorage.setItem('@dailyProgress', JSON.stringify(newProgress)).catch(e => {
        console.error('Failed to save daily progress', e);
      });

      return newProgress;
    });
  };

  const simulateAILogging = async (base64Image, callback) => {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    // Check if user set the API key
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      callback(null, "Please add your EXPO_PUBLIC_GEMINI_API_KEY to the .env file and restart the Expo server.");
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Analyze this image of food. Estimate the calories, protein (g), fats (g), and carbs (g). Respond ONLY with a valid JSON object in this exact format: {\"name\": \"Food Name\", \"calories\": 500, \"protein\": 30, \"fats\": 20, \"carbs\": 40}. Do not include markdown code blocks or any other text." },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }]
        })
      });

      if (response.status === 403) {
        callback(null, "API Key Revoked (HTTP 403). Google has disabled your EXPO_PUBLIC_GEMINI_API_KEY because it was publicly leaked on GitHub. Please generate a fresh API key from Google AI Studio.");
        return;
      }

      if (response.status === 429) {
        callback(null, "API Rate Limit Exceeded (HTTP 429). Please wait a minute before analyzing another image, or check your Gemini API billing quota.");
        return;
      }

      const json = await response.json();
      
      if (json.error) {
        callback(null, json.error.message || "Gemini API Error");
        return;
      }

      // Parse the JSON string out of the AI response text
      const rawText = json.candidates[0].content.parts[0].text;
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsedData = JSON.parse(cleanedText);

      const mockMeal = {
        id: Math.random().toString(),
        timestamp: new Date().toISOString(),
        items: [
          { 
            name: parsedData.name || "AI Scanned Meal", 
            calories: parsedData.calories || 0, 
            protein: parsedData.protein || 0, 
            fats: parsedData.fats || 0, 
            carbs: parsedData.carbs || 0, 
            portionSize: "1 serving" 
          }
        ],
        totalCalories: parsedData.calories || 0,
        totalProtein: parsedData.protein || 0,
        totalFats: parsedData.fats || 0,
        totalCarbs: parsedData.carbs || 0,
      };
      
      callback(mockMeal, null);
    } catch (error) {
      console.error(error);
      callback(null, "Failed to analyze image. Check API key and internet connection.");
    }
  };

  return (
    <NutritionContext.Provider value={{ dailyProgress, history, addMeal, simulateAILogging }}>
      {children}
    </NutritionContext.Provider>
  );
};
