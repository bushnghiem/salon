import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
    getDashboard,
    getPopularServices,
    getTechnicianWorkload,
    getBusiestDays,
    getMonthlyRevenue,
} from "../api/dashboard";

import type {
    DashboardData,
    PopularService,
    TechnicianWorkload,
    BusiestDay,
    Timeframe,
    MonthlyRevenue,
} from "../types/dashboard";


function timeframeLabel(
    timeframe: Timeframe
): string {

    if (timeframe === "week") {
        return "This Week";
    }

    if (timeframe === "month") {
        return "This Month";
    }

    return "This Year";
}


export default function Dashboard() {

    const { user } = useAuth();


    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);


    const [popularServices, setPopularServices] =
        useState<PopularService[]>([]);


    const [technicianWorkload, setTechnicianWorkload] =
        useState<TechnicianWorkload[]>([]);


    const [busiestDays, setBusiestDays] =
        useState<BusiestDay[]>([]);


    const [popularServicesTimeframe, setPopularServicesTimeframe] =
        useState<Timeframe>("month");


    const [technicianWorkloadTimeframe, setTechnicianWorkloadTimeframe] =
        useState<Timeframe>("month");


    const [busiestDaysTimeframe, setBusiestDaysTimeframe] =
        useState<Timeframe>("month");


    const [monthlyRevenue, setMonthlyRevenue] =
        useState<MonthlyRevenue[]>([]);


    const [loadingAnalytics, setLoadingAnalytics] =
        useState(true);


    const [error, setError] =
        useState("");


    useEffect(() => {

        async function loadDashboard() {

            try {

                setError("");

                const [
                    dashboardData,
                    revenueData,
                ] = await Promise.all([
                    getDashboard(),
                    getMonthlyRevenue(),
                ]);

                setDashboard(dashboardData);
                setMonthlyRevenue(revenueData);

            } catch {

                setError(
                    "Failed to load dashboard."
                );

            }

        }


        loadDashboard();

    }, []);


    useEffect(() => {

        async function loadAnalytics() {

            try {

                setLoadingAnalytics(true);

                const [
                    services,
                    workload,
                    days,
                ] = await Promise.all([

                    getPopularServices(
                        popularServicesTimeframe
                    ),

                    getTechnicianWorkload(
                        technicianWorkloadTimeframe
                    ),

                    getBusiestDays(
                        busiestDaysTimeframe
                    ),

                ]);


                setPopularServices(
                    services
                );

                setTechnicianWorkload(
                    workload
                );

                setBusiestDays(
                    days
                );

            } catch {

                setError(
                    "Failed to load dashboard analytics."
                );

            } finally {

                setLoadingAnalytics(false);

            }

        }


        loadAnalytics();

    }, [
        popularServicesTimeframe,
        technicianWorkloadTimeframe,
        busiestDaysTimeframe,
    ]);


    if (error && !dashboard) {

        return (

            <div
                className="
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                "
            >
                {error}
            </div>

        );
    }


    if (!dashboard) {

        return (

            <div
                className="
                    flex
                    min-h-[300px]
                    items-center
                    justify-center
                    text-sm
                    text-gray-500
                "
            >
                Loading dashboard...
            </div>

        );
    }


    return (

        <div className="space-y-8">

            {/* Page Header */}

            <div>

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-gray-900
                    "
                >
                    Dashboard
                </h1>


                <p
                    className="
                        mt-2
                        text-sm
                        text-gray-500
                    "
                >
                    Welcome back, {user?.full_name}.
                    Here's what's happening today.
                </p>

            </div>


            {/* Analytics Error */}

            {error && (

                <div
                    className="
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-700
                    "
                >
                    {error}
                </div>

            )}


            {/* Summary Cards */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    lg:grid-cols-4
                "
            >

                {/* Appointments */}

                <div
                    className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-medium
                                text-gray-500
                            "
                        >
                            Today's Appointments
                        </p>


                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-blue-50
                                text-blue-600
                            "
                        >
                            📅
                        </div>

                    </div>


                    <p
                        className="
                            mt-4
                            text-3xl
                            font-bold
                            text-gray-900
                        "
                    >
                        {dashboard.today.appointments}
                    </p>

                </div>


                {/* Revenue */}

                <div
                    className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-medium
                                text-gray-500
                            "
                        >
                            Revenue Today
                        </p>


                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-green-50
                                text-green-600
                            "
                        >
                            $
                        </div>

                    </div>


                    <p
                        className="
                            mt-4
                            text-3xl
                            font-bold
                            text-gray-900
                        "
                    >
                        ${Number(
                            dashboard.revenue.today
                        ).toFixed(2)}
                    </p>

                </div>


                {/* Customers */}

                <div
                    className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-medium
                                text-gray-500
                            "
                        >
                            Customers
                        </p>


                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-purple-50
                                text-purple-600
                            "
                        >
                            👥
                        </div>

                    </div>


                    <p
                        className="
                            mt-4
                            text-3xl
                            font-bold
                            text-gray-900
                        "
                    >
                        {dashboard.customers}
                    </p>

                </div>


                {/* Technicians */}

                <div
                    className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-medium
                                text-gray-500
                            "
                        >
                            Technicians
                        </p>


                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-orange-50
                                text-orange-600
                            "
                        >
                            ✂
                        </div>

                    </div>


                    <p
                        className="
                            mt-4
                            text-3xl
                            font-bold
                            text-gray-900
                        "
                    >
                        {dashboard.technicians}
                    </p>

                </div>

            </div>


            {/* Monthly Revenue */}

            <div
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                "
            >

                <div
                    className="
                        border-b
                        border-gray-200
                        px-6
                        py-5
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-gray-900
                        "
                    >
                        Monthly Revenue
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-gray-500
                        "
                    >
                        Completed appointment revenue by month.
                    </p>

                </div>


                {monthlyRevenue.length === 0 ? (

                    <div
                        className="
                            px-6
                            py-12
                            text-center
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-medium
                                text-gray-900
                            "
                        >
                            No revenue data available.
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >
                            Completed appointments will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="p-6">

                        <div className="space-y-4">

                            {monthlyRevenue.map(
                                (month) => {

                                    const maxRevenue =
                                        Math.max(
                                            ...monthlyRevenue.map(
                                                (item) =>
                                                    Number(item.revenue)
                                            ),
                                            1
                                        );

                                    const percentage =
                                        (
                                            Number(month.revenue) /
                                            maxRevenue
                                        ) * 100;


                                    return (

                                        <div
                                            key={month.month}
                                        >

                                            <div
                                                className="
                                                    mb-2
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-gray-700
                                                    "
                                                >
                                                    {month.month}
                                                </span>

                                                <span
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-gray-900
                                                    "
                                                >
                                                    $
                                                    {Number(
                                                        month.revenue
                                                    ).toFixed(2)}
                                                </span>

                                            </div>


                                            <div
                                                className="
                                                    h-3
                                                    overflow-hidden
                                                    rounded-full
                                                    bg-gray-100
                                                "
                                            >

                                                <div
                                                    className="
                                                        h-full
                                                        rounded-full
                                                        bg-blue-600
                                                        transition-all
                                                    "
                                                    style={{
                                                        width:
                                                            `${percentage}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </div>

                )}

            </div>


            {/* Upcoming Appointments */}

            <div
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                "
            >

                <div
                    className="
                        border-b
                        border-gray-200
                        px-6
                        py-5
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-gray-900
                        "
                    >
                        Upcoming Appointments
                    </h2>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-gray-500
                        "
                    >
                        Today's upcoming appointments.
                    </p>

                </div>


                {dashboard.upcoming.length === 0 ? (

                    <div
                        className="
                            px-6
                            py-12
                            text-center
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-medium
                                text-gray-900
                            "
                        >
                            No upcoming appointments.
                        </p>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >
                            Your schedule is clear.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table
                            className="
                                min-w-full
                                divide-y
                                divide-gray-200
                            "
                        >

                            <thead
                                className="
                                    bg-gray-50
                                "
                            >

                                <tr>

                                    <th
                                        className="
                                            px-6
                                            py-3
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-gray-500
                                        "
                                    >
                                        Customer
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-3
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-gray-500
                                        "
                                    >
                                        Service
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-3
                                            text-left
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-gray-500
                                        "
                                    >
                                        Technician
                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-3
                                            text-right
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-gray-500
                                        "
                                    >
                                        Time
                                    </th>

                                </tr>

                            </thead>


                            <tbody
                                className="
                                    divide-y
                                    divide-gray-200
                                    bg-white
                                "
                            >

                                {dashboard.upcoming.map(
                                    (appointment) => (

                                        <tr
                                            key={
                                                appointment.appointment_id
                                            }
                                            className="
                                                transition-colors
                                                hover:bg-gray-50
                                            "
                                        >

                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-6
                                                    py-4
                                                    text-sm
                                                    font-medium
                                                    text-gray-900
                                                "
                                            >
                                                {
                                                    appointment.customer
                                                }
                                            </td>


                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-6
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                "
                                            >
                                                {
                                                    appointment.service
                                                }
                                            </td>


                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-6
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                "
                                            >
                                                {
                                                    appointment.technician
                                                }
                                            </td>


                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-6
                                                    py-4
                                                    text-right
                                                    text-sm
                                                    font-medium
                                                    text-gray-900
                                                "
                                            >
                                                {
                                                    appointment.time
                                                }
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* Analytics */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-6
                    lg:grid-cols-3
                "
            >

                {/* Popular Services */}

                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            border-b
                            border-gray-200
                            px-6
                            py-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-semibold
                                        text-gray-900
                                    "
                                >
                                    Popular Services
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    Most booked services.
                                </p>

                            </div>


                            <select
                                value={
                                    popularServicesTimeframe
                                }
                                onChange={(e) =>
                                    setPopularServicesTimeframe(
                                        e.target.value as Timeframe
                                    )
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    text-gray-700
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20
                                "
                            >

                                <option value="week">
                                    This Week
                                </option>

                                <option value="month">
                                    This Month
                                </option>

                                <option value="year">
                                    This Year
                                </option>

                            </select>

                        </div>

                    </div>


                    <div className="divide-y divide-gray-100">

                        {loadingAnalytics ? (

                            <div
                                className="
                                    px-6
                                    py-10
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Loading...
                            </div>

                        ) : popularServices.length === 0 ? (

                            <div
                                className="
                                    px-6
                                    py-10
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                No appointments found for{" "}
                                {timeframeLabel(
                                    popularServicesTimeframe
                                ).toLowerCase()}.
                            </div>

                        ) : (

                            popularServices
                                .slice(0, 5)
                                .map(
                                    (
                                        service,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                service.service
                                            }
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                px-6
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        h-8
                                                        w-8
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-blue-50
                                                        text-sm
                                                        font-semibold
                                                        text-blue-600
                                                    "
                                                >
                                                    {index + 1}
                                                </div>


                                                <span
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-gray-900
                                                    "
                                                >
                                                    {
                                                        service.service
                                                    }
                                                </span>

                                            </div>


                                            <span
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-700
                                                "
                                            >
                                                {
                                                    service.appointments
                                                }
                                            </span>

                                        </div>

                                    )
                                )

                        )}

                    </div>

                </div>


                {/* Technician Workload */}

                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            border-b
                            border-gray-200
                            px-6
                            py-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-semibold
                                        text-gray-900
                                    "
                                >
                                    Technician Workload
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    Appointments assigned
                                    during the selected period.
                                </p>

                            </div>


                            <select
                                value={
                                    technicianWorkloadTimeframe
                                }
                                onChange={(e) =>
                                    setTechnicianWorkloadTimeframe(
                                        e.target.value as Timeframe
                                    )
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    text-gray-700
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20
                                "
                            >

                                <option value="week">
                                    This Week
                                </option>

                                <option value="month">
                                    This Month
                                </option>

                                <option value="year">
                                    This Year
                                </option>

                            </select>

                        </div>

                    </div>


                    <div className="divide-y divide-gray-100">

                        {loadingAnalytics ? (

                            <div
                                className="
                                    px-6
                                    py-10
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Loading...
                            </div>

                        ) : technicianWorkload.length === 0 ? (

                            <div
                                className="
                                    px-6
                                    py-10
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                No appointments found for{" "}
                                {timeframeLabel(
                                    technicianWorkloadTimeframe
                                ).toLowerCase()}.
                            </div>

                        ) : (

                            technicianWorkload
                                .slice(0, 5)
                                .map(
                                    (
                                        technician,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                technician.technician
                                            }
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                px-6
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        h-8
                                                        w-8
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-orange-50
                                                        text-sm
                                                        font-semibold
                                                        text-orange-600
                                                    "
                                                >
                                                    {index + 1}
                                                </div>


                                                <span
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-gray-900
                                                    "
                                                >
                                                    {
                                                        technician.technician
                                                    }
                                                </span>

                                            </div>


                                            <span
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-700
                                                "
                                            >
                                                {
                                                    technician.appointments
                                                }
                                            </span>

                                        </div>

                                    )
                                )

                        )}

                    </div>

                </div>


                {/* Busiest Days */}

                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            border-b
                            border-gray-200
                            px-6
                            py-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-semibold
                                        text-gray-900
                                    "
                                >
                                    Busiest Days
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    Appointments by day.
                                </p>

                            </div>


                            <select
                                value={
                                    busiestDaysTimeframe
                                }
                                onChange={(e) =>
                                    setBusiestDaysTimeframe(
                                        e.target.value as Timeframe
                                    )
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    text-gray-700
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20
                                "
                            >

                                <option value="week">
                                    This Week
                                </option>

                                <option value="month">
                                    This Month
                                </option>

                                <option value="year">
                                    This Year
                                </option>

                            </select>

                        </div>

                    </div>


                    <div className="divide-y divide-gray-100">

                        {loadingAnalytics ? (

                            <div
                                className="
                                    px-6
                                    py-10
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Loading...
                            </div>

                        ) : busiestDays.length === 0 ? (

                            <div
                                className="
                                    px-6
                                    py-10
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                No appointments found for{" "}
                                {timeframeLabel(
                                    busiestDaysTimeframe
                                ).toLowerCase()}.
                            </div>

                        ) : (

                            busiestDays
                                .slice(0, 7)
                                .map(
                                    (
                                        day,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                day.day
                                            }
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                px-6
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        h-8
                                                        w-8
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-purple-50
                                                        text-sm
                                                        font-semibold
                                                        text-purple-600
                                                    "
                                                >
                                                    {index + 1}
                                                </div>


                                                <span
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-gray-900
                                                    "
                                                >
                                                    {day.day}
                                                </span>

                                            </div>


                                            <span
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-700
                                                "
                                            >
                                                {
                                                    day.appointments
                                                }
                                            </span>

                                        </div>

                                    )
                                )

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}
