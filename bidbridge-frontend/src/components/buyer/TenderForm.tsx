import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

interface Category {
  categoryId: number;
  name: string;
}

const TenderForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const buyerProfileId = localStorage.getItem('profileId');

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories'); // Ensure you have this endpoint
        setCategories(res.data);
      } catch (err) {
        toast.error("Could not load categories");
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    if (!buyerProfileId) return toast.error("Session expired. Please login.");
    
    setLoading(true);
    try {
      const payload = {
        ...data,
        buyerProfileId: parseInt(buyerProfileId),
        categoryId: parseInt(data.categoryId),
        // Format dates for LocalDateTime in Spring Boot
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      await api.post('/buyers/tenders', payload);
      toast.success("Tender published successfully!");
      navigate('/buyer/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create tender");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto text-white">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Button>

      <div className="bg-muted/20 border border-border p-8 rounded-xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Publish New Tender</h2>
          <p className="text-muted-foreground text-sm">Fill in the details to invite bids from verified vendors.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tender Title</Label>
            <Input {...register('title', { required: "Title is required" })} placeholder="e.g., Annual IT Hardware Procurement 2026" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register('description')} placeholder="Detailed requirements..." className="h-32" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <select 
                {...register('categoryId', { required: true })}
                className="w-full bg-background border border-border rounded-md h-10 px-3 text-sm"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Max Budget (₹)</Label>
              <Input type="number" {...register('budgetMax', { required: true })} placeholder="500000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="datetime-local" {...register('startDate', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>End Date (Closing Date)</Label>
              <Input type="datetime-local" {...register('endDate', { required: true })} />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Publish Tender"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TenderForm;