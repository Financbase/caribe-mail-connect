import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, Leaf, TrendingDown, TrendingUp, Activity, Target } from 'lucide-react';

interface CarbonFootprintCalculatorProps {
  onCalculate?: (result: CarbonCalculationResult) => void;
}

interface CarbonCalculationResult {
  totalEmissions: number;
  breakdown: {
    [key: string]: number;
  };
  recommendations: string[];
  offsetNeeded: number;
}

export default function CarbonFootprintCalculator({ onCalculate }: CarbonFootprintCalculatorProps) {
  const [formData, setFormData] = useState({
    shipping: {
      distance: 0,
      weight: 0,
      mode: 'truck'
    },
    energy: {
      electricity: 0,
      naturalGas: 0,
      fuel: 0
    },
    waste: {
      general: 0,
      recyclable: 0,
      organic: 0
    },
    packaging: {
      plastic: 0,
      cardboard: 0,
      paper: 0
    }
  });

  const [result, setResult] = useState<CarbonCalculationResult | null>(null);

  // Emission factors (kg CO2 per unit)
  const emissionFactors = {
    shipping: {
      truck: 0.2, // kg CO2 per km per kg
      plane: 0.8,
      ship: 0.05,
      train: 0.1
    },
    energy: {
      electricity: 0.5, // kg CO2 per kWh
      naturalGas: 2.0, // kg CO2 per m3
      fuel: 2.3 // kg CO2 per liter
    },
    waste: {
      general: 0.5, // kg CO2 per kg (landfill)
      recyclable: 0.1, // kg CO2 per kg (recycled)
      organic: 0.3 // kg CO2 per kg (composted)
    },
    packaging: {
      plastic: 2.5, // kg CO2 per kg
      cardboard: 0.8,
      paper: 1.0
    }
  };

  const handleInputChange = (category: string, field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const calculateFootprint = () => {
    const breakdown: { [key: string]: number } = {};

    // Calculate shipping emissions
    const shippingEmissions = formData.shipping.distance * formData.shipping.weight * 
      emissionFactors.shipping[formData.shipping.mode as keyof typeof emissionFactors.shipping];
    breakdown.shipping = shippingEmissions;

    // Calculate energy emissions
    const energyEmissions = 
      formData.energy.electricity * emissionFactors.energy.electricity +
      formData.energy.naturalGas * emissionFactors.energy.naturalGas +
      formData.energy.fuel * emissionFactors.energy.fuel;
    breakdown.energy = energyEmissions;

    // Calculate waste emissions
    const wasteEmissions = 
      formData.waste.general * emissionFactors.waste.general +
      formData.waste.recyclable * emissionFactors.waste.recyclable +
      formData.waste.organic * emissionFactors.waste.organic;
    breakdown.waste = wasteEmissions;

    // Calculate packaging emissions
    const packagingEmissions = 
      formData.packaging.plastic * emissionFactors.packaging.plastic +
      formData.packaging.cardboard * emissionFactors.packaging.cardboard +
      formData.packaging.paper * emissionFactors.packaging.paper;
    breakdown.packaging = packagingEmissions;

    const totalEmissions = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    // Generate recommendations
    const recommendations = [];
    if (breakdown.shipping > totalEmissions * 0.4) {
      recommendations.push('Consider consolidating shipments or using more efficient transport modes');
    }
    if (breakdown.energy > totalEmissions * 0.3) {
      recommendations.push('Implement energy efficiency measures and renewable energy sources');
    }
    if (breakdown.waste > totalEmissions * 0.2) {
      recommendations.push('Increase recycling and composting programs');
    }
    if (breakdown.packaging > totalEmissions * 0.15) {
      recommendations.push('Use eco-friendly packaging materials and reduce packaging waste');
    }

    const calculationResult: CarbonCalculationResult = {
      totalEmissions,
      breakdown,
      recommendations,
      offsetNeeded: totalEmissions
    };

    setResult(calculationResult);
    onCalculate?.(calculationResult);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
  };

  const getEmissionLevel = (emissions: number) => {
    if (emissions < 100) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
    if (emissions < 500) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (emissions < 1000) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Calculator className="h-6 w-6" />
          Carbon Footprint Calculator
        </CardTitle>
        <CardDescription>
          Calculate your environmental impact across different activities and operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Shipping & Transportation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  value={formData.shipping.distance}
                  onChange={(e) => handleInputChange('shipping', 'distance', parseFloat(e.target.value) || 0)}
                  placeholder="Enter distance"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.shipping.weight}
                  onChange={(e) => handleInputChange('shipping', 'weight', parseFloat(e.target.value) || 0)}
                  placeholder="Enter weight"
                />
              </div>
              <div>
                <Label htmlFor="mode">Transport Mode</Label>
                <Select
                  value={formData.shipping.mode}
                  onValueChange={(value) => handleInputChange('shipping', 'mode', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="plane">Airplane</SelectItem>
                    <SelectItem value="ship">Ship</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Energy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Energy Consumption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="electricity">Electricity (kWh)</Label>
                <Input
                  id="electricity"
                  type="number"
                  value={formData.energy.electricity}
                  onChange={(e) => handleInputChange('energy', 'electricity', parseFloat(e.target.value) || 0)}
                  placeholder="Enter kWh"
                />
              </div>
              <div>
                <Label htmlFor="naturalGas">Natural Gas (m³)</Label>
                <Input
                  id="naturalGas"
                  type="number"
                  value={formData.energy.naturalGas}
                  onChange={(e) => handleInputChange('energy', 'naturalGas', parseFloat(e.target.value) || 0)}
                  placeholder="Enter m³"
                />
              </div>
              <div>
                <Label htmlFor="fuel">Fuel (liters)</Label>
                <Input
                  id="fuel"
                  type="number"
                  value={formData.energy.fuel}
                  onChange={(e) => handleInputChange('energy', 'fuel', parseFloat(e.target.value) || 0)}
                  placeholder="Enter liters"
                />
              </div>
            </CardContent>
          </Card>

          {/* Waste Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Waste Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="generalWaste">General Waste (kg)</Label>
                <Input
                  id="generalWaste"
                  type="number"
                  value={formData.waste.general}
                  onChange={(e) => handleInputChange('waste', 'general', parseFloat(e.target.value) || 0)}
                  placeholder="Enter kg"
                />
              </div>
              <div>
                <Label htmlFor="recyclable">Recyclable (kg)</Label>
                <Input
                  id="recyclable"
                  type="number"
                  value={formData.waste.recyclable}
                  onChange={(e) => handleInputChange('waste', 'recyclable', parseFloat(e.target.value) || 0)}
                  placeholder="Enter kg"
                />
              </div>
              <div>
                <Label htmlFor="organic">Organic Waste (kg)</Label>
                <Input
                  id="organic"
                  type="number"
                  value={formData.waste.organic}
                  onChange={(e) => handleInputChange('waste', 'organic', parseFloat(e.target.value) || 0)}
                  placeholder="Enter kg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Packaging Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Packaging Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="plastic">Plastic (kg)</Label>
                <Input
                  id="plastic"
                  type="number"
                  value={formData.packaging.plastic}
                  onChange={(e) => handleInputChange('packaging', 'plastic', parseFloat(e.target.value) || 0)}
                  placeholder="Enter kg"
                />
              </div>
              <div>
                <Label htmlFor="cardboard">Cardboard (kg)</Label>
                <Input
                  id="cardboard"
                  type="number"
                  value={formData.packaging.cardboard}
                  onChange={(e) => handleInputChange('packaging', 'cardboard', parseFloat(e.target.value) || 0)}
                  placeholder="Enter kg"
                />
              </div>
              <div>
                <Label htmlFor="paper">Paper (kg)</Label>
                <Input
                  id="paper"
                  type="number"
                  value={formData.packaging.paper}
                  onChange={(e) => handleInputChange('packaging', 'paper', parseFloat(e.target.value) || 0)}
                  placeholder="Enter kg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button onClick={calculateFootprint} className="bg-green-600 hover:bg-green-700">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Carbon Footprint
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Total Emissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Carbon Footprint Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className={`p-6 rounded-lg ${getEmissionLevel(result.totalEmissions).bg}`}>
                    <div className={`text-4xl font-bold ${getEmissionLevel(result.totalEmissions).color}`}>
                      {formatNumber(result.totalEmissions)} kg CO2
                    </div>
                    <div className="text-lg font-medium">
                      {getEmissionLevel(result.totalEmissions).level} Impact Level
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    This is equivalent to driving {Math.round(result.totalEmissions / 0.4)} km in a car
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Emissions Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(result.breakdown).map(([category, emissions]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">{category}</span>
                        <span className="font-semibold">{formatNumber(emissions)} kg CO2</span>
                      </div>
                      <Progress 
                        value={(emissions / result.totalEmissions) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Offset Information */}
            <Card>
              <CardHeader>
                <CardTitle>Carbon Offset</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(result.offsetNeeded)} kg CO2
                    </div>
                    <div className="text-sm text-green-700">Offset needed to become carbon neutral</div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    This could be offset by planting approximately {Math.round(result.offsetNeeded / 22)} trees
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Leaf className="h-4 w-4 mr-2" />
                    Purchase Carbon Offsets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 