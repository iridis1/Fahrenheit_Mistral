import axios from 'axios';

export interface TemperatureResult {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
}

export async function convertTemperature(
  value: number,
  fromUnit: 'celsius' | 'fahrenheit' | 'kelvin'
): Promise<TemperatureResult> {
  try {
    const response = await axios.get<{ result: TemperatureResult }>(
      `/api/convert?${fromUnit}=${value}&api-key=378Gh85336hD430622h4S`
    );
    return response.data.result;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMsg = err.response?.data?.error || 'Conversie mislukt';
      throw new Error(errorMsg);
    }
    throw new Error('Onbekende fout opgetreden');
  }
}
