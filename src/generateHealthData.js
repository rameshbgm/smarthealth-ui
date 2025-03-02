#!/usr/bin/env node

/**
 * generateHealthData.js
 * 
 * Usage: node generateHealthData.js <fromDate> <toDate>
 * Example: node generateHealthData.js 2025-03-01 2025-03-15
 * 
 * This script generates a JSON dataset of health data at 2-hour intervals.
 * The data is intelligently generated based on the time of day.
 */

function pad(num) {
    return num.toString().padStart(2, '0');
  }
  
  function generateRecord(date, hour) {
    // Format time as HH:00
    let timeStr = pad(hour) + ":00";
    
    // Default values
    let steps = 0;
    let calories = 0;
    let heart_rate = 0;
    let oxygen_saturation = 98;
    let ecg = "Normal";
    let sleep_quality = "Good";
    let blood_pressure = "120/80";
    let body_composition = {
      body_fat: 17.5,
      muscle_mass: 38.1,
      water_percentage: 57.2
    };
  
    // Generate values based on the hour slot (every 2 hours)
    if (hour < 6) {
      // Sleep time: 00:00, 02:00, 04:00
      steps = 0;
      heart_rate = Math.floor(50 + Math.random() * 5); // 50-55
      calories = Math.floor(20 + Math.random() * 5); // 20-25
      blood_pressure = "110/70";
    } else if (hour === 6) {
      // Early morning awakening
      steps = Math.floor(100 + Math.random() * 100); // 100-200
      heart_rate = Math.floor(65 + Math.random() * 5); // 65-70
      calories = Math.floor(40 + Math.random() * 10); // 40-50
      blood_pressure = "115/75";
    } else if (hour === 8) {
      // Morning activity (e.g., walk)
      steps = Math.floor(600 + Math.random() * 400); // 600-1000
      heart_rate = Math.floor(70 + Math.random() * 10); // 70-80
      calories = Math.floor(80 + Math.random() * 20);
      blood_pressure = "120/80";
    } else if (hour === 10) {
      // Mid-morning moderate activity
      steps = Math.floor(1000 + Math.random() * 500); // 1000-1500
      heart_rate = Math.floor(80 + Math.random() * 5); // 80-85
      calories = Math.floor(120 + Math.random() * 30);
      blood_pressure = "120/80";
    } else if (hour === 12) {
      // Noon, lighter activity
      steps = Math.floor(500 + Math.random() * 200); // 500-700
      heart_rate = 75;
      calories = Math.floor(80 + Math.random() * 20);
      blood_pressure = "118/78";
    } else if (hour === 14) {
      // Early afternoon, sedentary
      steps = Math.floor(300 + Math.random() * 200); // 300-500
      heart_rate = 70;
      calories = Math.floor(50 + Math.random() * 10);
      blood_pressure = "117/76";
    } else if (hour === 16) {
      // Late afternoon exercise
      steps = Math.floor(1500 + Math.random() * 1500); // 1500-3000
      heart_rate = Math.floor(100 + Math.random() * 40); // 100-140
      calories = Math.floor(120 + Math.random() * 50);
      // If very high heart rate, mark ECG as irregular
      ecg = heart_rate > 130 ? "Irregular" : "Normal";
      blood_pressure = "145/95";
    } else if (hour === 18) {
      // Evening moderate activity
      steps = Math.floor(800 + Math.random() * 400); // 800-1200
      heart_rate = Math.floor(80 + Math.random() * 10);
      calories = Math.floor(110 + Math.random() * 20);
      blood_pressure = "120/80";
    } else if (hour === 20) {
      // Early night, minimal activity
      steps = Math.floor(300 + Math.random() * 200); // 300-500
      heart_rate = 70;
      calories = Math.floor(60 + Math.random() * 10);
      blood_pressure = "118/78";
    } else if (hour === 22) {
      // Late night, preparing for sleep
      steps = Math.floor(100 + Math.random() * 100); // 100-200
      heart_rate = Math.floor(65 + Math.random() * 5); // 65-70
      calories = Math.floor(40 + Math.random() * 10);
      blood_pressure = "120/80";
    } else {
      steps = 500;
      heart_rate = 75;
      calories = 80;
      blood_pressure = "120/80";
    }
  
    // Add slight random variation to body composition
    body_composition.body_fat = parseFloat((body_composition.body_fat + (Math.random() - 0.5) * 0.2).toFixed(1));
    body_composition.muscle_mass = parseFloat((body_composition.muscle_mass + (Math.random() - 0.5) * 0.2).toFixed(1));
    body_composition.water_percentage = parseFloat((body_composition.water_percentage + (Math.random() - 0.5) * 0.2).toFixed(1));
  
    return {
      date: date.toISOString().split('T')[0],
      time: timeStr,
      steps: steps,
      calories_burned: calories,
      oxygen_saturation: oxygen_saturation,
      heart_rate: heart_rate,
      ecg: ecg,
      body_composition: body_composition,
      sleep_quality: sleep_quality,
      blood_pressure: blood_pressure
    };
  }
  
  function generateHealthData(fromDateStr, toDateStr) {
    let fromDate = new Date(fromDateStr);
    let toDate = new Date(toDateStr);
    
    // Normalize time portion for fromDate and toDate
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
  
    let healthData = [];
    for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
      // For each day, create records for 12 intervals (00:00, 02:00, ..., 22:00)
      for (let hour = 0; hour < 24; hour += 2) {
        // Create a copy of the date for the record
        let recordDate = new Date(d);
        let record = generateRecord(recordDate, hour);
        healthData.push(record);
      }
    }
    return { health_data: healthData };
  }
  
  // If run from the command line, use process.argv to get dates
  if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 2) {
      console.error("Usage: node generateHealthData.js <fromDate> <toDate>");
      console.error("Example: node generateHealthData.js 2025-03-01 2025-03-15");
      process.exit(1);
    }
    const fromDateStr = args[0];
    const toDateStr = args[1];
    const data = generateHealthData(fromDateStr, toDateStr);
    
    // Print the output JSON
    console.log(JSON.stringify(data, null, 2));
  }
  
  module.exports = {
    generateRecord,
    generateHealthData
  };
  