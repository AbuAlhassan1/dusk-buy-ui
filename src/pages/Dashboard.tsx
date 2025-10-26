import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      toast.error('Please fill in all required fields');
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
      toast.success('Product updated successfully!');
      setEditingProduct(null);
    } else {
      addProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        description: formData.description,
        category: formData.category,
      });
      toast.success('Product added successfully!');
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
      toast.success('Product deleted successfully!');
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
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your store products</p>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="add">
            <Plus className="mr-2 h-4 w-4" />
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </TabsTrigger>
          <TabsTrigger value="manage">
            <Package className="mr-2 h-4 w-4" />
            Manage Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              <CardDescription>
                {editingProduct ? 'Update the product details below' : 'Fill in the details to add a new product to your store'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Premium Wireless Headphones"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="99.99"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Toys">Toys</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg (optional)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use a default image
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    <Plus className="mr-2 h-4 w-4" />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                  {editingProduct && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
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
              <CardTitle>All Products ({products.length})</CardTitle>
              <CardDescription>
                View and manage all products in your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No products found. Add your first product!
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
                          <TableCell>{product.category}</TableCell>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
