import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/contexts/ProductContext';

export default function Index() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">Luxury</span>
            <br />
            Redefined
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Discover premium products crafted for those who appreciate the finer things
          </p>
          <Link to="/products">
            <Button size="lg" className="btn-primary text-lg px-8 animate-scale-in">
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-y border-border/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: 'Premium Quality', description: 'Handpicked luxury items' },
              { icon: Shield, title: 'Secure Shopping', description: '100% buyer protection' },
              { icon: Truck, title: 'Fast Delivery', description: 'Express shipping worldwide' },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg glass-effect hover-lift"
              >
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Collection</h2>
            <p className="text-xl text-muted-foreground">Curated selections for the discerning</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="text-lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
