import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../api/dashboard";

import type { DashboardData } from "../types/dashboard";


export default function Dashboard() {

    const { user } = useAuth();

    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);


    useEffect(() => {

        async function loadDashboard() {

            const data = await getDashboard();

            setDashboard(data);

        }

        loadDashboard();

    }, []);



    if (!dashboard) {
        return <p>Loading dashboard...</p>;
    }


    return (

        <div>

            <h1>
                Dashboard
            </h1>


            <p>
                Welcome {user?.full_name}
            </p>


            <hr />


            <h2>Today</h2>

            <p>
                Appointments:
                {" "}
                {dashboard.today.appointments}
            </p>


            <h2>Revenue Today</h2>

            <p>
                ${dashboard.revenue.today}
            </p>


            <h2>Customers</h2>

            <p>
                {dashboard.customers}
            </p>


            <h2>Technicians</h2>

            <p>
                {dashboard.technicians}
            </p>


            <h2>Upcoming Appointments</h2>


            {dashboard.upcoming.map((appointment) => (

                <div key={appointment.appointment_id}>

                    <p>
                        {appointment.customer}
                    </p>

                    <p>
                        {appointment.service}
                        {" "}
                        with
                        {" "}
                        {appointment.technician}
                    </p>

                    <p>
                        {appointment.time}
                    </p>

                </div>

            ))}


        </div>

    );
}
