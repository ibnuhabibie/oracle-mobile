import { useEffect, useState } from 'react';
import api from '../../../utils/http';

export interface AffinityProfileData {
  profile_astro?: any;
  profile_bazi?: any;
  // Add other profile sections if needed
}

// Centralized icon map for zodiac and bazi icons
export const iconMap: Record<string, any> = {
  aquarius: require('../../../assets/affinity/aquarius.png'),
  aries: require('../../../assets/affinity/aries.png'),
  bing_fire: require('../../../assets/affinity/bing_fire.png'),
  cancer: require('../../../assets/affinity/cancer.png'),
  capricorn: require('../../../assets/affinity/capricorn.png'),
  cow: require('../../../assets/affinity/cow.png'),
  ding_fire: require('../../../assets/affinity/ding_fire.png'),
  dog: require('../../../assets/affinity/dog.png'),
  dragon: require('../../../assets/affinity/dragon.png'),
  gemini: require('../../../assets/affinity/gemini.png'),
  geng_metal: require('../../../assets/affinity/geng_metal.png'),
  goat: require('../../../assets/affinity/goat.png'),
  gui_water: require('../../../assets/affinity/gui_water.png'),
  horse: require('../../../assets/affinity/horse.png'),
  ji_earth: require('../../../assets/affinity/ji_earth.png'),
  jia_wood: require('../../../assets/affinity/jia_wood.png'),
  leo: require('../../../assets/affinity/leo.png'),
  libra: require('../../../assets/affinity/libra.png'),
  monkey: require('../../../assets/affinity/monkey.png'),
  mouse: require('../../../assets/affinity/mouse.png'),
  pig: require('../../../assets/affinity/pig.png'),
  pisces: require('../../../assets/affinity/pisces.png'),
  rabbit: require('../../../assets/affinity/rabbit.png'),
  ren_water: require('../../../assets/affinity/ren_water.png'),
  rooster: require('../../../assets/affinity/rooster.png'),
  sagittarius: require('../../../assets/affinity/sagittarius.png'),
  scorpio: require('../../../assets/affinity/scorpio.png'),
  snake: require('../../../assets/affinity/snake.png'),
  taurus: require('../../../assets/affinity/taurus.png'),
  tiger: require('../../../assets/affinity/tiger.png'),
  virgo: require('../../../assets/affinity/virgo.png'),
  wu_earth: require('../../../assets/affinity/wu_earth.png'),
  xin_metal: require('../../../assets/affinity/xin_metal.png'),
  yi_wood: require('../../../assets/affinity/yi_wood.png'),
};

export function useAffinityProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AffinityProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/v1/users/affinity-profile');
        setData(res.data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { loading, error, data };
}
