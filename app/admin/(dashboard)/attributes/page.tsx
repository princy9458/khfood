"use client";

import { useEffect, useState, Suspense } from "react";
import {
  Tag,
  Plus,
  Edit,
  Trash,
  Search,
  Save,
  X,
  Layers,
  Sparkles,
  Award,
  Database,
  Terminal,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AttributeRecord {
  _id: string;
  name: string;
  slug: string;
  values: string[];
}

function AttributesPageContent() {
  const [attributes, setAttributes] = useState<AttributeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: "",
    slug: "",
    values: [] as string[],
  });
  const [newValue, setNewValue] = useState("");

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/attributes");
      const data = await res.json();
      setAttributes(data.data || []);
    } catch (err) {
      toast.error("Failed to load brand attributes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const resetForm = () => {
    setForm({ name: "", slug: "", values: [] });
    setNewValue("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (record: AttributeRecord) => {
    setForm({
      name: record.name,
      slug: record.slug,
      values: [...record.values],
    });
    setEditingId(record._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addValue = () => {
    if (!newValue.trim()) return;
    if (form.values.includes(newValue.trim())) {
      toast.error("Property value already exists");
      return;
    }
    setForm({ ...form, values: [...form.values, newValue.trim()] });
    setNewValue("");
  };

  const removeValue = (val: string) => {
    setForm({ ...form, values: form.values.filter((v) => v !== val) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.values.length === 0) {
      toast.error("Signature and values required for deployment.");
      return;
    }

    setSaving(true);
    const tId = toast.loading("REFINING ATTRIBUTE ARCHIVE...");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/attributes/${editingId}` : "/api/attributes";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(editingId ? "ATTRIBUTE REFINED" : "ATTRIBUTE ESTABLISHED", { id: tId });
        resetForm();
        fetchAttributes();
      } else {
        const data = await res.json();
        toast.error(data.message || "Operation failed", { id: tId });
      }
    } catch (err) {
      toast.error("Network error on deployment", { id: tId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: AttributeRecord) => {
    if (!confirm(`Permanently remove attribute "${record.name}" from premium archives?`)) return;
    const tId = toast.loading("PURGING ATTRIBUTE...");
    try {
      const res = await fetch(`/api/attributes/${record._id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("PROPERTY PURGED", { id: tId });
        fetchAttributes();
      } else {
        toast.error("Purge failure", { id: tId });
      }
    } catch (err) {
      toast.error("Network error on purge", { id: tId });
    }
  };

  const filtered = attributes.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1600px]">
      {/* LUXURY HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]">
            <Award size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] font-heading">
              Product Specifications
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            Attribute <span className="text-[#C8A97E]">Management</span>
          </h1>
          <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
            Configure dynamic properties and variants that define the product experience of KHFOOD products.
          </p>
        </div>

        <Button
          className="h-12 px-10 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/10 flex items-center gap-3"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={20} strokeWidth={2.5} /> Add Attribute
        </Button>
      </section>

      {/* LUXURY EDITOR FORM */}
      {showForm && (
        <section className="bg-[#0A0A0A] border-l-4 border-[#C8A97E] p-10 space-y-12 shadow-2xl rounded-r-[2rem] animate-in slide-in-from-top-6 duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A97E]/5 rotate-45 translate-x-32 -translate-y-32" />
          
          <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-8">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-[#C8A97E]/5 border border-[#C8A97E]/20 rounded-2xl flex items-center justify-center text-[#C8A97E] shadow-inner">
                <Tag size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-heading font-bold text-white tracking-tight">
                  {editingId ? "Refine" : "Create"} <span className="text-[#C8A97E]">Attribute</span>
                </h3>
                <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  Creating dynamic variants for store products.
                </p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="h-12 w-12 rounded-full bg-white/5 border border-white/10 text-white/20 hover:text-white transition-all flex items-center justify-center"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSave} className="relative z-10 space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Attribute Identity</label>
                <input
                  placeholder="e.g. Size, Flavor, Pack Type"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ 
                      ...prev, 
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    }))
                  }
                  className="w-full h-14 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[14px] text-white focus:border-[#C8A97E]/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Digital Path (Auto-generated)</label>
                <input
                  placeholder="size"
                  value={form.slug}
                  disabled
                  className="w-full h-14 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[14px] font-medium text-[#C8A97E]/40 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Property Value Spectrum</label>
              
              <div className="flex gap-4">
                <input
                  placeholder="Enter value (e.g. 500g, Spicy, Twin Pack)"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                  className="flex-1 h-14 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[14px] text-white focus:border-[#C8A97E]/30 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={addValue}
                  className="px-8 h-14 bg-[#C8A97E]/10 border border-[#C8A97E]/20 text-[#C8A97E] text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-[#C8A97E] hover:text-black transition-all flex items-center gap-3"
                >
                  <Plus size={18} /> Add Value
                </button>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                {form.values.map((val) => (
                  <div
                    key={val}
                    className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 rounded-full group hover:border-[#C8A97E]/30 transition-all"
                  >
                    <span className="text-[12px] font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-wider">{val}</span>
                    <button
                      type="button"
                      onClick={() => removeValue(val)}
                      className="text-white/20 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {form.values.length === 0 && (
                  <p className="text-[12px] italic text-white/20 pl-2">No values added yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-5 pt-10 border-t border-white/5">
              <button
                type="button"
                onClick={resetForm}
                className="h-14 px-10 bg-white/5 border border-white/5 text-white/30 text-[11px] font-bold uppercase tracking-widest rounded-full hover:text-white transition-all flex items-center gap-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-14 px-14 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/20 flex items-center gap-4"
              >
                {saving ? (
                  <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Save size={20} strokeWidth={2.5} />
                )}
                {editingId ? "Update Attribute" : "Save Attribute"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* FILTER & SEARCH */}
      <section className="flex flex-col lg:flex-row items-center gap-8 bg-[#0A0A0A] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <label className="flex items-center gap-4 text-white/20 px-4 min-w-fit">
          <Database size={16} />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">Search</span>
        </label>
        <div className="relative flex-1 w-full group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C8A97E] transition-colors"
            size={18}
          />
          <input
            placeholder="Search attributes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-14 pr-6 bg-[#050505] border border-white/5 rounded-2xl text-[14px] text-white placeholder:text-white/20 focus:border-[#C8A97E]/40 outline-none transition-all"
          />
        </div>
      </section>

      {/* ATTRIBUTES GRID */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
          <div className="h-12 w-12 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-lg" />
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20 animate-pulse italic">Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-8 bg-[#0A0A0A] border border-white/5 rounded-[3rem] shadow-2xl opacity-20">
          <Layers size={64} strokeWidth={1} />
          <p className="text-[12px] font-bold uppercase tracking-widest italic">No attributes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((attr) => (
            <div
              key={attr._id}
              className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] space-y-8 hover:border-[#C8A97E]/30 transition-all duration-500 group shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A97E]/10 -rotate-45 translate-x-12 -translate-y-12" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-bold text-white tracking-tight group-hover:text-[#C8A97E] transition-colors">
                    {attr.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-[#C8A97E]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#C8A97E]/60 italic font-heading">
                      {attr.slug}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(attr)}
                    className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 text-white/10 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 transition-all flex items-center justify-center"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(attr)}
                    className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 text-white/10 hover:text-red-500 hover:border-red-500/30 transition-all flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5 relative z-10">
                <div className="flex flex-wrap gap-2">
                  {attr.values.map((v) => (
                    <span
                      key={v}
                      className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest"
                    >
                      {v}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-white/10 pt-4">
                   <div className="h-0.5 flex-1 bg-white/5" />
                   <span className="text-[8px] font-black uppercase tracking-[0.4em]">{attr.values.length} VALUES</span>
                   <div className="h-0.5 flex-1 bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER INTEL */}
      <div className="flex items-center gap-4 text-white/10 px-8">
        <Terminal size={16} />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
           Proprietary Property Management Matrix v1.0.4 | Secure Channel: Stable
        </span>
      </div>
    </div>
  );
}

export default function AttributesPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen">
      <Suspense
        fallback={
          <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="h-16 w-16 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-2xl shadow-[#C8A97E]/10" />
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 italic animate-pulse">
              Initializing Specification Hub Interface...
            </span>
          </div>
        }
      >
        <AttributesPageContent />
      </Suspense>
    </div>
  );
}
