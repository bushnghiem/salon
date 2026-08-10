import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";


export default function AppLayout() {

    return (

        <div className="min-h-screen bg-gray-50">

            <Navbar />


            <main
                className="
                    ml-64
                    min-h-screen
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        py-8
                    "
                >

                    <Outlet />

                </div>

            </main>

        </div>
    );
}
