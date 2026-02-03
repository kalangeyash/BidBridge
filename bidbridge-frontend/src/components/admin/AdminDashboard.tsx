// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Users, Gavel, FileText, LayoutDashboard, LogOut, 
//   ShieldCheck, Search, X, Building2, UserCircle2, 
//   TrendingUp, Activity, CheckCircle2 
// } from 'lucide-react';
// import api from '../../services/api'; 
// import { Button } from '../../components/ui/button';
// import { toast } from 'sonner';

// // --- Interfaces ---
// interface UserData {
//   userId: number;
//   name: string;
//   email: string;
//   role: string;
// }

// interface AdminTender {
//   tenderId: number;
//   title: string;
//   categoryName: string;
//   buyerOrganization: string;
//   status: string;
//   endDate: string;
// }

// interface AdminBid {
//   bidId: number;
//   tenderTitle: string;
//   vendorName: string;
//   bidAmount: number;
//   status: string;
// }

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState<'users' | 'tenders' | 'bids'>('users');
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [tenders, setTenders] = useState<AdminTender[]>([]);
//   const [bids, setBids] = useState<AdminBid[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//     toast.success("Admin logged out");
//     navigate('/login');
//   };

// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       if (activeTab === 'users') {
// //         const res = await api.get('/admin/users'); // Ensure this endpoint exists
// //         setUsers(res.data);
// //       } else if (activeTab === 'tenders') {
// //         const res = await api.get('/tenders/all');
// //         setTenders(res.data);
// //       } else {
// //         const res = await api.get('/admin/bids'); // Ensure this endpoint exists
// //         setBids(res.data);
// //       }
// //     } catch (error) {
// //       toast.error("Failed to load admin data");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// const fetchData = async () => {
//   setLoading(true);
//   try {
//     if (activeTab === 'users') {
//       const res = await api.get('/admin/users');
//       setUsers(res.data);
//     } else if (activeTab === 'tenders') {
//       // CHANGE THIS LINE: from /tenders/all to /admin/tenders
//       const res = await api.get('/admin/tenders'); 
//       setTenders(res.data);
//     } else {
//       const res = await api.get('/admin/bids');
//       setBids(res.data);
//     }
//   } catch (error) {
//     toast.error("Failed to load admin data");
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchData();
//   }, [activeTab]);

//   // Filtering Logic
//   const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
//   const filteredTenders = tenders.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
//   const filteredBids = bids.filter(b => b.vendorName.toLowerCase().includes(searchTerm.toLowerCase()));

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-8 text-white min-h-screen">
      
//       {/* Header */}
//       <div className="flex justify-between items-center bg-[#1a1a1a] p-6 rounded-[2rem] border border-white/5 shadow-2xl">
//         <div className="flex items-center gap-4">
//           <div className="bg-primary/20 p-3 rounded-2xl">
//             <ShieldCheck className="w-8 h-8 text-primary" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
//               Admin Control Center
//             </h1>
//             <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">BidBridge Management</p>
//           </div>
//         </div>
//         <Button variant="ghost" onClick={handleLogout} className="text-red-400 hover:text-white hover:bg-red-500/10 gap-2">
//           <LogOut className="w-4 h-4" /> Logout
//         </Button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
//           <Activity className="text-primary w-5 h-5 mb-2" />
//           <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Total Platform Tenders</div>
//           <div className="text-3xl font-black mt-1">{tenders.length}</div>
//         </div>
//         <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
//           <Users className="text-blue-400 w-5 h-5 mb-2" />
//           <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Registered Users</div>
//           <div className="text-3xl font-black mt-1">{users.length}</div>
//         </div>
//         <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
//           <CheckCircle2 className="text-green-400 w-5 h-5 mb-2" />
//           <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Bids Processed</div>
//           <div className="text-3xl font-black mt-1">{bids.length}</div>
//         </div>
//       </div>

//       {/* Tab Navigation & Search */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-4">
//         <div className="flex gap-4">
//           {[
//             { id: 'users', label: 'Users & Roles', icon: Users },
//             { id: 'tenders', label: 'All Tenders', icon: FileText },
//             { id: 'bids', label: 'Global Bids', icon: Gavel },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
//               className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
//                 activeTab === tab.id ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white bg-white/5'
//               }`}
//             >
//               <tab.icon className="w-4 h-4" /> {tab.label}
//             </button>
//           ))}
//         </div>

