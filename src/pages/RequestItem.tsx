import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Package, ExternalLink } from 'lucide-react';

export default function RequestItem() {
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { addRequest } = useRequests();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    addRequest({
      userId: user?.id || '',
      productName: formData.get('productName') as string,
      productUrl: formData.get('productUrl') as string,
      storeName: formData.get('storeName') as string,
      priceRange: formData.get('priceRange') as string,
      description: formData.get('description') as string,
      quantity: formData.get('quantity') as string,
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);

    toast.success('Request submitted successfully!', {
      description: "We'll review your request and get back to you soon",
    });

    navigate('/my-requests');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ExternalLink className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Request Custom Item</h1>
          <p className="text-lg text-muted-foreground">
            Found something you love from an external store? We'll source it for you
          </p>
        </div>

        <Card className="p-8 border-border/50 bg-gradient-to-br from-card to-card/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                name="productName"
                required
                placeholder="e.g., Premium Leather Wallet"
                className="bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="storeName">Store/Brand Name *</Label>
              <Input
                id="storeName"
                name="storeName"
                required
                placeholder="e.g., Gucci, Amazon, Local Boutique"
                className="bg-background/50"
              />
            </div>

            <div>
              <Label htmlFor="productUrl">Product URL (if available)</Label>
              <Input
                id="productUrl"
                name="productUrl"
                type="url"
                placeholder="https://example.com/product"
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Link to the product page helps us find it faster
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priceRange">Your Budget *</Label>
                <Input
                  id="priceRange"
                  name="priceRange"
                  required
                  placeholder="e.g., $100-$200"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  defaultValue="1"
                  required
                  className="bg-background/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Additional Details *</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Tell us more about the item - color, size, specifications, or any special requirements..."
                rows={5}
                className="bg-background/50 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The more details you provide, the better we can source the right item
              </p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" />
                How it works
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• We'll review your request within 24 hours</li>
                <li>• Our team will source the item and confirm pricing</li>
                <li>• You'll receive a quote and can approve the purchase</li>
                <li>• We handle everything - ordering, quality check, and delivery</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary"
                size="lg"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
