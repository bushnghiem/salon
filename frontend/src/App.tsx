import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Technicians from "./pages/Technicians";
import Services from "./pages/Services";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Appointments from "./pages/Appointments";


function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Login />}
            />


            <Route
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                <Route
                    path="/customers"
                    element={<Customers />}
                />

                <Route
                    path="/technicians"
                    element={<Technicians />}
                />

                <Route
                    path="/services"
                    element={<Services />}
                />

                <Route
                    path="/appointments"
                    element={<Appointments />}
                />

            </Route>

        </Routes>
    );
}


export default App;
