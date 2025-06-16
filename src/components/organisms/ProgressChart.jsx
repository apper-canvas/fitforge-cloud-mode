import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import { progressService } from '@/services';

const ProgressChart = ({ 
  exerciseName = null,
  metric = 'weight',
  days = 30,
  className = ''
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(metric);

  useEffect(() => {
    if (exerciseName) {
      loadProgressData();
    }
  }, [exerciseName, days, selectedMetric]);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      const progressData = await progressService.getProgressChart(exerciseName, days);
      setData(progressData);
    } catch (error) {
      console.error('Failed to load progress data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!data.length) return { series: [], categories: [] };
    
    const categories = data.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    );
    
    const values = data.map(item => {
      switch (selectedMetric) {
        case 'weight':
          return item.weight;
        case 'reps':
          return item.reps;
        case 'volume':
          return item.volume;
        default:
          return item.weight;
      }
    });

    return {
      series: [{
        name: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
        data: values
      }],
      categories
    };
  };

  const chartOptions = {
    chart: {
      type: 'line',
      height: 300,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'dark'
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#FF6B35']
    },
    markers: {
      size: 6,
      colors: ['#FF6B35'],
      strokeColors: '#FF6B35',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 5
    },
    xaxis: {
      categories: getChartData().categories,
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '12px'
        }
      },
      axisBorder: {
        color: '#374151'
      },
      axisTicks: {
        color: '#374151'
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '12px'
        },
        formatter: function (value) {
          if (selectedMetric === 'weight' || selectedMetric === 'volume') {
            return value + ' lbs';
          }
          return value;
        }
      }
    },
    tooltip: {
      theme: 'dark',
      backgroundColor: '#1A1A2E',
      borderColor: '#FF6B35',
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function (value) {
          if (selectedMetric === 'weight' || selectedMetric === 'volume') {
            return value + ' lbs';
          }
          return value + ' reps';
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#00D9FF'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    }
  };

  if (loading) {
    return (
      <div className={`bg-surface rounded-2xl p-6 border border-gray-700 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  if (!exerciseName) {
    return (
      <div className={`bg-surface rounded-2xl p-6 border border-gray-700 ${className}`}>
        <div className="text-center py-12">
          <Text color="muted">Select an exercise to view progress</Text>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={`bg-surface rounded-2xl p-6 border border-gray-700 ${className}`}>
        <Text variant="subheading" size="lg" weight="semibold" className="mb-6">
          {exerciseName} Progress
        </Text>
        <div className="text-center py-12">
          <Text color="muted">No progress data available for this exercise</Text>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-2xl p-6 border border-gray-700 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <Text variant="subheading" size="lg" weight="semibold" className="break-words">
          {exerciseName} Progress
        </Text>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          {['weight', 'reps', 'volume'].map((metric) => (
            <Button
              key={metric}
              variant={selectedMetric === metric ? 'primary' : 'ghost'}
              size="small"
              onClick={() => setSelectedMetric(metric)}
              className="capitalize"
            >
              {metric}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-64 w-full">
        <Chart
          options={chartOptions}
          series={getChartData().series}
          type="line"
          height="100%"
          width="100%"
        />
      </div>
    </motion.div>
  );
};

export default ProgressChart;