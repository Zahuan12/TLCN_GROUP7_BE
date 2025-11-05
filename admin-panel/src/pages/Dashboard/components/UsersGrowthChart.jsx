import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CHART_COLORS } from '../../../utils/constants';

/**
 * UsersGrowthChart - Line chart showing user growth over time
 * 
 * @param {Object} props
 * @param {Array} props.data - Chart data with labels and datasets
 */
export default function UsersGrowthChart({ data }) {
  if (!data || !data.labels || !data.datasets) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tăng trưởng Users</CardTitle>
          <CardDescription>Số lượng users mới theo tháng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Không có dữ liệu
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for Recharts
  const chartData = data.labels.map((label, index) => {
    const dataPoint = { name: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tăng trưởng Users</CardTitle>
        <CardDescription>Số lượng users mới theo tháng</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Legend />
            {data.datasets.map((dataset, index) => (
              <Line
                key={dataset.label}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.color || CHART_COLORS.primary}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

