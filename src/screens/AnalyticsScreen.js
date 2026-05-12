import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { NutritionContext } from '../context/NutritionContext';
import { BarChart } from 'react-native-chart-kit';
import { NeumorphView } from '../components/NeumorphView';

export default function AnalyticsScreen() {
  const { history, dailyProgress } = useContext(NutritionContext);

  const screenWidth = Dimensions.get("window").width - 90; // Adjusting for padding

  const data = {
    labels: [...history.map(h => new Date(h.date).toLocaleDateString([], {weekday: 'short'})), "Today"],
    datasets: [
      {
        data: [...history.map(h => h.currentCalories), dailyProgress.currentCalories]
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#E0E5EC",
    backgroundGradientTo: "#E0E5EC",
    color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
    fillShadowGradientFrom: "#2ecc71",
    fillShadowGradientTo: "#2ecc71",
    fillShadowGradientFromOpacity: 0.8,
    fillShadowGradientToOpacity: 0.8,
    propsForLabels: {
      fontFamily: 'Poppins_400Regular'
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekly Caloric Intake</Text>
      
      <NeumorphView style={styles.chartContainer}>
        <BarChart
          data={data}
          width={screenWidth}
          height={220}
          yAxisSuffix=""
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          fromZero
          showValuesOnTopOfBars
          withInnerLines={false}
          style={{
            borderRadius: 15,
            paddingRight: 0,
          }}
        />
      </NeumorphView>

      <Text style={styles.title}>Weekly Averages</Text>
      <View style={styles.statsContainer}>
        <NeumorphView style={styles.statBox}>
          <Text style={styles.statTitle}>Avg Calories</Text>
          <Text style={styles.statValue}>2150 <Text style={styles.statUnit}>kcal</Text></Text>
        </NeumorphView>
        <NeumorphView style={styles.statBox}>
          <Text style={styles.statTitle}>Avg Protein</Text>
          <Text style={styles.statValue}>140 <Text style={styles.statUnit}>g</Text></Text>
        </NeumorphView>
      </View>
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
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 20,
    color: '#4A4A4A',
    marginLeft: 5,
  },
  chartContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    padding: 20,
    borderRadius: 20,
    width: '46%',
  },
  statTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#4A4A4A',
  },
  statUnit: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins_400Regular',
  }
});
