import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { DollarSign, CreditCard, Building2, TrendingUp } from 'lucide-react';

interface RevenueStats {
  cash: number;
  card: number;
  transfer: number;
  hmo: number;
  total: number;
}

interface RevenueStatsCardsProps {
  revenue: RevenueStats;
  routePrefix: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function RevenueStatsCards({ revenue, routePrefix }: RevenueStatsCardsProps) {
  const navigate = useNavigate();

  const cards = [
    {
      label: 'Cash Collected',
      value: revenue.cash,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      onClick: () => navigate(`${routePrefix}/payments?method=cash`),
    },
    {
      label: 'Card/POS',
      value: revenue.card,
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      onClick: () => navigate(`${routePrefix}/payments?method=card`),
    },
    {
      label: 'Bank Transfer',
      value: revenue.transfer,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      onClick: () => navigate(`${routePrefix}/payments?method=transfer`),
    },
    {
      label: "Today's Total",
      value: revenue.total,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      onClick: () => navigate(`${routePrefix}/payments`),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={card.onClick}
        >
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              {card.label}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-xl font-bold ${card.color}`}>{formatCurrency(card.value)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
