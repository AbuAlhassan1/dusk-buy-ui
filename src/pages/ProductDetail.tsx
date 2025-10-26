import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50">
            <div className="aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>

          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-primary font-semibold mb-2">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold gradient-text mb-6">${product.price}</p>
            </div>

            <div className="prose prose-invert">
              <p className="text-lg text-muted-foreground">{product.description}</p>
              <p className="text-muted-foreground mt-4">
                Experience luxury with this premium product. Crafted with attention to detail
                and designed for those who appreciate quality. Each item is carefully selected
                to meet our high standards of excellence.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => addToCart(product)}
                size="lg"
                className="w-full btn-primary text-lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                onClick={() => {
                  addToCart(product);
                  navigate('/cart');
                }}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Buy Now
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Free Shipping</p>
                <p className="font-semibold">Worldwide</p>
              </div>
              <div className="text-center border-x border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Warranty</p>
                <p className="font-semibold">2 Years</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Returns</p>
                <p className="font-semibold">30 Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
