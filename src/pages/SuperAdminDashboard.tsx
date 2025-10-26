import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  BarChart,
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Label } from '@/components/ui/label';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requests, updateRequestStatus, getRequestStats } = useRequests();
  const { products } = useProducts();

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject'>('approve');
  const [adminNotes, setAdminNotes] = useState('');

  // Analytics calculations - must be before any conditional returns
  const stats = getRequestStats();
  
  const productsByCategory = useMemo(() => {
    const categories: { [key: string]: number } = {};
    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [products]);

  const totalRevenue = useMemo(() => {
    return products.reduce((sum, product) => sum + product.price, 0);
  }, [products]);

  const recentRequests = useMemo(() => {
    return [...requests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [requests]);

  // Check if user is super admin (in real app, this would be in user object from API)
  const isSuperAdmin = user?.email === 'admin@luxe.com' || user?.email.endsWith('@admin.com');

  // Conditional returns after all hooks
  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need super admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/dashboard')} className="btn-primary">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleOpenDialog = (requestId: string, action: 'approve' | 'reject') => {
    setSelectedRequest(requestId);
    setDialogAction(action);
    setDialogOpen(true);
    setAdminNotes('');
  };

  const handleConfirmAction = () => {
    if (!selectedRequest) return;

    const status = dialogAction === 'approve' ? 'Approved' : 'Rejected';
    updateRequestStatus(selectedRequest, status, adminNotes, user.email);

    toast.success(
      dialogAction === 'approve' 
        ? 'Request approved successfully!' 
        : 'Request rejected successfully!'
    );

    setDialogOpen(false);
    setSelectedRequest(null);
    setAdminNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage requests, products, and view analytics</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <BarChart className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time requests</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-red-500/10 to-red-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Not approved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="requests">
            <Users className="mr-2 h-4 w-4" />
            Requests ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="mr-2 h-4 w-4" />
            Products ({products.length})
          </TabsTrigger>
        </TabsList>

        {/* Requests Management Tab */}
        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Requests</CardTitle>
              <CardDescription>Review and manage item requests from customers</CardDescription>
            </CardHeader>
            <CardContent>
              {recentRequests.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No customer requests yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRequests.map(request => (
                    <Card key={request.id} className="border-border/50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{request.productName}</h3>
                            <p className="text-sm text-muted-foreground">Store: {request.storeName}</p>
                            <p className="text-xs text-muted-foreground">
                              Requested {new Date(request.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Budget:</span>{' '}
                            <span className="font-semibold">{request.priceRange}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>{' '}
                            <span className="font-semibold">{request.quantity}</span>
                          </div>
                        </div>

                        {request.productUrl && (
                          <div className="mb-4">
                            <a
                              href={request.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Product Link
                            </a>
                          </div>
                        )}

                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-1">Description:</p>
                          <p className="text-sm bg-muted/30 p-3 rounded border border-border/50">
                            {request.description}
                          </p>
                        </div>

                        {request.adminNotes && (
                          <div className="mb-4 bg-blue-500/10 p-3 rounded border border-blue-500/30">
                            <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Admin Notes:
                            </p>
                            <p className="text-sm text-muted-foreground">{request.adminNotes}</p>
                            {request.reviewedBy && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Reviewed by {request.reviewedBy} on{' '}
                                {new Date(request.reviewedAt!).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}

                        {request.status === 'Pending Review' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleOpenDialog(request.id, 'approve')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleOpenDialog(request.id, 'reject')}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground">Active in store</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Catalog Value</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total inventory value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Product Price</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${products.length > 0 ? (totalRevenue / products.length).toFixed(2) : '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">Mean price point</p>
                </CardContent>
              </Card>
            </div>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Products by Category</CardTitle>
                <CardDescription>Distribution of products across categories</CardDescription>
              </CardHeader>
              <CardContent>
                {productsByCategory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No product data available</p>
                ) : (
                  <div className="space-y-4">
                    {productsByCategory.map(category => (
                      <div key={category.name}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-muted-foreground">
                            {category.value} products ({((category.value / products.length) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${(category.value / products.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Request Status Overview</CardTitle>
                <CardDescription>Breakdown of all customer requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        Pending
                      </span>
                      <span className="text-muted-foreground">
                        {stats.pending} ({stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Approved
                      </span>
                      <span className="text-muted-foreground">
                        {stats.approved} ({stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-medium flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-400" />
                        Rejected
                      </span>
                      <span className="text-muted-foreground">
                        {stats.rejected} ({stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Overview Tab */}
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Overview of all products in the store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No products available
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.slice(0, 10).map(product => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/product/${product.id}`)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {products.length > 10 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    View All Products
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval/Rejection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve'
                ? 'Approve this customer request and optionally add notes about next steps.'
                : 'Reject this request and provide a reason for the customer.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-notes">
                {dialogAction === 'approve' ? 'Admin Notes (Optional)' : 'Rejection Reason'}
              </Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder={
                  dialogAction === 'approve'
                    ? 'e.g., We can source this item within 5-7 business days...'
                    : 'e.g., Item not available from trusted suppliers...'
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={dialogAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={dialogAction === 'reject' ? 'destructive' : 'default'}
            >
              {dialogAction === 'approve' ? 'Approve Request' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminDashboard;
