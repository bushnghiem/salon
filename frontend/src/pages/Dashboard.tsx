import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
    getDashboard,
    getMonthlyRevenue,
    getPopularServices,
    getTechnicianWorkload,
    getBusiestDays,
    getAverageAppointment,
} from "../api/dashboard";

import type { DashboardData } from "../types/dashboard";

import type {
    MonthlyRevenue,
    PopularService,
    TechnicianWorkload,
    BusiestDay,
    AverageAppointment,
} from "../api/dashboard";


function formatCurrency(
    value: number
): string {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
        }
    ).format(value);
}


function formatMonth(
    month: string
): string {

    const [
        year,
        monthNumber,
    ] = month.split("-").map(Number);

    const date = new Date(
        year,
        monthNumber - 1,
        1
    );

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            year: "numeric",
        }
    );
}


export default function Dashboard() {

    const { user } = useAuth();


    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);

    const [monthlyRevenue, setMonthlyRevenue] =
        useState<MonthlyRevenue[]>([]);

    const [popularServices, setPopularServices] =
        useState<PopularService[]>([]);

    const [technicianWorkload, setTechnicianWorkload] =
        useState<TechnicianWorkload[]>([]);

    const [busiestDays, setBusiestDays] =
        useState<BusiestDay[]>([]);

    const [averageAppointment, setAverageAppointment] =
        useState<AverageAppointment | null>(null);


    const [error, setError] =
        useState("");


    useEffect(() => {

        async function loadDashboard() {

            try {

                setError("");


                const [
                    dashboardData,
                    revenueData,
                    servicesData,
                    workloadData,
                    busiestDaysData,
                    averageAppointmentData,
                ] = await Promise.all([
                    getDashboard(),
                    getMonthlyRevenue(),
                    getPopularServices(),
                    getTechnicianWorkload(),
                    getBusiestDays(),
                    getAverageAppointment(),
                ]);


                setDashboard(
                    dashboardData
                );

                setMonthlyRevenue(
                    revenueData
                );

                setPopularServices(
                    servicesData
                );

                setTechnicianWorkload(
                    workloadData
                );

                setBusiestDays(
                    busiestDaysData
                );

                setAverageAppointment(
                    averageAppointmentData
                );

            } catch {

                setError(
                    "Failed to load dashboard."
                );

            }

        }


        loadDashboard();

    }, []);


    if (error) {

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


    const maxRevenue =
        Math.max(
            ...monthlyRevenue.map(
                (item) => Number(item.revenue)
            ),
            1
        );


    const maxServiceAppointments =
        Math.max(
            ...popularServices.map(
                (item) => item.appointments
            ),
            1
        );


    const maxTechnicianAppointments =
        Math.max(
            ...technicianWorkload.map(
                (item) => item.appointments
            ),
            1
        );


    const maxDayAppointments =
        Math.max(
            ...busiestDays.map(
                (item) => item.appointments
            ),
            1
        );


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
                        {formatCurrency(
                            Number(
                                dashboard.revenue.today
                            )
                        )}
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
                                                {new Date(
                                                    appointment.time
                                                ).toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "numeric",
                                                        minute: "2-digit",
                                                    }
                                                )}
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

            <div>

                <div className="mb-5">

                    <h2
                        className="
                            text-xl
                            font-semibold
                            text-gray-900
                        "
                    >
                        Analytics
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-gray-500
                        "
                    >
                        Overview of your salon's performance.
                    </p>

                </div>


                {/* Analytics Summary */}

                <div
                    className="
                        mb-5
                        grid
                        grid-cols-1
                        gap-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >

                    {/* Average Appointment */}

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

                        <p
                            className="
                                text-sm
                                font-medium
                                text-gray-500
                            "
                        >
                            Average Completed Appointment
                        </p>

                        <p
                            className="
                                mt-3
                                text-2xl
                                font-bold
                                text-gray-900
                            "
                        >
                            {formatCurrency(
                                Number(
                                    averageAppointment?.average_appointment ??
                                    0
                                )
                            )}
                        </p>

                    </div>


                    {/* Total Completed */}

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

                        <p
                            className="
                                text-sm
                                font-medium
                                text-gray-500
                            "
                        >
                            Completed Appointments
                        </p>

                        <p
                            className="
                                mt-3
                                text-2xl
                                font-bold
                                text-gray-900
                            "
                        >
                            {dashboard.status.completed}
                        </p>

                    </div>


                    {/* Cancellation Rate */}

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

                        <p
                            className="
                                text-sm
                                font-medium
                                text-gray-500
                            "
                        >
                            No Shows
                        </p>

                        <p
                            className="
                                mt-3
                                text-2xl
                                font-bold
                                text-gray-900
                            "
                        >
                            {dashboard.status.no_show}
                        </p>

                    </div>

                </div>


                {/* Revenue + Services */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        lg:grid-cols-2
                    "
                >

                    {/* Monthly Revenue */}

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

                        <div className="mb-5">

                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                Monthly Revenue
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Revenue from completed appointments.
                            </p>

                        </div>


                        {monthlyRevenue.length === 0 ? (

                            <p
                                className="
                                    py-6
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                No revenue data available.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {monthlyRevenue.map(
                                    (item) => (

                                        <div
                                            key={item.month}
                                        >

                                            <div
                                                className="
                                                    mb-1.5
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-sm
                                                        text-gray-600
                                                    "
                                                >
                                                    {formatMonth(
                                                        item.month
                                                    )}
                                                </span>

                                                <span
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-gray-900
                                                    "
                                                >
                                                    {formatCurrency(
                                                        Number(
                                                            item.revenue
                                                        )
                                                    )}
                                                </span>

                                            </div>


                                            <div
                                                className="
                                                    h-2
                                                    overflow-hidden
                                                    rounded-full
                                                    bg-gray-100
                                                "
                                            >

                                                <div
                                                    className="
                                                        h-full
                                                        rounded-full
                                                        bg-green-500
                                                    "
                                                    style={{
                                                        width: `${
                                                            (
                                                                Number(
                                                                    item.revenue
                                                                ) /
                                                                maxRevenue
                                                            ) *
                                                            100
                                                        }%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* Popular Services */}

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

                        <div className="mb-5">

                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                Popular Services
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Services with the most appointments.
                            </p>

                        </div>


                        {popularServices.length === 0 ? (

                            <p
                                className="
                                    py-6
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                No service data available.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {popularServices
                                    .slice(0, 6)
                                    .map(
                                        (item) => (

                                            <div
                                                key={
                                                    item.service
                                                }
                                            >

                                                <div
                                                    className="
                                                        mb-1.5
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-4
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            text-sm
                                                            text-gray-600
                                                        "
                                                    >
                                                        {
                                                            item.service
                                                        }
                                                    </span>

                                                    <span
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-gray-900
                                                        "
                                                    >
                                                        {
                                                            item.appointments
                                                        }
                                                    </span>

                                                </div>


                                                <div
                                                    className="
                                                        h-2
                                                        overflow-hidden
                                                        rounded-full
                                                        bg-gray-100
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            h-full
                                                            rounded-full
                                                            bg-blue-500
                                                        "
                                                        style={{
                                                            width: `${
                                                                (
                                                                    item.appointments /
                                                                    maxServiceAppointments
                                                                ) *
                                                                100
                                                            }%`,
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        )
                                    )}

                            </div>

                        )}

                    </div>

                </div>


                {/* Technician Workload + Busiest Days */}

                <div
                    className="
                        mt-5
                        grid
                        grid-cols-1
                        gap-5
                        lg:grid-cols-2
                    "
                >

                    {/* Technician Workload */}

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

                        <div className="mb-5">

                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                Technician Workload
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Appointments handled by each technician.
                            </p>

                        </div>


                        {technicianWorkload.length === 0 ? (

                            <p
                                className="
                                    py-6
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                No technician data available.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {technicianWorkload.map(
                                    (item) => (

                                        <div
                                            key={
                                                item.technician
                                            }
                                        >

                                            <div
                                                className="
                                                    mb-1.5
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-sm
                                                        text-gray-600
                                                    "
                                                >
                                                    {
                                                        item.technician
                                                    }
                                                </span>

                                                <span
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-gray-900
                                                    "
                                                >
                                                    {
                                                        item.appointments
                                                    }
                                                </span>

                                            </div>


                                            <div
                                                className="
                                                    h-2
                                                    overflow-hidden
                                                    rounded-full
                                                    bg-gray-100
                                                "
                                            >

                                                <div
                                                    className="
                                                        h-full
                                                        rounded-full
                                                        bg-purple-500
                                                    "
                                                    style={{
                                                        width: `${
                                                            (
                                                                item.appointments /
                                                                maxTechnicianAppointments
                                                            ) *
                                                            100
                                                        }%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* Busiest Days */}

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

                        <div className="mb-5">

                            <h3
                                className="
                                    text-base
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                Busiest Days
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Appointment volume by day of the week.
                            </p>

                        </div>


                        {busiestDays.length === 0 ? (

                            <p
                                className="
                                    py-6
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                No appointment data available.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {busiestDays.map(
                                    (item) => (

                                        <div
                                            key={
                                                item.day
                                            }
                                        >

                                            <div
                                                className="
                                                    mb-1.5
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-sm
                                                        text-gray-600
                                                    "
                                                >
                                                    {
                                                        item.day
                                                    }
                                                </span>

                                                <span
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-gray-900
                                                    "
                                                >
                                                    {
                                                        item.appointments
                                                    }
                                                </span>

                                            </div>


                                            <div
                                                className="
                                                    h-2
                                                    overflow-hidden
                                                    rounded-full
                                                    bg-gray-100
                                                "
                                            >

                                                <div
                                                    className="
                                                        h-full
                                                        rounded-full
                                                        bg-orange-500
                                                    "
                                                    style={{
                                                        width: `${
                                                            (
                                                                item.appointments /
                                                                maxDayAppointments
                                                            ) *
                                                            100
                                                        }%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}
