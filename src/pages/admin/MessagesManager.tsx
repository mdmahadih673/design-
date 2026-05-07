import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Button } from '@/src/components/Button';
import { Mail, Phone, Calendar, Trash2, CheckCircle, Clock, Eye, X, Paperclip, Download } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
  timestamp: any;
  status: 'read' | 'unread';
  referenceFile?: {
    name: string;
    data: string;
    type: string;
  } | null;
}

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    setLoading(false);
  }

  const handleToggleRead = async (msg: Message) => {
    const newStatus = msg.status === 'read' ? 'unread' : 'read';
    await updateDoc(doc(db, 'messages', msg.id), { status: newStatus });
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this message?')) {
      await deleteDoc(doc(db, 'messages', id));
      fetchMessages();
    }
  };

  const openMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      await updateDoc(doc(db, 'messages', msg.id), { status: 'read' });
      fetchMessages();
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return 'N/A';
    if (ts.toDate) return ts.toDate().toLocaleString();
    return new Date(ts).toLocaleString();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/2 dark:bg-white/2 border-b border-black/5 dark:border-white/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-light-text">Client</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-light-text">Project Type</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-light-text">Date</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-light-text">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-light-text text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {messages.map((msg) => (
              <tr key={msg.id} className={`hover:bg-black/2 dark:hover:bg-white/2 transition-colors ${msg.status === 'unread' ? 'font-bold' : ''}`}>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm">{msg.name}</p>
                    <p className="text-xs text-light-text">{msg.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg">{msg.projectType}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-light-text">{formatDate(msg.timestamp).split(',')[0]}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${msg.status === 'read' ? 'bg-slate-500/10 text-slate-500' : 'bg-accent/10 text-accent'}`}>
                    {msg.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openMessage(msg)} className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"><Eye size={18} /></button>
                  <button onClick={() => handleDelete(msg.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {messages.length === 0 && <div className="p-12 text-center text-light-text">No messages yet.</div>}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card w-full max-w-2xl rounded-3xl p-8 border border-black/10 dark:border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold font-heading">Inquiry Details</h3>
              <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-light-text">
                  <Mail size={18} />
                  <a href={`mailto:${selectedMessage.email}`} className="text-foreground hover:text-accent font-medium">{selectedMessage.email}</a>
                </div>
                <div className="flex items-center gap-3 text-light-text">
                  <Phone size={18} />
                  <span className="text-foreground font-medium">{selectedMessage.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-light-text">
                  <Calendar size={18} />
                  <span className="text-foreground font-medium">{formatDate(selectedMessage.timestamp)}</span>
                </div>
              </div>
              <div className="space-y-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-light-text">Project Type</p>
                  <p className="font-bold">{selectedMessage.projectType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-light-text">Budget Range</p>
                  <p className="font-bold">{selectedMessage.budget || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {selectedMessage.referenceFile && (
              <div className="mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-light-text mb-2">Reference File</p>
                <div className="flex items-center justify-between bg-accent/5 border border-accent/20 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Paperclip size={18} className="text-accent shrink-0" />
                    <span className="text-sm font-semibold truncate">{selectedMessage.referenceFile.name}</span>
                  </div>
                  <a 
                    href={selectedMessage.referenceFile.data} 
                    download={selectedMessage.referenceFile.name}
                    className="p-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Download size={16} />
                  </a>
                </div>
              </div>
            )}

            <div className="space-y-2 mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-light-text">Message</p>
              <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap h-48 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex gap-4">
              <a href={`mailto:${selectedMessage.email}`} className="flex-grow">
                <Button className="w-full gap-2">
                  <Mail size={18} /> Reply via Email
                </Button>
              </a>
              <Button variant="outline" onClick={() => handleToggleRead(selectedMessage)} className="gap-2">
                <CheckCircle size={18} /> Mark as {selectedMessage.status === 'read' ? 'Unread' : 'Read'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
