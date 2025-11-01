import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  date: string;
  status: string;
}

export default function Orders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-3xl font-bold mb-4">{t('orders.noOrders')}</h2>
          <p className="text-muted-foreground mb-8">{t('orders.noOrdersDesc')}</p>
          <Link to="/products">
            <Button size="lg" className="btn-primary">
              {t('orders.browseProducts')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="h-8 w-8" />
          <h1 className="text-4xl font-bold">{t('orders.title')}</h1>
        </div>

        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('orders.orderNumber')}{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {order.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 pt-4 flex justify-between items-center">
                <div>
                  <span className="text-sm text-muted-foreground">{t('orders.total')}: </span>
                  <span className="text-xl font-bold gradient-text">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <Button variant="outline">{t('orders.viewDetails')}</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
