import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NutritionContext } from '../context/NutritionContext';
import { NeumorphView } from '../components/NeumorphView';

export default function DashboardScreen() {
  const { dailyProgress } = useContext(NutritionContext);

  const remainingCals = Math.max(0, dailyProgress.goalCalories - dailyProgress.currentCalories);

  return (
    <ScrollView style={styles.container}>
      <NeumorphView style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Calories Remaining</Text>
        <Text style={styles.summaryValue}>{remainingCals} kcal</Text>
        
        <View style={styles.macroRow}>
          <MacroCircle title="Protein" current={dailyProgress.currentProtein} goal={dailyProgress.goalProtein} color="#3498db" />
          <MacroCircle title="Fats" current={dailyProgress.currentFats} goal={dailyProgress.goalFats} color="#e67e22" />
          <MacroCircle title="Carbs" current={dailyProgress.currentCarbs} goal={dailyProgress.goalCarbs} color="#2ecc71" />
        </View>
      </NeumorphView>

      <Text style={styles.timelineTitle}>Today's Meals</Text>
      {dailyProgress.meals.length === 0 ? (
        <Text style={styles.emptyText}>No meals logged yet. Tap 'Log Meal' to start.</Text>
      ) : (
        dailyProgress.meals.map((meal, index) => (
          <NeumorphView key={index} style={styles.mealRow}>
            <View style={{ flex: 1, paddingRight: 15 }}>
              <Text style={styles.mealName}>{meal.items.map(i => i.name).join(', ')}</Text>
              <Text style={styles.mealTime}>{new Date(meal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            </View>
            <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
              <Text style={styles.mealCals}>{meal.totalCalories} kcal</Text>
              <Text style={styles.mealMacros}>P:{meal.totalProtein}g F:{meal.totalFats}g C:{meal.totalCarbs}g</Text>
            </View>
          </NeumorphView>
        ))
      )}
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const MacroCircle = ({ title, current, goal, color }) => {
  return (
    <NeumorphView style={styles.macroCircleContainer}>
      <Text style={[styles.macroCircleText, { color }]}>{current}g</Text>
      <Text style={styles.macroTitle}>{title}</Text>
    </NeumorphView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0E5EC',
  },
  summaryCard: {
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins_600SemiBold',
  },
  summaryValue: {
    fontSize: 40,
    fontFamily: 'Poppins_700Bold',
    marginVertical: 10,
    color: '#4A4A4A',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  macroCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  macroCircleText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  macroTitle: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
    fontFamily: 'Poppins_600SemiBold',
  },
  timelineTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 20,
    color: '#4A4A4A',
    marginLeft: 5,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Poppins_400Regular',
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  mealName: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#4A4A4A',
  },
  mealTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    fontFamily: 'Poppins_400Regular',
  },
  mealCals: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#4A4A4A',
  },
  mealMacros: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    fontFamily: 'Poppins_400Regular',
  },
});
