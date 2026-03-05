import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart3, 
  LogOut,
  Users,
  Heart,
  Eye
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  getOrders, 
  getContactSubmissions, 
  getDonations,
  getTotalVisits,
  type ContactSubmission,
  type Donation
} from '@/lib/firestore';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalContacts: 0,
    totalDonations: 0,
    totalVisits: 0,
  });
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin');
      } else {
        loadStats();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const [orders, contacts, donations, visits] = await Promise.all([
        getOrders(),
        getContactSubmissions(),
        getDonations(),
        getTotalVisits(),
      ]);

      setStats({
        totalOrders: orders.length,
        totalContacts: contacts.length,
        totalDonations: donations.length,
        totalVisits: visits,
      });
      setContacts(contacts);
      setDonations(donations);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Admin
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Submissions</p>
                    <p className="text-3xl font-bold">{stats.totalContacts}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Donations</p>
                    <p className="text-3xl font-bold">{stats.totalDonations}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Visits</p>
                    <p className="text-3xl font-bold">{stats.totalVisits}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Submissions & Donations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-emerald-400" />
                  Recent Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {contacts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No contacts yet</p>
                  ) : (
                    contacts.map((contact) => (
                      <div key={contact.id} className="p-4 rounded-lg border border-border bg-muted/20">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{contact.fullName}</h4>
                          <span className="text-xs text-muted-foreground">
                            {contact.createdAt?.toDate().toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-400 mb-1">{contact.subject}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{contact.email}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-pink-400" />
                  Recent Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {donations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No donations yet</p>
                  ) : (
                    donations.map((donation) => (
                      <div key={donation.id} className="p-4 rounded-lg border border-border bg-muted/20">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{donation.fullName}</h4>
                          <span className="text-sm font-bold text-pink-400">
                            {donation.amount.toLocaleString()} UGX
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{donation.reason}</p>
                        {donation.message && (
                          <p className="text-sm text-muted-foreground line-clamp-2 italic">"{donation.message}"</p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">{donation.email}</span>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {donation.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/orders')}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View All Orders
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/analytics')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Firebase Connection</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                      Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
