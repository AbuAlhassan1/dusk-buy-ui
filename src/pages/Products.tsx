import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function Products() {
  const { t } = useTranslation();
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">{t('products.title')}</h1>
          <p className="text-xl text-muted-foreground mb-6">{t('products.subtitle')}</p>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-effect border border-primary/20">
            <ExternalLink className="h-5 w-5 text-primary" />
            <span className="text-sm">{t('products.notFound')}</span>
            <Link to="/request-item">
              <Button variant="link" className="text-primary p-0 h-auto font-semibold">
                {t('products.requestHere')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={selectedCategory === category ? 'btn-primary' : ''}
            >
              {category === 'All' ? t('products.all') : t(`categories.${category}`)}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">{t('products.noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
