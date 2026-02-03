import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutDashboard, Trash2, LogOut } from 'lucide-react';
import api from '../../services/api'; 
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

interface Tender {
  tenderId: number;
  title: string;
  categoryName: string;
  buyerOrganization: string; // Added field
  status: string;
  endDate: string;
}

const BuyerDashboard = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const buyerId = localStorage.getItem('profileId');

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const handleDeleteTender = async (tenderId: number) => {
    if (!window.confirm("Are you sure you want to delete this tender? All associated bids will be lost.")) {
      return;
    }

    try {
      await api.delete(`/buyers/tenders/${tenderId}`);
      toast.success("Tender deleted successfully");
      setTenders(prev => prev.filter(t => t.tenderId !== tenderId));
    } catch (error) {
      toast.error("Failed to delete tender");
    }
  };

  useEffect(() => {
    if (!buyerId) {
      navigate('/login');
      return;
    }

    const fetchTenders = async () => {
      try {
        const response = await api.get(`/buyers/${buyerId}/tenders`);
        setTenders(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load tenders.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [buyerId, navigate]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8" /> Buyer Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your published tenders and track bids.</p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={() => navigate('/buyer/dashboard/tenderform')} className="gap-2">
            <Plus className="w-4 h-4" /> Add New Tender
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white flex gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-muted/30 p-6 rounded-xl border border-border">
          <div className="text-muted-foreground text-sm uppercase font-semibold tracking-wider">Active Tenders</div>
          <div className="text-4xl font-bold mt-2 text-primary">
            {tenders.filter(t => t.status === 'OPEN').length}
          </div>
        </div>
      </div>

      <div className="bg-muted/20 border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-widest">
            <tr>
              <th className="p-4 font-medium">ID</th> {/* Added column */}
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Organization</th> {/* Added column */}
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Closing Date</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">Loading tenders...</td></tr>
            ) : tenders.length === 0 ? (
              <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No tenders created yet.</td></tr>
            ) : (
              tenders.map((tender) => (
                <tr key={tender.tenderId} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4 text-sm text-primary font-mono">#{tender.tenderId}</td> {/* Render ID */}
                  <td className="p-4 font-medium">{tender.title}</td>
                  <td className="p-4 text-sm text-muted-foreground">{tender.categoryName}</td>
                  <td className="p-4 text-sm text-muted-foreground">{tender.buyerOrganization}</td> {/* Render Org */}
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter ${
                      tender.status === 'OPEN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {tender.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(tender.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10"
                      onClick={() => navigate(`/buyer/tender/${tender.tenderId}/bids`)}
                    >
                      View Bids
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteTender(tender.tenderId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyerDashboard;