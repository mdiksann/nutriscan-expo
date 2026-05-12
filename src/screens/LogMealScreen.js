import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView, Platform } from 'react-native';
import { NutritionContext } from '../context/NutritionContext';
import * as ImagePicker from 'expo-image-picker';
import { NeumorphView } from '../components/NeumorphView';

export default function LogMealScreen() {
  const { addMeal, simulateAILogging } = useContext(NutritionContext);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  // Manual Entry State
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fats, setFats] = useState('');
  const [carbs, setCarbs] = useState('');

  const handleWebFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uri = URL.createObjectURL(file);
    setImageUri(uri);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      if (base64String) {
        analyzeImage(base64String);
      } else {
        Alert.alert("Error", "Failed to process image format.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      analyzeImage(result.assets[0].base64);
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      analyzeImage(result.assets[0].base64);
    }
  };

  const analyzeImage = (base64String) => {
    setIsAnalyzing(true);
    simulateAILogging(base64String, (meal, error) => {
      setIsAnalyzing(false);
      if (error) {
        Alert.alert("AI Error", error);
        setImageUri(null);
        return;
      }
      addMeal(meal);
      Alert.alert("Success", `AI logged: ${meal.items[0].name}`);
      setImageUri(null); 
    });
  };

  const handleManualLog = () => {
    if (!foodName || !calories) return;

    const item = {
      name: foodName,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      fats: parseInt(fats) || 0,
      carbs: parseInt(carbs) || 0,
    };

    const meal = {
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
      items: [item],
      totalCalories: item.calories,
      totalProtein: item.protein,
      totalFats: item.fats,
      totalCarbs: item.carbs,
    };

    addMeal(meal);
    
    setFoodName('');
    setCalories('');
    setProtein('');
    setFats('');
    setCarbs('');
    
    Alert.alert("Success", "Meal logged manually!");
  };

  return (
    <ScrollView style={styles.container}>
      
      <NeumorphView style={styles.section}>
        <Text style={styles.sectionTitle}>AI Image Recognition</Text>
        
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        )}

        <View style={styles.buttonRow}>
          <View style={{width: '46%', position: 'relative'}}>
            <TouchableOpacity onPress={openCamera} disabled={isAnalyzing}>
              <NeumorphView style={styles.aiButton} isPressed={isAnalyzing}>
                <Text style={[styles.buttonText, {color: '#3498db'}]}>Take Photo</Text>
              </NeumorphView>
            </TouchableOpacity>
            {Platform.OS === 'web' && (
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleWebFileChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
              />
            )}
          </View>

          <View style={{width: '46%', position: 'relative'}}>
            <TouchableOpacity onPress={openGallery} disabled={isAnalyzing}>
              <NeumorphView style={styles.aiButton} isPressed={isAnalyzing}>
                <Text style={[styles.buttonText, {color: '#9b59b6'}]}>Gallery</Text>
              </NeumorphView>
            </TouchableOpacity>
            {Platform.OS === 'web' && (
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleWebFileChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
              />
            )}
          </View>
        </View>

        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator color="#3498db" />
            <Text style={styles.analyzingText}>Analyzing with Gemini API...</Text>
          </View>
        )}
      </NeumorphView>

      <NeumorphView style={styles.section}>
        <Text style={styles.sectionTitle}>Manual Entry</Text>
        
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Food Name" placeholderTextColor="#A3B1C6" value={foodName} onChangeText={setFoodName} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Calories (kcal)" placeholderTextColor="#A3B1C6" keyboardType="numeric" value={calories} onChangeText={setCalories} />
        </View>
        
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <TextInput style={styles.input} placeholder="Protein (g)" placeholderTextColor="#A3B1C6" keyboardType="numeric" value={protein} onChangeText={setProtein} />
          </View>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <TextInput style={styles.input} placeholder="Fats (g)" placeholderTextColor="#A3B1C6" keyboardType="numeric" value={fats} onChangeText={setFats} />
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Carbs (g)" placeholderTextColor="#A3B1C6" keyboardType="numeric" value={carbs} onChangeText={setCarbs} />
        </View>
        
        <TouchableOpacity 
          onPress={handleManualLog}
          disabled={!foodName || !calories}
          style={{marginTop: 20}}
        >
          <NeumorphView style={styles.logButton} isPressed={!foodName || !calories}>
            <Text style={[styles.buttonText, {color: (!foodName || !calories) ? '#A3B1C6' : '#2ecc71'}]}>Log Meal</Text>
          </NeumorphView>
        </TouchableOpacity>
      </NeumorphView>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0E5EC',
  },
  section: {
    padding: 25,
    borderRadius: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 25,
    color: '#4A4A4A',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  aiButton: {
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  analyzingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  analyzingText: {
    marginLeft: 10,
    color: '#888',
    fontFamily: 'Poppins_600SemiBold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 25,
  },
  inputContainer: {
    backgroundColor: '#E0E5EC',
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D1D9E6',
    overflow: 'hidden',
  },
  input: {
    padding: 15,
    fontSize: 16,
    color: '#4A4A4A',
    fontFamily: 'Poppins_400Regular',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '46%',
  },
  logButton: {
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
});
