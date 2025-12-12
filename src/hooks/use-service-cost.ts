import { useEffect, useState } from 'react';
import * as RNLocalize from "react-native-localize";

import { useAsyncStorage } from './use-storage';
import { getLocaleByCountryCode } from '../utils/platform';
import { CURRENCIES } from '../constants/app';

export function useServiceCost(serviceKey: string) {
  const { getConfig } = useAsyncStorage();
  const [cost, setCost] = useState<number>(0);
  const [creditType, setCreditType] = useState<string>('gold');
  const [loading, setLoading] = useState<boolean>(false);
  const [locale, setLocale] = useState<string>('');
  const [currencySymbol, setCurrencySymbol] = useState<string>('');

  useEffect(() => {
    const fetchCost = async () => {
      setLoading(true);
      const config = await getConfig();

      let cost = null;
      if (serviceKey === 'ask_affinity' || serviceKey === 'secret_diary') {
        cost = getConfigValue(`${serviceKey}_cost_using_gold_credit`, config);
      } else {
        const countryCode = RNLocalize.getCountry();
        console.log(countryCode, 'countryCode')

        const _locale = getLocaleByCountryCode(countryCode);
        console.log(_locale, `${serviceKey}_cost_using_direct_payment_${_locale}`, config)

        setLocale(_locale)

        const currency = CURRENCIES.find(c => c.key === _locale) || CURRENCIES[0];
        setCurrencySymbol(currency.symbol);

        cost = getConfigValue(`${serviceKey}_cost_using_direct_payment_${_locale}`, config);
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

  return {
    cost,
    creditType,
    loading,
    setLoading,
    locale,
    currencySymbol
  };
}
