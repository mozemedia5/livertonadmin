import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart3, 
  LogOut,
  Eye,
  Star,
  Heart,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  getTotalVisits, 
  getMostViewedApp,
  getAverageRating,
  getRatingCount,
  getLoveCount
} from '@/lib/firestore';
import { toast } from 'sonner';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    mostViewedApp: '',
    mostViewedCount: 0,
    appStats: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);

  const apps = [
    { id: 'liverton-learning', name: 'Liverton Learning' },
    { id: 'liverton-quiz', name: 'Liverton Quiz Championship' },
    { id: 'liverton-shoppers', name: 'Liverton Shoppers' },
    { id: 'longtail', name: 'Longtail' },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin');
      } else {
        loadAnalytics();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadAnalytics = async () => {
    try {
      const [visits, appViews] = await Promise.all([
        getTotalVisits(),
        getMostViewedApp(),
      ]);

      // Get stats for each app
      const appStats = await Promise.all(
        apps.map(async (app) => {
          const [avgRating, ratingCount, loveCount] = await Promise.all([
            getAverageRating(app.id),
            getRatingCount(app.id),
            getLoveCount(app.id),
          ]);
          return {
            ...app,
            views: appViews[app.id] || 0,
            avgRating: avgRating.toFixed(1),
            ratingCount,
            loveCount,
          };
        })
      );

      // Find most viewed app
      let mostViewed = { name: 'None', count: 0 };
      appStats.forEach((app) => {
        if (app.views > mostViewed.count) {
          mostViewed = { name: app.name, count: app.views };
        }
      });

      setAnalytics({
        totalVisits: visits,
        mostViewedApp: mostViewed.name,
        mostViewedCount: mostViewed.count,
        appStats,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
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
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3, active: true },
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
          <h1 className="text-3xl font-bold mb-8">Analytics</h1>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Visits</p>
                    <p className="text-3xl font-bold">{analytics.totalVisits}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Most Viewed App</p>
                    <p className="text-xl font-bold truncate max-w-[150px]">
                      {analytics.mostViewedApp}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analytics.mostViewedCount} views
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Apps</p>
                    <p className="text-3xl font-bold">{apps.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* App Statistics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Application Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Application</th>
                      <th className="text-center py-3 px-4 font-medium">
                        <Eye className="w-4 h-4 inline mr-1" />
                        Views
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        <Star className="w-4 h-4 inline mr-1" />
                        Avg Rating
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        <Users className="w-4 h-4 inline mr-1" />
                        Ratings
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        <Heart className="w-4 h-4 inline mr-1" />
                        Loves
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.appStats.map((app) => (
                      <tr key={app.id} className="border-b border-border last:border-0">
                        <td className="py-4 px-4 font-medium">{app.name}</td>
                        <td className="text-center py-4 px-4">{app.views}</td>
                        <td className="text-center py-4 px-4">
                          <span className="flex items-center justify-center">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                            {app.avgRating}
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">{app.ratingCount}</td>
                        <td className="text-center py-4 px-4">{app.loveCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* App Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analytics.appStats.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{app.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{app.views}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{app.avgRating}</p>
                      <p className="text-xs text-muted-foreground">Avg Rating</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{app.ratingCount}</p>
                      <p className="text-xs text-muted-foreground">Ratings</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{app.loveCount}</p>
                      <p className="text-xs text-muted-foreground">Loves</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
