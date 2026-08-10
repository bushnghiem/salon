import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


export default function Navbar() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();


    function handleLogout() {

        logout();

        navigate("/");

    }


    const linkClasses = ({
        isActive,
    }: {
        isActive: boolean;
    }) => `

        flex
        items-center

        rounded-lg

        px-3
        py-2

        text-sm
        font-medium

        transition-colors

        ${
            isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
        }

    `;


    return (

        <aside
            className="
                fixed
                inset-y-0
                left-0
                z-50

                flex
                w-64
                flex-col

                border-r
                border-gray-200

                bg-white
            "
        >

            {/* Application name */}

            <div
                className="
                    flex
                    h-16
                    items-center

                    border-b
                    border-gray-200

                    px-6
                "
            >

                <NavLink
                    to="/dashboard"
                    className="
                        text-xl
                        font-bold
                        text-gray-900
                    "
                >
                    Salon Manager
                </NavLink>

            </div>


            {/* Navigation */}

            <nav
                className="
                    flex-1
                    space-y-1
                    px-4
                    py-6
                "
            >

                <NavLink
                    to="/dashboard"
                    className={linkClasses}
                >
                    Dashboard
                </NavLink>


                <NavLink
                    to="/customers"
                    className={linkClasses}
                >
                    Customers
                </NavLink>


                <NavLink
                    to="/technicians"
                    className={linkClasses}
                >
                    Technicians
                </NavLink>


                <NavLink
                    to="/appointments"
                    className={linkClasses}
                >
                    Appointments
                </NavLink>


                <NavLink
                    to="/services"
                    className={linkClasses}
                >
                    Services
                </NavLink>

            </nav>


            {/* User / logout */}

            <div
                className="
                    border-t
                    border-gray-200
                    p-4
                "
            >

                <div className="mb-3 px-2">

                    <p
                        className="
                            text-sm
                            font-medium
                            text-gray-900
                        "
                    >
                        {user?.full_name}
                    </p>


                    <p
                        className="
                            truncate
                            text-xs
                            text-gray-500
                        "
                    >
                        {user?.email}
                    </p>

                </div>


                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        w-full
                        rounded-lg

                        px-3
                        py-2

                        text-left
                        text-sm
                        font-medium

                        text-gray-700

                        transition-colors

                        hover:bg-gray-100
                    "
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}
