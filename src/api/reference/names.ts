import {
  NIGERIAN_FIRST_NAMES,
  NIGERIAN_LAST_NAMES,
  NIGERIAN_CITIES,
  NIGERIAN_STREETS,
} from '@/data/nigerianNames';

export const namesApi = {
  getFirstNames: async () => NIGERIAN_FIRST_NAMES,
  getLastNames: async () => NIGERIAN_LAST_NAMES,
  getCities: async () => NIGERIAN_CITIES,
  getStreets: async () => NIGERIAN_STREETS,
};
