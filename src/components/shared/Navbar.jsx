import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { getToken, clearToken } from "../../utils/auth";
import { getMe } from "../../services/auth.api";

export default function Navbar() {
    const navigate = useNavigate();
    const token = getToken();
    const [me, setMe] = useState(null);

    // ✅ NavLink Class logic fixed
    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary font-bold active"
            : "text-base-content/80 hover:text-primary font-medium";

    const handleLogout = () => {
        clearToken();
        localStorage.removeItem("dev_bypass");
        setMe(null);
        navigate("/");
        window.location.reload();
    };

    useEffect(() => {
        const loadMe = async () => {
            if (!token) return setMe(null);
            try {
                const res = await getMe();
                setMe(res.data);
            } catch {
                clearToken();
                setMe(null);
            }
        };
        loadMe();
    }, [token]);

    const initials = me?.name
        ? me.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
        : "U";

    return (
        <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
            <div className="navbar max-w-6xl mx-auto px-3 sm:px-4">

                {/* LEFT: Logo */}
                <div className="navbar-start">
                    <Logo />
                </div>

                {/* CENTER: Desktop menu */}
                <div className="navbar-center hidden md:flex">
                    <ul className="menu menu-horizontal gap-1">
                        <li><NavLink className={navLinkClass} to="/">Home</NavLink></li>
                        <li><NavLink className={navLinkClass} to="/courses">Courses</NavLink></li>

                        {/* ✅ Dashboard when logged in OR dev_bypass */}
                        {(token && me) ? (
                            <li>
                                <NavLink
                                    className={navLinkClass}
                                    to={me.role === "admin" ? "/admin" : "/student"}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                        ) : (localStorage.getItem("dev_bypass") === "true") ? (
                            <>
                                <li><NavLink className={navLinkClass} to="/student">Student Portal</NavLink></li>
                                <li><NavLink className={navLinkClass} to="/admin">Admin Portal</NavLink></li>
                            </>
                        ) : null}
                    </ul>
                </div>

                {/* RIGHT: User Profile & Mobile Menu */}
                <div className="navbar-end gap-2">
                    <ThemeToggle />

                    {/* Desktop buttons if NOT logged in */}
                    {!token && (
                        <div className="hidden md:flex gap-2">
                            <Link to="/login" className="btn btn-sm btn-ghost">Login</Link>
                            <Link to="/register" className="btn btn-sm btn-primary">Enroll Now</Link>
                        </div>
                    )}

                    {/* Desktop avatar if logged in */}
                    {token && me && (
                        <div className="hidden md:block dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                                    {initials}
                                </div>
                            </label>

                            <ul
                                tabIndex={0}
                                className="dropdown-content mt-3 p-3 shadow-xl bg-base-100 rounded-box w-60 border border-base-300 z-50"
                            >
                                <div className="px-2 pb-2">
                                    <p className="font-semibold">{me.name}</p>
                                    <p className="text-xs text-base-content/70 truncate">{me.email}</p>
                                    <p className="text-xs badge badge-outline mt-1 capitalize">{me.role}</p>
                                </div>

                                <div className="my-1 border-t border-base-300" />

                                <li>
                                    <Link to={me.role === "admin" ? "/admin" : "/student"}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li><Link to="/profile">Profile</Link></li>
                                <li>
                                    <button onClick={handleLogout} className="text-error font-medium">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* 📱 Mobile Hamburger Menu (Fixes Applied) */}
                    <div className="dropdown dropdown-end md:hidden">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>

                        <ul
                            tabIndex={0}
                            className="
                                menu menu-sm dropdown-content mt-3 p-4 shadow-2xl
                                bg-base-100 rounded-box w-64 border border-base-300
                                z-50 max-h-[85vh] overflow-y-auto space-y-1
                            "
                        >
                            {/* User Info header on Mobile if logged in */}
                            {token && me && (
                                <div className="flex flex-col items-center gap-1 pb-3 mb-2 border-b border-base-300">
                                    <div className="w-11 h-11 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">
                                        {initials}
                                    </div>
                                    <p className="font-semibold text-sm mt-1">{me?.name}</p>
                                    <p className="text-xs text-base-content/70 truncate max-w-[180px]">{me?.email}</p>
                                    <span className="badge badge-xs badge-outline capitalize">{me?.role}</span>
                                </div>
                            )}

                            <li><NavLink className={navLinkClass} to="/">Home</NavLink></li>
                            <li><NavLink className={navLinkClass} to="/courses">Courses</NavLink></li>

                            {/* Mobile Dashboard link when logged in */}
                            {token && me && (
                                <li>
                                    <NavLink
                                        className={navLinkClass}
                                        to={me?.role === "admin" ? "/admin" : "/student"}
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                            )}

                            {/* Dev Bypass Links for Mobile */}
                            {(!token && localStorage.getItem("dev_bypass") === "true") && (
                                <>
                                    <li><NavLink className={navLinkClass} to="/student">Student Portal</NavLink></li>
                                    <li><NavLink className={navLinkClass} to="/admin">Admin Portal</NavLink></li>
                                </>
                            )}

                            <div className="my-2 border-t border-base-300" />

                            {!token ? (
                                <div className="flex flex-col gap-2 pt-1">
                                    <Link to="/login" className="btn btn-ghost btn-sm w-full">
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn btn-primary btn-sm w-full">
                                        Enroll Now
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <li><Link to="/profile">Profile</Link></li>
                                    <li>
                                        <button onClick={handleLogout} className="btn btn-error btn-outline btn-sm w-full mt-2 text-error">
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                </div>
            </div>
        </header>
    );
}