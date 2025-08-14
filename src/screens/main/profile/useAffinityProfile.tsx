import { useEffect, useState } from 'react';
import api from '../../../utils/http';

export interface AffinityProfileData {
  profile_astro?: any;
  profile_bazi?: any;
  // Add other profile sections if needed
}

import RelationIcon from '../../../components/icons/affinity/relation-icon';

import Aquarius from '../../../components/icons/horoscopes/aquarius';
import Aries from '../../../components/icons/horoscopes/aries';
import Cancer from '../../../components/icons/horoscopes/cancer';
import Capricorn from '../../../components/icons/horoscopes/capricorn';
import Gemini from '../../../components/icons/horoscopes/gemini';
import Leo from '../../../components/icons/horoscopes/leo';
import Libra from '../../../components/icons/horoscopes/libra';
import Pisces from '../../../components/icons/horoscopes/pisces';
import Sagittarius from '../../../components/icons/horoscopes/sagittarius';
import Scorpio from '../../../components/icons/horoscopes/scorpio';
import Taurus from '../../../components/icons/horoscopes/taurus';
import Virgo from '../../../components/icons/horoscopes/virgo';

import BingFire from '../../../components/icons/bazi/bing-fire';
import DingFire from '../../../components/icons/bazi/ding-fire';
import GengMetal from '../../../components/icons/bazi/geng-metal';
import GuiWater from '../../../components/icons/bazi/gui-water';
import JiEarth from '../../../components/icons/bazi/ji-earth';
import JiaWood from '../../../components/icons/bazi/jia-wood';
import RenWater from '../../../components/icons/bazi/ren-water';
import WuEarth from '../../../components/icons/bazi/wu-earth';
import XinMetal from '../../../components/icons/bazi/xin-metal';
import YiWood from '../../../components/icons/bazi/yi-wood';

import Cow from '../../../components/icons/zodiac/cow';
import Dog from '../../../components/icons/zodiac/dog';
import Dragon from '../../../components/icons/zodiac/dragon';
import Goat from '../../../components/icons/zodiac/goat';
import Horse from '../../../components/icons/zodiac/horse';
import Monkey from '../../../components/icons/zodiac/monkey';
import Rat from '../../../components/icons/zodiac/rat';
import Pig from '../../../components/icons/zodiac/pig';
import Rabbit from '../../../components/icons/zodiac/rabbit';
import Rooster from '../../../components/icons/zodiac/rooster';
import Snake from '../../../components/icons/zodiac/snake';
import Tiger from '../../../components/icons/zodiac/tiger';

// Centralized icon map for zodiac and bazi icons
export const iconMap: Record<string, React.ComponentType<any> | number> = {
  aquarius: Aquarius,
  aries: Aries,
  cancer: Cancer,
  capricorn: Capricorn,
  gemini: Gemini,
  leo: Leo,
  libra: Libra,
  pisces: Pisces,
  sagittarius: Sagittarius,
  scorpio: Scorpio,
  taurus: Taurus,
  virgo: Virgo,

  bing_fire: BingFire,
  ding_fire: DingFire,
  geng_metal: GengMetal,
  gui_water: GuiWater,
  ji_earth: JiEarth,
  jia_wood: JiaWood,
  ren_water: RenWater,
  wu_earth: WuEarth,
  xin_metal: XinMetal,
  yi_wood: YiWood,

  cow: Cow,
  dog: Dog,
  dragon: Dragon,
  goat: Goat,
  horse: Horse,
  monkey: Monkey,
  rat: Rat,
  pig: Pig,
  rabbit: Rabbit,
  rooster: Rooster,
  snake: Snake,
  tiger: Tiger,
  // static
  relation: RelationIcon,
};

type ProfileIconProps = {
  name: string;
  size?: number;
  color?: string;
};



export const ProfileIcon: React.FC<ProfileIconProps> = ({ name, size = 75, color = 'white' }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;

  if (typeof IconComponent === 'function') {
    return <IconComponent size={size} color={color} />;
  }
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
