import { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, User, StickyNote, ShieldCheck, MessageCircle, CheckCircle } from 'lucide-react';
import { supabase } from './supabaseClient';
import './index.css';

export default function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);
  const [userName, setUserName] = useState("");
  const [text, setText] = useState("");
  
  // New State for Replies and Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  // --- READ: Fetch Data from Cloud ---
  const fetchData = async () => {
    // 1. Fetch Messages
    const { data: msgData, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    // 2. Fetch Replies
    const { data: repData, error: repError } = await supabase
      .from('replies')
      .select('*')
      .order('created_at', { ascending: true }); // Oldest replies at top of thread

    if (!msgError && !repError) {
      setMessages(msgData);
      setReplies(repData);
    } else {
      console.error("Message Error:", msgError?.message, "Reply Error:", repError?.message);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Realtime Listener for BOTH tables
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'replies' }, fetchData)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // --- ADMIN: Toggle Admin Mode ---
  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false); // Turn off easily
      return;
    }
    const passcode = prompt("Enter Admin Passcode:");
    if (passcode === import.meta.env.VITE_ADMIN_PASSCODE) {
      setIsAdmin(true);
    } else if (passcode !== null) {
      alert("Access Denied: Incorrect Passcode 🤖");
    }
  };

  // --- ADMIN: Approve a Message ---
  const approveMessage = async (id) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_approved: true })
      .eq('id', id);
    if (!error) fetchData();
  };

  // --- CREATE: Send a new message (Hidden by default) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ author: userName.trim() || "Anonymous Scout", content: text }]);

    if (!error) {
      setText("");
      alert("Success! Your recommendation has been submitted and is pending admin approval.");
      fetchData();
    }
  };

  // --- CREATE: Post a Reply ---
  const submitReply = async (messageId) => {
    if (!replyText.trim()) return;

    const { error } = await supabase
      .from('replies')
      .insert([{ 
        message_id: messageId, 
        author: userName.trim() || "Anonymous Scout", 
        content: replyText 
      }]);

    if (!error) {
      setReplyText("");
      setReplyingTo(null);
      fetchData();
    }
  };

  // --- DELETE: Remove a main message (Cascade will delete its replies!) ---
  const deleteMessage = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this message and all its replies?")) {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      
      if (error) {
        console.error("Delete Message Error:", error);
        alert("Failed to delete! Error: " + error.message);
      } else {
        fetchData();
      }
    }
  };

  // --- DELETE: Remove a single reply ---
  const deleteReply = async (replyId) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this specific reply?")) {
      const { error } = await supabase.from('replies').delete().eq('id', replyId);
      
      if (error) {
        console.error("Delete Reply Error:", error);
        alert("Failed to delete! Error: " + error.message);
      } else {
        fetchData();
      }
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Just now";
    return new Date(isoString).toLocaleDateString() + ' ' + new Date(isoString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  // Filter messages based on Admin status
  const visibleMessages = isAdmin ? messages : messages.filter(m => m.is_approved);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* HEADER & ADMIN TOGGLE */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <MessageSquare size={40} color="var(--accent)" />
          <div>
            <h2 style={{ margin: 0, fontSize: '32px', color: 'var(--text-main)', fontWeight: '700' }}>Recommendations</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontWeight: '600' }}>Leave a note or feature request. Messages are reviewed before going public!</p>
          </div>
        </div>
        <button 
          onClick={toggleAdmin}
          style={{ 
            background: isAdmin ? 'var(--accent)' : 'transparent', 
            color: isAdmin ? '#000' : 'var(--text-muted)', 
            border: isAdmin ? 'none' : '1px solid var(--text-muted)',
            padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold'
          }}
        >
          <ShieldCheck size={16} /> {isAdmin ? "Admin Mode Active" : "Admin Login"}
        </button>
      </div>

      {/* INPUT WINDOW */}
      <div className="os-window" style={{ marginBottom: '40px' }}>
        <div className="os-titlebar">
          <span className="os-dot dot-red"></span><span className="os-dot dot-yellow"></span><span className="os-dot dot-green"></span>
          new_message.post
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
          <div style={{ marginBottom: '15px', position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" className="os-input" placeholder="Your Name (Optional)" 
              style={{ paddingLeft: '40px' }} value={userName} onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <textarea 
              className="os-input" placeholder="What's your recommendation?" 
              style={{ minHeight: '100px', resize: 'vertical' }} value={text} onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Send size={18} /> Submit for Review
          </button>
        </form>
      </div>

      {/* MESSAGE FEED */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {visibleMessages.map(msg => (
          <div key={msg.id} className="os-window" style={{ borderLeft: msg.is_approved ? '5px solid var(--accent)' : '5px solid #f39c12', opacity: !msg.is_approved ? 0.8 : 1 }}>
            
            {/* Main Message */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <StickyNote size={16} color={msg.is_approved ? "var(--accent)" : "#f39c12"} />
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{msg.author}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {formatDate(msg.created_at)}</span>
                  {!msg.is_approved && (
                     <span style={{ fontSize: '11px', backgroundColor: '#f39c12', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>PENDING</span>
                  )}
                </div>
                
                {/* Admin Controls */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {!msg.is_approved && (
                      <button onClick={() => approveMessage(msg.id)} style={{ background: '#27c93f', color: '#000', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                        <CheckCircle size={14} /> Approve
                      </button>
                    )}
                    <button onClick={() => deleteMessage(msg.id)} style={{ background: '#ff5f56', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
              <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: '1.5', fontWeight: '500', whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </p>
              
              {/* Reply Button Trigger */}
              {msg.is_approved && replyingTo !== msg.id && (
                <button 
                  onClick={() => setReplyingTo(msg.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 'bold', marginTop: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: 0 }}
                >
                  <MessageCircle size={14} /> Reply
                </button>
              )}
            </div>

            {/* Replies Section */}
            {msg.is_approved && (
              <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--window-border)' }}>
                
                {/* Render existing replies */}
                {replies.filter(r => r.message_id === msg.id).map(reply => (
                  <div key={reply.id} style={{ padding: '15px 20px 15px 40px', borderBottom: '1px solid var(--window-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    
                    {/* Reply Content */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '14px' }}>{reply.author}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDate(reply.created_at)}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.4' }}>{reply.content}</p>
                    </div>

                    {/* Admin Delete Button */}
                    {isAdmin && (
                      <button 
                        onClick={() => deleteReply(reply.id)} 
                        style={{ background: 'transparent', color: '#ff5f56', border: '1px solid #ff5f56', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold', marginLeft: '15px' }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                ))}

                {/* Reply Input Box */}
                {replyingTo === msg.id && (
                  <div style={{ padding: '15px 20px 15px 40px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      
                      {/* Name Input */}
                      <div style={{ position: 'relative', width: '180px' }}>
                        <User size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" className="os-input" placeholder="Your Name" 
                          style={{ width: '100%', padding: '10px 10px 10px 32px' }} 
                          value={userName} 
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>

                      {/* Reply Text Input */}
                      <input 
                        type="text" className="os-input" placeholder="Write a reply..." 
                        style={{ flex: 1, padding: '10px', minWidth: '200px' }} 
                        value={replyText} 
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => submitReply(msg.id)} style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '6px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Send
                      </button>
                      <button onClick={() => {setReplyingTo(null); setReplyText("");}} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--text-muted)', padding: '6px 15px', borderRadius: '6px', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
          </div>
        ))}

        {visibleMessages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No public recommendations yet.
          </div>
        )}
      </div>
    </div>
  );
}