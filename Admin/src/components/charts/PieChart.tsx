import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface PieChartData {
  name: string
  value: number
}

interface PieChartProps {
  data: PieChartData[]
  height?: number
  colors?: string[]
}

const DEFAULT_COLORS = [
  '#D4AF37', // Gold
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#EF4444', // Red
  '#06B6D4'  // Cyan
]

export default function PieChart({
  data,
  height = 300,
  colors = DEFAULT_COLORS
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F9FAFB'
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
