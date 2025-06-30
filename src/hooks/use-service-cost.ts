import { useEffect, useState } from 'react';
import { useAsyncStorage } from './use-storage';

export function useServiceCost(serviceKey: string) {
  const { getConfig } = useAsyncStorage();
  const [cost, setCost] = useState<number>(0);
  const [creditType, setCreditType] = useState<string>('silver');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCost = async () => {
      setLoading(true);
      const config = await getConfig();

      let creditType = 'silver';
      let cost = getConfigValue(`${serviceKey}_cost_using_silver_credit`, config);

      console.log(cost, creditType)

      if (cost <= 0) {
        cost = getConfigValue(`${serviceKey}_cost_using_gold_credit`, config);
        creditType = 'gold';
        console.log(cost, creditType)
      }

      setCost(cost);
      setCreditType(creditType);
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
