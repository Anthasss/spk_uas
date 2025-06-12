import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ menuItems }) => {
  const location = useLocation();
  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer"
        className="drawer-overlay"
      ></label>
      <aside className="w-64 min-h-full bg-base-200">
        <div className="p-4">
          <h2 className="text-xl font-bold text-base-content mb-4">
            SMART <br /> Penentuan Smartphone
          </h2>
        </div>
        <ul className="menu p-4 space-y-2 w-full">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="w-full"
            >
              <Link
                to={item.path}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                  location.pathname === item.path ? "bg-primary text-primary-content" : "hover:bg-base-300"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
