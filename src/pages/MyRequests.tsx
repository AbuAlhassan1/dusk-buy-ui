import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function MyRequests() {
  const { user, isAuthenticated } = useAuth();
  const { getUserRequests } = useRequests();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const requests = user ? getUserRequests(user.id) : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending Review':
        return <Clock className="h-4 w-4" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Review':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  if (requests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <ExternalLink className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-3xl font-bold mb-4">No requests yet</h2>
          <p className="text-muted-foreground mb-8">
            Request items from external stores and we'll source them for you
          </p>
          <Link to="/request-item">
            <Button size="lg" className="btn-primary">
              Request an Item
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Requests</h1>
            <p className="text-muted-foreground">Track your custom item requests</p>
          </div>
          <Link to="/request-item">
            <Button className="btn-primary">
              <ExternalLink className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {requests.map(request => (
            <Card
              key={request.id}
              className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{request.productName}</h3>
                  <p className="text-sm text-muted-foreground">
                    From: {request.storeName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Requested on {new Date(request.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <Badge className={getStatusColor(request.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>
                </Badge>
              </div>

              <div className="space-y-3 mb-4 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Budget: </span>
                    <span className="font-semibold">{request.priceRange}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantity: </span>
                    <span className="font-semibold">{request.quantity}</span>
                  </div>
                </div>

                {request.productUrl && (
                  <div>
                    <span className="text-muted-foreground">Product Link: </span>
                    <a
                      href={request.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View Product
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Details:</p>
                  <p className="text-foreground/90 bg-muted/30 p-3 rounded border border-border/50">
                    {request.description}
                  </p>
                </div>

                {request.adminNotes && (
                  <div className="bg-blue-500/10 p-3 rounded border border-blue-500/30">
                    <p className="text-sm font-semibold mb-1">Admin Response:</p>
                    <p className="text-sm text-foreground/90">{request.adminNotes}</p>
                  </div>
                )}
              </div>

              {request.status === 'Pending Review' && (
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    💡 We're reviewing your request. You'll be notified once we have an update.
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