//         <div className="relative w-full md:w-80">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//           <input
//             type="text"
//             placeholder={`Search ${activeTab}...`}
//             className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2 rounded-2xl text-sm outline-none focus:border-primary/50"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Data Table Content */}
//       <div className="bg-[#121212] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-white/5 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
//             {activeTab === 'users' && (
//               <tr>
//                 <th className="p-5">User ID</th>
//                 <th className="p-5">Name</th>
//                 <th className="p-5">Email</th>
//                 <th className="p-5 text-right">Role</th>
//               </tr>
//             )}
//             {activeTab === 'tenders' && (
//               <tr>
//                 <th className="p-5">Tender ID</th>
//                 <th className="p-5">Title</th>
//                 <th className="p-5">Organization</th>
//                 <th className="p-5">Category</th>
//                 <th className="p-5 text-right">Status</th>
//               </tr>
//             )}
//             {activeTab === 'bids' && (
//               <tr>
//                 <th className="p-5">Bid ID</th>
//                 <th className="p-5">Tender</th>
//                 <th className="p-5">Vendor</th>
//                 <th className="p-5">Amount</th>
//                 <th className="p-5 text-right">Status</th>
//               </tr>
//             )}
//           </thead>
//           <tbody className="divide-y divide-white/5">
//             {loading ? (
//               <tr><td colSpan={5} className="p-20 text-center"><Activity className="animate-spin inline mr-2 text-primary"/> Loading system data...</td></tr>
//             ) : (
//               activeTab === 'users' ? filteredUsers.map(user => (
//                 <tr key={user.userId} className="hover:bg-white/5 group transition-all">
//                   <td className="p-5 font-mono text-xs text-primary">#{user.userId}</td>
//                   <td className="p-5 font-bold text-sm">{user.name}</td>
//                   <td className="p-5 text-sm text-muted-foreground">{user.email}</td>
//                   <td className="p-5 text-right">
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
//                       {user.role}
//                     </span>
//                   </td>
//                 </tr>
//               )) :
//               activeTab === 'tenders' ? filteredTenders.map(tender => (
//                 <tr key={tender.tenderId} className="hover:bg-white/5 transition-all">
//                   <td className="p-5 font-mono text-xs text-primary">#{tender.tenderId}</td>
//                   <td className="p-5 font-bold text-sm">{tender.title}</td>
//                   <td className="p-5 text-sm text-muted-foreground">{tender.buyerOrganization}</td>
//                   <td className="p-5 text-sm text-muted-foreground">{tender.categoryName}</td>
//                   <td className="p-5 text-right font-black text-[10px] uppercase">{tender.status}</td>
//                 </tr>
//               )) :
//               filteredBids.map(bid => (
//                 <tr key={bid.bidId} className="hover:bg-white/5 transition-all">
//                   <td className="p-5 font-mono text-xs text-primary">#{bid.bidId}</td>
//                   <td className="p-5 font-bold text-sm">{bid.tenderTitle}</td>
//                   <td className="p-5 text-sm text-muted-foreground">{bid.vendorName}</td>
//                   <td className="p-5 font-bold text-sm">₹{bid.bidAmount.toLocaleString()}</td>
//                   <td className="p-5 text-right text-[10px] font-black">{bid.status}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Gavel, FileText, LayoutDashboard, LogOut, 
  ShieldCheck, Search, X, Building2, UserCircle2, 
  TrendingUp, Activity, CheckCircle2 
} from 'lucide-react';
import api from '../../services/api'; 
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

// --- Updated Interfaces to match your nested JSON ---
interface UserData {
  userId: number;
  name: string;
  email: string;
  role: string;
}

interface AdminTender {
  tenderId: number;
  title: string;
  categoryName?: string; // From DTO
  buyerOrganization?: string; // From DTO
  status: string;
  endDate: string;
}

