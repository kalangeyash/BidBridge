import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, LayoutDashboard, FileText, Clock } from 'lucide-react';
import api from '../../services/api'; // Your Axios instance
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

interface Tender {
  tenderId: number;
  title: string;
  categoryName: string;
  status: string;
  endDate: string;
}

const BuyerDashboard = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Assuming you store buyerProfileId in localStorage during login
const buyerId = localStorage.getItem('profileId'); 

useEffect(() => {
  const fetchTenders = async () => {
    // Check if buyerId actually exists to prevent 404/Null errors
    if (!buyerId) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/buyers/${buyerId}/tenders`);
      setTenders(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tenders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchTenders();
}, [buyerId]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8" /> Buyer Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your published tenders and track bids.</p>
        </div>
        <Button onClick={() => navigate('/buyer/dashboard/tenderform')} className="gap-2">
          <Plus className="w-4 h-4" /> Add New Tender
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-muted/30 p-6 rounded-xl border border-border">
          <div className="text-muted-foreground text-sm uppercase font-semibold">Active Tenders</div>
          <div className="text-4xl font-bold mt-2">{tenders.filter(t => t.status === 'OPEN').length}</div>
        </div>
        {/* Add more stat cards as needed */}
      </div>

      {/* Tenders Table */}
      <div className="bg-muted/20 border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/50 text-muted-foreground text-sm uppercase">
            <tr>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Closing Date</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center">Loading tenders...</td></tr>
            ) : tenders.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center">No tenders created yet.</td></tr>
            ) : (
              tenders.map((tender) => (
                <tr key={tender.tenderId} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{tender.title}</td>
                  <td className="p-4">{tender.categoryName}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      tender.status === 'OPEN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {tender.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(tender.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                      View Bids
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