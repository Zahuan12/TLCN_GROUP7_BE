import { Card, CardContent } from '../ui/card';
import { cn } from '../../utils/cn';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

/**
 * StatCard - Display statistics with icon, label, value, and trend
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {string} props.description - Description or subtitle
 * @param {React.ReactNode} props.icon - Icon component
 * @param {Object} props.trend - Trend data { value: number, direction: 'up'|'down' }
 * @param {string} props.className - Additional classes
 */
export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className
}) {
  const trendColor = trend?.direction === 'up' ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend?.direction === 'up' ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-bold">{value}</h3>
              {trend && (
                <div className={cn('flex items-center text-sm font-medium', trendColor)}>
                  <TrendIcon className="w-4 h-4 mr-1" />
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {Icon && (
            <div className="ml-4 p-3 bg-primary/10 rounded-lg">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