interface AdminBid {
  bidId: number;
  bidAmount: number;
  status: string;
  submittedAt: string;
  // Handling the nested objects from your current backend response
  tender?: {
    title: string;
  };
  vendorProfile?: {
    companyName: string;
    user?: {
      name: string;
    };
  };
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'tenders' | 'bids'>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [tenders, setTenders] = useState<AdminTender[]>([]);
  const [bids, setBids] = useState<AdminBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Admin logged out");
    navigate('/login');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'tenders') {
        const res = await api.get('/admin/tenders');
        setTenders(res.data);
      } else {
        const res = await api.get('/admin/bids');
        setBids(res.data);
      }
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // --- Null-Safe Filtering Logic ---
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTenders = tenders.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.buyerOrganization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBids = bids.filter(b => {
    const term = searchTerm.toLowerCase();
    const tenderTitle = b.tender?.title?.toLowerCase() || "";
    const vendorName = b.vendorProfile?.companyName?.toLowerCase() || b.vendorProfile?.user?.name?.toLowerCase() || "";
    return tenderTitle.includes(term) || vendorName.includes(term);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-[#1a1a1a] p-6 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-3 rounded-2xl text-primary">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              Admin Control Center
            </h1>
            <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">System Oversight</p>
          </div>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="text-red-400 hover:text-white hover:bg-red-500/10 gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      {/* Tab Navigation & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-4">
        <div className="flex gap-4">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'tenders', label: 'Tenders', icon: FileText },
            { id: 'bids', label: 'Global Bids', icon: Gavel },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 rounded-2xl text-sm outline-none focus:border-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#121212] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
            {activeTab === 'users' && (
              <tr>
                <th className="p-5">ID</th>
                <th className="p-5">Name</th>
                <th className="p-5">Email</th>
                <th className="p-5 text-right">Role</th>
              </tr>
            )}
            {activeTab === 'tenders' && (
              <tr>
                <th className="p-5">Tender ID</th>
                <th className="p-5">Title</th>
                <th className="p-5">Organization</th>
                <th className="p-5 text-right">Status</th>
              </tr>
            )}
            {activeTab === 'bids' && (
              <tr>
                <th className="p-5">Bid ID</th>
                <th className="p-5">Tender Title</th>
                <th className="p-5">Vendor</th>
                <th className="p-5">Amount</th>
                <th className="p-5 text-right">Status</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center text-muted-foreground animate-pulse">Loading data...</td></tr>
            ) : (
              <>
                {activeTab === 'users' && filteredUsers.map(user => (
                  <tr key={user.userId} className="hover:bg-white/5 transition-all">
                    <td className="p-5 font-mono text-xs text-primary">#{user.userId}</td>
                    <td className="p-5 font-bold text-sm">{user.name}</td>
                    <td className="p-5 text-sm text-muted-foreground">{user.email}</td>
                    <td className="p-5 text-right">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/5 border border-white/10">
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}

                {activeTab === 'tenders' && filteredTenders.map(tender => (
                  <tr key={tender.tenderId} className="hover:bg-white/5 transition-all">
                    <td className="p-5 font-mono text-xs text-primary">#{tender.tenderId}</td>
                    <td className="p-5 font-bold text-sm">{tender.title}</td>
                    <td className="p-5 text-sm text-muted-foreground">{tender.buyerOrganization || "N/A"}</td>
                    <td className="p-5 text-right">
                      <span className={`px-2 py-1 rounded text-[10px] font-black ${tender.status === 'OPEN' ? 'text-green-400' : 'text-red-400'}`}>
                        {tender.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {activeTab === 'bids' && filteredBids.map(bid => (
                  <tr key={bid.bidId} className="hover:bg-white/5 transition-all">
                    <td className="p-5 font-mono text-xs text-primary">#{bid.bidId}</td>
                    <td className="p-5 font-bold text-sm">{bid.tender?.title || "N/A"}</td>
                    <td className="p-5 text-sm text-muted-foreground">
                      {bid.vendorProfile?.companyName || bid.vendorProfile?.user?.name || "N/A"}
                    </td>
                    <td className="p-5 font-bold text-sm text-primary">₹{bid.bidAmount?.toLocaleString()}</td>
                    <td className="p-5 text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest">{bid.status}</span>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;