import { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, User, StickyNote } from 'lucide-react';
import { supabase } from './supabaseClient'; // <-- Importing your new database connection!
import './index.css';

export default function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("");
  const [text, setText] = useState("");

  // --- READ: Fetch messages from the Cloud ---
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false }); // Newest messages at the top

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
    }
  };

  useEffect(() => {
    // 1. Fetch messages as soon as the page loads
    fetchMessages();
    
    // 2. Set up a listener for real-time cloud updates
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        fetchMessages(); // Refresh the feed if someone else posts!
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // --- CREATE: Send a new message to Supabase ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([
        { 
          author: userName.trim() || "Anonymous Scout", 
          content: text 
        }
      ]);

    if (error) {
      console.error("Error adding document: ", error);
      alert("Oops, couldn't send the message. Check your console for details.");
    } else {
      setText("");
      setUserName("");
      fetchMessages(); // Update the screen locally
    }
  };

  // --- DELETE: Remove a message from the Cloud ---
// --- DELETE: Remove a message from the Cloud (ADMIN ONLY) ---
const deleteMessage = async (id) => {
    const passcode = prompt("Admin Passcode Required:");
    
    // We swapped the hardcoded password for the secret environment variable!
    if (passcode !== import.meta.env.VITE_ADMIN_PASSCODE) {
      alert("Access Denied: Incorrect Passcode :(");
      return; 
    }
    

    // 3. If password is right, delete it from Supabase
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting document: ", error);
    } else {
      fetchMessages(); // Update the screen
    }
  };

  // Helper function to make the database timestamps look pretty
  const formatDate = (isoString) => {
    if (!isoString) return "Just now";
    return new Date(isoString).toLocaleDateString() + ' ' + new Date(isoString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <MessageSquare size={40} color="var(--accent)" />
        <div>
          <h2 style={{ margin: 0, fontSize: '32px', color: 'var(--text-main)', fontWeight: '700' }}>Recommendations  ₍^. .^₎⟆</h2>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>Leave a note, a build tip, or a feature request. If it's doable, it'll be done!</p>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>Please note that if you leave a suggestion, it becomes public - anyone on the site will be able to see it!</p>
        </div>
      </div>

      {/* INPUT WINDOW */}
      <div className="os-window" style={{ marginBottom: '40px' }}>
        <div className="os-titlebar">
          <span className="os-dot dot-red"></span>
          <span className="os-dot dot-yellow"></span>
          <span className="os-dot dot-green"></span>
          new_message.post
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="os-input" 
              placeholder="Your Name (Optional)" 
              style={{ paddingLeft: '40px' }}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <textarea 
              className="os-input" 
              placeholder="What's your recommendation? (e.g. 'Add a battery cycle tracker!')" 
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Send size={18} /> Post Recommendation
          </button>
        </form>
      </div>

      {/* MESSAGE FEED */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map(msg => (
          <div key={msg.id} className="os-window" style={{ borderLeft: '5px solid var(--accent)' }}>
            <div style={{ padding: '20px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StickyNote size={16} color="var(--accent)" />
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{msg.author}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {formatDate(msg.created_at)}</span>
                </div>
                <button 
                  onClick={() => deleteMessage(msg.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: '1.5', fontWeight: '600', whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No recommendations yet. Be the first to leave one!
          </div>
        )}
      </div>
    </div>
  );
}