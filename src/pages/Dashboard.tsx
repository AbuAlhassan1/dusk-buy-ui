import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Package } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: '',
  });

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.description) {
      toast.error(t('dashboard.fillRequired'));
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct, {
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        description: formData.description,
        category: formData.category,
      });
      toast.success(t('dashboard.productUpdated'));
      setEditingProduct(null);
    } else {
      addProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        description: formData.description,
        category: formData.category,
      });
      toast.success(t('dashboard.productAdded'));
    }

    setFormData({
      name: '',
      price: '',
      image: '',
      description: '',
      category: '',
    });
  };

  const handleEdit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        description: product.description,
        category: product.category,
      });
      setEditingProduct(productId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      toast.success(t('dashboard.productDeleted'));
      setProductToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      image: '',
      description: '',
      category: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="add">
            <Plus className="me-2 h-4 w-4" />
            {editingProduct ? t('dashboard.editProduct') : t('dashboard.addProduct')}
          </TabsTrigger>
          <TabsTrigger value="manage">
            <Package className="me-2 h-4 w-4" />
            {t('dashboard.manageProducts')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? t('dashboard.editProduct') : t('dashboard.addNew')}</CardTitle>
              <CardDescription>
                {editingProduct ? t('dashboard.updateDetails') : t('dashboard.fillDetails')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('dashboard.productName')} *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('dashboard.productNamePlaceholder')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">{t('dashboard.price')} *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder={t('dashboard.pricePlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">{t('dashboard.category')} *</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('dashboard.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">{t('categories.Electronics')}</SelectItem>
                      <SelectItem value="Fashion">{t('categories.Fashion')}</SelectItem>
                      <SelectItem value="Home">{t('categories.Home')}</SelectItem>
                      <SelectItem value="Sports">{t('categories.Sports')}</SelectItem>
                      <SelectItem value="Books">{t('categories.Books')}</SelectItem>
                      <SelectItem value="Toys">{t('categories.Toys')}</SelectItem>
                      <SelectItem value="Other">{t('categories.Other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">{t('dashboard.imageUrl')}</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder={t('dashboard.imageUrlPlaceholder')}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('dashboard.leaveEmpty')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('dashboard.description')} *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={t('dashboard.descriptionPlaceholder')}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    <Plus className="me-2 h-4 w-4" />
                    {editingProduct ? t('dashboard.update') : t('dashboard.add')}
                  </Button>
                  {editingProduct && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      {t('dashboard.cancel')}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.allProducts')} ({products.length})</CardTitle>
              <CardDescription>
                {t('dashboard.viewManage')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">{t('dashboard.image')}</TableHead>
                      <TableHead>{t('dashboard.name')}</TableHead>
                      <TableHead>{t('dashboard.category')}</TableHead>
                      <TableHead>{t('dashboard.price')}</TableHead>
                      <TableHead className="text-right">{t('dashboard.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {t('dashboard.noProducts')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{t(`categories.${product.category}`)}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(product.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteClick(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('dashboard.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {t('dashboard.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
