import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const nav = useNavigate();
  const location = useLocation();  

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Products", path: "products", icon: "📦" },
    { name: "Orders", path: "orders", icon: "🛒" },
    { name: "Users", path: "users", icon: "👥" },
    
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin");
    nav("/login");
  };

  return (
    <div className="flex  h-screen bg-[#0f0a07] overflow-y-auto text-[#e6c89c]">
      
   
      <aside className="w-64 border-r border-[#c8a97e]/10 bg-[#0a0705] flex flex-col justify-between p-8 fixed h-full">
        <div>
        
          <div className="mb-12">
            <h1 className="text-2xl font-serif italic text-[#c8a97e] tracking-tighter">
              Luxora <span className="text-[10px] block uppercase tracking-[0.3em] font-sans not-italic opacity-50">Admin Suite</span>
            </h1>
          </div>

          <nav className="space-y-6">
            {menuItems.map((item) => (
              <div
                key={item.name}
                onClick={() => nav(item.path)}
                className={`flex items-center gap-4 cursor-pointer text-xs uppercase tracking-[0.2em] transition-all duration-300 group
                  ${isActive(item.path) ? "text-white" : "text-[#c8a97e]/40 hover:text-[#e6c89c]"}`}
              >
                <span className={`transition-transform duration-300 group-hover:scale-125 ${isActive(item.path) ? "scale-110" : "opacity-50"}`}>
                  {item.icon}
                </span>
                {item.name}
                {isActive(item.path) && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-[#c8a97e] shadow-[0_0_8px_#c8a97e]"></div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-rose-900/60 hover:text-rose-700 transition-colors pt-8 border-t border-[#c8a97e]/5"
        >
          <span>🚪</span> Logout
        </button>
      </aside>

      
      <main className="flex-1 ml-64 p-12 overflow-y-auto">
 
        <header className="flex justify-between items-center mb-16">
          <h2 className="text-3xl font-serif italic tracking-wide">
            {menuItems.find(i => isActive(i.path))?.name || "Suite"}
          </h2>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest opacity-40">
            <span>System Status:</span>
            <span className="text-emerald-500 font-bold">● Active</span>
          </div>
        </header>

  
        <div className="bg-[#1a140e]/30 border border-[#c8a97e]/5 rounded-sm p-8 min-h-[70vh] backdrop-blur-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}