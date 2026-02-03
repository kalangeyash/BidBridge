import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Gavel, Building2, Tag, Calendar, AlertCircle, ClipboardList, Search, UserCircle } from 'lucide-react';
import api from '../../services/api'; 
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import BidModal from './BidModel'; 
import UpdateProfileModal from './UpdateProfileModal'; // New Import

// --- Interfaces ---
interface Tender {
  tenderId: number;
  title: string;
  description: string;
  status: string;
  endDate: string;
  budgetMax: number;
  category: { name: string; };
  buyerProfile: { user: { name: string; }; };
}

interface MyBid {
  bidId: number;
  tenderTitle: string;
  bidAmount: number;
  status: 'SUBMITTED' | 'WON' | 'LOST' | 'WITHDRAWN';
  submittedAt: string;
}

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'mybids'>('browse');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [myBids, setMyBids] = useState<MyBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // New State
  
  const navigate = useNavigate();
  const vendorId = localStorage.getItem('profileId');

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const handleBidClick = (tender: Tender) => {
    setSelectedTender(tender);
    setIsModalOpen(true);
  };

  // Fetch Logic
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'browse') {
        const response = await api.get('/tenders/active');
        setTenders(response.data);
      } else {
        const response = await api.get(`/bids/vendor/${vendorId}`);
        setMyBids(response.data);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!vendorId) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [vendorId, activeTab]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'WON': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'LOST': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'SUBMITTED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8" /> Vendor Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Welcome! Participate in active tenders or track your submissions.</p>
        </div>
        
        <div className="flex gap-3">
          {/* New Update Profile Button */}
          <Button 
            variant="outline" 
            onClick={() => setIsUpdateModalOpen(true)}
            className="border-primary/50 text-primary hover:bg-primary hover:text-white flex gap-2"
          >
            <UserCircle className="w-4 h-4" /> Update Profile
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

      {/* Tab Navigation */}
      <div className="flex gap-6 border-b border-border">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`pb-4 px-2 flex items-center gap-2 font-medium transition-all ${activeTab === 'browse' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-white'}`}
        >
          <Search className="w-4 h-4" /> Available Tenders
        </button>
        <button 
          onClick={() => setActiveTab('mybids')}
          className={`pb-4 px-2 flex items-center gap-2 font-medium transition-all ${activeTab === 'mybids' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-white'}`}
        >
          <ClipboardList className="w-4 h-4" /> My Submissions
        </button>
      </div>

      {activeTab === 'browse' ? (
        <div className="space-y-6">
          <div className="bg-[#121212] border border-border rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="p-5 font-bold">Tender Details</th>
                  <th className="p-5 font-bold">Category</th>
                  <th className="p-5 font-bold">Buyer / Org</th>
                  <th className="p-5 font-bold">Max Budget</th>
                  <th className="p-5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center text-muted-foreground">Loading Tenders...</td></tr>
                ) : tenders.map((tender) => (
                  <tr key={tender.tenderId} className="hover:bg-muted/20 transition-all group">
                    <td className="p-5">
                      <div className="font-semibold text-white group-hover:text-primary">{tender.title}</div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-1">ID: #{tender.tenderId}</div>
                    </td>
                    <td className="p-5 text-sm text-muted-foreground">{tender.category?.name}</td>
                    <td className="p-5 text-sm text-muted-foreground">{tender.buyerProfile?.user?.name}</td>
                    <td className="p-5 font-semibold text-sm">₹{tender.budgetMax.toLocaleString()}</td>
                    <td className="p-5 text-right">
                      <Button onClick={() => handleBidClick(tender)} className="bg-primary text-xs font-bold h-9">
                        Place Bid
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#121212] border border-border rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase tracking-widest">
              <tr>
                <th className="p-5 font-bold">Tender Title</th>
                <th className="p-5 font-bold">My Bid Amount</th>
                <th className="p-5 font-bold">Date Submitted</th>
                <th className="p-5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-muted-foreground">Loading Bids...</td></tr>
              ) : myBids.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-muted-foreground">You haven't placed any bids yet.</td></tr>
              ) : (
                myBids.map((bid) => (
                  <tr key={bid.bidId} className="hover:bg-muted/20 transition-all">
                    <td className="p-5 font-medium text-white">
                      {bid.tenderTitle}
                      <div className="text-[10px] text-muted-foreground">Bid ID: #{bid.bidId}</div>
                    </td>
                    <td className="p-5 font-semibold text-primary">₹{bid.bidAmount.toLocaleString()}</td>
                    <td className="p-5 text-sm text-muted-foreground">{new Date(bid.submittedAt).toLocaleDateString()}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(bid.status)}`}>
                        {bid.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Bid Submission Modal */}
      {selectedTender && (
        <BidModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tender={selectedTender} />
      )}

      {/* Profile Update Modal */}
      <UpdateProfileModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        vendorId={vendorId} 
      />
    </div>
  );
};

export default VendorDashboard;