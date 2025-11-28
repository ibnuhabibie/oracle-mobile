import { useEffect, useState } from 'react';
import { useAsyncStorage } from './use-storage';

export function useServiceCost(serviceKey: string) {
  const { getConfig } = useAsyncStorage();
  const [cost, setCost] = useState<number>(0);
  const [creditType, setCreditType] = useState<string>('gold');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCost = async () => {
      setLoading(true);
      const config = await getConfig();

      let cost = null;
      if (serviceKey === 'ask_affinity' || serviceKey === 'secret_diary') {
        cost = getConfigValue(`${serviceKey}_cost_using_gold_credit`, config);
      } else {
        cost = getConfigValue(`${serviceKey}_cost_using_direct_payment`, config);
      }

      setCreditType('gold');
      setCost(cost);
      setLoading(false); 
    };

    fetchCost();
  }, []);

  function getConfigValue(key: string, config: any[]) {
    const found = config.find((c: any) => c.key === key);
    return found ? Number(found.value) : 0;
  }

  return { cost, creditType, loading, setLoading };
}
