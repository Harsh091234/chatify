import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LogOut, MessageSquare, Settings, User, Sun, House } from "lucide-react";
import GoogleLoginButton from "./ui/GoogleLoginButton";

const Navbar = ({darkTheme, setDarkTheme}) => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className=" border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatify</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
           
            <button className="btn btn-sm" onClick={() => setDarkTheme(!darkTheme)}><Sun className="h-4 w-4"/></button>
            {authUser? (
              <>
               {/* <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link> */}
                <Link to={"/"} className={`btn btn-sm gap-2`}>
                  <House className="size-4"/>
                  <span className="hidden sm:inline">Home</span>
                </Link>

                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center btn btn-sm" onClick={logout}>
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ):(<GoogleLoginButton  />)}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;