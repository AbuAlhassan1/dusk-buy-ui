import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Store order in localStorage
    const order = {
      id: Date.now().toString(),
      items,
      total,
      date: new Date().toISOString(),
      status: 'Processing',
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([order, ...existingOrders]));

    clearCart();
    setLoading(false);

    toast({
      title: t('checkout.orderSuccess'),
      description: t('checkout.orderSuccessDesc'),
    });

    navigate('/orders');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t('checkout.title')}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
                <h2 className="text-2xl font-semibold mb-4">{t('checkout.shippingInfo')}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('checkout.firstName')}</Label>
                      <Input
                        id="firstName"
                        required
                        defaultValue={user?.name.split(' ')[0]}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('checkout.lastName')}</Label>
                      <Input
                        id="lastName"
                        required
                        defaultValue={user?.name.split(' ')[1] || ''}
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">{t('checkout.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      defaultValue={user?.email}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">{t('checkout.address')}</Label>
                    <Input
                      id="address"
                      required
                      placeholder={t('checkout.addressPlaceholder')}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">{t('checkout.city')}</Label>
                      <Input id="city" required className="bg-background/50" />
                    </div>
                    <div>
                      <Label htmlFor="zip">{t('checkout.zip')}</Label>
                      <Input id="zip" required className="bg-background/50" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
                <h2 className="text-2xl font-semibold mb-4">{t('checkout.paymentInfo')}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">{t('checkout.cardNumber')}</Label>
                    <Input
                      id="cardNumber"
                      placeholder={t('checkout.cardPlaceholder')}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">{t('checkout.expiry')}</Label>
                      <Input
                        id="expiry"
                        placeholder={t('checkout.expiryPlaceholder')}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">{t('checkout.cvc')}</Label>
                      <Input
                        id="cvc"
                        placeholder={t('checkout.cvcPlaceholder')}
                        required
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6 sticky top-20 border-border/50 bg-gradient-to-br from-card to-card/50">
                <h2 className="text-2xl font-semibold mb-4">{t('checkout.orderSummary')}</h2>
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/50 pt-4 space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('checkout.subtotal')}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('checkout.shipping')}</span>
                    <span className="text-primary font-semibold">{t('checkout.free')}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>{t('checkout.total')}</span>
                    <span className="gradient-text">${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 btn-primary"
                  size="lg"
                >
                  {loading ? t('checkout.processing') : t('checkout.placeOrder')}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
