import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInternational } from '@/hooks/useInternational';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  DollarSign, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Clock
} from 'lucide-react';

export const CurrencyConverter: React.FC = () => {
  const { t } = useLanguage();
  const {
    currencies,
    exchangeRates,
    ratesLoading,
    convertCurrency,
    formatCurrency
  } = useInternational();

  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('DOP');
  const [amount, setAmount] = useState<string>('100');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Calculate conversion when inputs change
  useEffect(() => {
    if (amount && fromCurrency && toCurrency && exchangeRates) {
      const converted = convertCurrency(parseFloat(amount), fromCurrency, toCurrency);
      setConvertedAmount(converted);
      
      // Find the exchange rate for display
      const rate = exchangeRates.find(r => r.toCurrency === toCurrency);
      if (rate) {
        setLastUpdated(new Date(rate.lastUpdated).toLocaleString());
      }
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates, convertCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getExchangeRate = () => {
    if (fromCurrency === toCurrency) return 1;
    
    const fromRate = exchangeRates?.find(rate => rate.toCurrency === fromCurrency)?.rate || 1;
    const toRate = exchangeRates?.find(rate => rate.toCurrency === toCurrency)?.rate || 1;
    
    return toRate / fromRate;
  };

  const getRateChange = () => {
    // Mock rate change for demonstration
    const change = Math.random() * 0.1 - 0.05; // -5% to +5%
    return change;
  };

  const rateChange = getRateChange();
  const isPositive = rateChange > 0;

  return (
    <div className="space-y-4">
      {/* Currency Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="amount">{t('international.amount', 'Amount')}</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.00"
          />
        </div>

        <div>
          <Label htmlFor="from-currency">{t('international.from', 'From')}</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <span className="mr-2">{currency.symbol}</span>
                  {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="to-currency">{t('international.to', 'To')}</Label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <span className="mr-2">{currency.symbol}</span>
                  {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSwapCurrencies}
          className="rounded-full"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Conversion Result */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold">
              {formatCurrency(convertedAmount, toCurrency)}
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(parseFloat(amount || '0'), fromCurrency)} = {formatCurrency(convertedAmount, toCurrency)}
            </div>

            <div className="flex items-center justify-center space-x-2">
              <Badge variant="outline">
                1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}
              </Badge>
              
              {rateChange !== 0 && (
                <Badge variant={isPositive ? "default" : "destructive"}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(rateChange * 100).toFixed(2)}%
                </Badge>
              )}
            </div>

            {lastUpdated && (
              <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{t('international.lastUpdated', 'Last updated')}: {lastUpdated}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Popular Conversions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currencies.slice(0, 4).map((currency) => (
          <Card key={currency.code} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="text-lg font-medium">
                  {currency.symbol} {currency.code}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {currency.name}
                </div>
                <div className="text-xs">
                  {formatCurrency(convertCurrency(100, 'USD', currency.code), currency.code)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exchange Rate Table */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-4">{t('international.exchangeRates', 'Exchange Rates')}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">{t('international.currency', 'Currency')}</th>
                  <th className="text-right py-2">{t('international.rate', 'Rate')}</th>
                  <th className="text-right py-2">{t('international.change', 'Change')}</th>
                </tr>
              </thead>
              <tbody>
                {currencies.slice(0, 6).map((currency) => {
                  const rate = exchangeRates?.find(r => r.toCurrency === currency.code)?.rate || 1;
                  const change = Math.random() * 0.1 - 0.05;
                  const isPositive = change > 0;
                  
                  return (
                    <tr key={currency.code} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{currency.code}</span>
                          <span className="text-gray-500">{currency.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-2 font-mono">
                        {rate.toFixed(4)}
                      </td>
                      <td className="text-right py-2">
                        <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
                          {isPositive ? '+' : ''}{(change * 100).toFixed(2)}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 