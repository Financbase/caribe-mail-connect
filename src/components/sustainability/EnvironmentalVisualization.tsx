import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, Activity, Gauge, Calendar } from 'lucide-react';
import { EnvironmentalVisualization as EnvironmentalVisualizationType } from '@/types/sustainability';

interface EnvironmentalVisualizationProps {
  visualization: EnvironmentalVisualizationType;
  title?: string;
  description?: string;
}

export default function EnvironmentalVisualization({ 
  visualization, 
  title = "Environmental Impact", 
  description = "Visual representation of sustainability metrics" 
}: EnvironmentalVisualizationProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTrendIcon = (value: number, previousValue: number) => {
    if (value > previousValue) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < previousValue) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getGaugeColor = (value: number, thresholds: number[]) => {
    if (value >= thresholds[2]) return 'text-green-600';
    if (value >= thresholds[1]) return 'text-blue-600';
    if (value >= thresholds[0]) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderChart = () => {
    if (visualization.type === 'chart' && visualization.data.datasets) {
      const dataset = visualization.data.datasets[0];
      const maxValue = Math.max(...dataset.data);
      const minValue = Math.min(...dataset.data);
      
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Trend over time</span>
            <Badge variant="outline">{visualization.config.units}</Badge>
          </div>
          
          <div className="space-y-2">
            {dataset.data.map((value, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{visualization.data.labels[index]}</span>
                  <span className="font-medium">{formatNumber(value)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((value - minValue) / (maxValue - minValue)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderGauge = () => {
    if (visualization.type === 'gauge') {
      const { value, max, thresholds } = visualization.data;
      const percentage = (value / max) * 100;
      
      return (
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getGaugeColor(value, thresholds)}`}>
                  {value}
                </div>
                <div className="text-sm text-gray-600">
                  {visualization.config.units}
                </div>
              </div>
            </div>
            <div 
              className="absolute inset-0 rounded-full border-8 border-transparent border-t-green-600"
              style={{ 
                transform: `rotate(${percentage * 3.6 - 90}deg)`,
                transition: 'transform 1s ease-in-out'
              }}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current</span>
              <span className="font-medium">{value}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Target</span>
              <span className="font-medium">{max}</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        </div>
      );
    }
    return null;
  };

  const renderProgress = () => {
    if (visualization.type === 'progress') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress to goal</span>
            <Badge variant="outline">{visualization.config.units}</Badge>
          </div>
          
          <div className="space-y-3">
            {visualization.data.map((item: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium">{formatNumber(item.value)}</span>
                </div>
                <Progress value={item.percentage} className="h-3" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTimeline = () => {
    if (visualization.type === 'timeline') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Timeline</span>
            <Badge variant="outline">{visualization.config.units}</Badge>
          </div>
          
          <div className="space-y-3">
            {visualization.data.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-gray-600">{item.date}</div>
                </div>
                <div className="text-sm font-medium">{formatNumber(item.value)}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <BarChart3 className="h-6 w-6" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="h-3 w-3" />
          Last updated: {new Date(visualization.lastUpdated).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Visualization */}
          <div className="bg-white rounded-lg p-6 border">
            {visualization.type === 'chart' && renderChart()}
            {visualization.type === 'gauge' && renderGauge()}
            {visualization.type === 'progress' && renderProgress()}
            {visualization.type === 'timeline' && renderTimeline()}
          </div>

          {/* Configuration Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-sm text-gray-500">Type</div>
              <div className="font-semibold capitalize">{visualization.type}</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-sm text-gray-500">Units</div>
              <div className="font-semibold">{visualization.config.units}</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-sm text-gray-500">Thresholds</div>
              <div className="font-semibold">{visualization.config.thresholds.length}</div>
            </div>
          </div>

          {/* Color Legend */}
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-semibold text-sm mb-3">Color Legend</h4>
            <div className="flex flex-wrap gap-3">
              {visualization.config.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-600">
                    Level {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 