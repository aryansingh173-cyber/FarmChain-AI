import { IoTTelemetry, TelemetryReadingInput } from '@/types';

export class IoTTelemetryService {
  /**
   * Generates default initial telemetry for a newly registered produce batch
   */
  public static createInitialTelemetry(
    farmLocation: string,
    coordinates: { lat: number; lng: number }
  ): IoTTelemetry {
    return {
      currentTemp: 4.2,
      targetTempMin: 2.0,
      targetTempMax: 6.0,
      humidity: 88,
      shockG: 0.1,
      batteryPct: 98,
      lastUpdated: 'Just now',
      locationName: farmLocation,
      coordinates: coordinates,
      tempHistory: [
        { time: 'Initial Intake', temp: 4.2 }
      ]
    };
  }

  /**
   * Updates batch telemetry with newly received sensor metrics
   */
  public static updateTelemetry(
    existing?: IoTTelemetry,
    update?: TelemetryReadingInput
  ): { telemetry: IoTTelemetry; alert?: string } {
    const current = existing || {
      currentTemp: 4.0,
      targetTempMin: 2.0,
      targetTempMax: 6.0,
      humidity: 85,
      shockG: 0.1,
      batteryPct: 95,
      lastUpdated: 'Just now',
      locationName: 'Active Fleet Cold Vehicle #7',
      coordinates: { lat: 28.7041, lng: 77.1025 },
      tempHistory: []
    };

    const newTemp = typeof update?.currentTemp === 'number' ? update.currentTemp : current.currentTemp;
    const newHumidity = typeof update?.humidity === 'number' ? update.humidity : current.humidity;
    const newShock = typeof update?.shockG === 'number' ? update.shockG : current.shockG;
    const newBattery = typeof update?.batteryPct === 'number' ? update.batteryPct : Math.max(15, current.batteryPct - 1);
    const newLocation = update?.locationName || current.locationName;
    const newCoordinates = update?.coordinates || current.coordinates;

    const timeLabel = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const updatedHistory = [
      ...current.tempHistory.slice(-9), // Keep latest 10 data points
      { time: timeLabel, temp: newTemp }
    ];

    let alert: string | undefined;
    if (newTemp > current.targetTempMax) {
      alert = `WARNING: Temperature spike detected (${newTemp}°C exceeded max threshold ${current.targetTempMax}°C)!`;
    } else if (newTemp < current.targetTempMin) {
      alert = `WARNING: Sub-optimal chilling detected (${newTemp}°C below min threshold ${current.targetTempMin}°C)!`;
    } else if (newShock > 1.2) {
      alert = `ALERT: High physical shock detected (${newShock}G) in transit corridor!`;
    }

    return {
      telemetry: {
        currentTemp: newTemp,
        targetTempMin: current.targetTempMin,
        targetTempMax: current.targetTempMax,
        humidity: newHumidity,
        shockG: newShock,
        batteryPct: newBattery,
        lastUpdated: 'Just now',
        locationName: newLocation,
        coordinates: newCoordinates,
        tempHistory: updatedHistory,
      },
      alert,
    };
  }
}
