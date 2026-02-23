import { useContext } from 'react';
import { CurrencyContext } from './currencyContext.base';

export const useCurrency = () => useContext(CurrencyContext);
