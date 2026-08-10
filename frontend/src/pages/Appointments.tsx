import { useEffect, useState } from "react";

import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";

import {
    getAppointments,
    getAvailability,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
} from "../api/appointments";

import { getCustomers } from "../api/customers";
import { getTechnicians } from "../api/technicians";
import { getServices } from "../api/services";

import type {
    Appointment,
    AppointmentStatus,
} from "../types/appointment";

import type { Customer } from "../types/customer";
import type { Technician } from "../types/technician";
import type { Service } from "../types/service";


const STATUSES: AppointmentStatus[] = [
    "Scheduled",
    "Confirmed",
    "Completed",
    "Cancelled",
    "No Show",
];


function formatTime(
    dateTime: string
): string {

    const date = new Date(dateTime);

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}


function formatDateForApi(
    date: Date
): string {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDisplayDate(
    date: string
): string {

    const [year, month, day] =
        date.split("-").map(Number);

    const localDate = new Date(
        year,
        month - 1,
        day
    );

    return localDate.toLocaleDateString(
        undefined,
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );
}


function formatDuration(
    minutes: number
): string {

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(
        minutes / 60
    );

    const remainingMinutes =
        minutes % 60;

    if (remainingMinutes === 0) {
        return hours === 1
            ? "1 hr"
            : `${hours} hrs`;
    }

    return `${hours} hr${
        hours === 1 ? "" : "s"
    } ${remainingMinutes} min`;
}


function formatPrice(
    price: number
): string {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
        }
    ).format(price);
}


function getStatusClasses(
    status: AppointmentStatus
): string {

    switch (status) {

        case "Scheduled":
            return `
                bg-blue-50
                text-blue-700
            `;

        case "Confirmed":
            return `
                bg-green-50
                text-green-700
            `;

        case "Completed":
            return `
                bg-gray-100
                text-gray-700
            `;

        case "Cancelled":
            return `
                bg-red-50
                text-red-700
            `;

        case "No Show":
            return `
                bg-yellow-50
                text-yellow-700
            `;

        default:
            return `
                bg-gray-100
                text-gray-700
            `;
    }
}


export default function Appointments() {

    const today = formatDateForApi(
        new Date()
    );


    const [appointments, setAppointments] =
        useState<Appointment[]>([]);

    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [technicians, setTechnicians] =
        useState<Technician[]>([]);

    const [services, setServices] =
        useState<Service[]>([]);


    const [selectedDate, setSelectedDate] =
        useState(today);

    const [technicianFilter, setTechnicianFilter] =
        useState<number | "">("");

    const [statusFilter, setStatusFilter] =
        useState<AppointmentStatus | "">("");


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [editingAppointment, setEditingAppointment] =
        useState<Appointment | null>(null);


    const [customerId, setCustomerId] =
        useState<number | "">("");

    const [customerSearch, setCustomerSearch] =
        useState("");

    const [showCustomerResults, setShowCustomerResults] =
        useState(false);


    const [technicianId, setTechnicianId] =
        useState<number | "">("");

    const [serviceId, setServiceId] =
        useState<number | "">("");

    const [appointmentDate, setAppointmentDate] =
        useState(today);

    const [appointmentTime, setAppointmentTime] =
        useState("");

    const [notes, setNotes] =
        useState("");


    const [availableTimes, setAvailableTimes] =
        useState<string[]>([]);

    const [loadingAvailability, setLoadingAvailability] =
        useState(false);


    const filteredCustomers =
        customers.filter((customer) =>
            customer.name
                .toLowerCase()
                .includes(
                    customerSearch.toLowerCase()
                )
        );


    async function loadAppointments() {

        try {

            setLoading(true);
            setError("");


            const data =
                await getAppointments(
                    selectedDate,
                    technicianFilter === ""
                        ? undefined
                        : technicianFilter,
                    statusFilter === ""
                        ? undefined
                        : statusFilter
                );


            setAppointments(data);

        } catch {

            setError(
                "Failed to load appointments."
            );

        } finally {

            setLoading(false);

        }
    }


    async function loadSupportingData() {

        try {

            const [
                customersData,
                techniciansData,
                servicesData,
            ] = await Promise.all([
                getCustomers(),
                getTechnicians(),
                getServices(),
            ]);


            setCustomers(customersData);
            setTechnicians(techniciansData);
            setServices(servicesData);

        } catch {

            setError(
                "Failed to load appointment data."
            );
        }
    }


    useEffect(() => {

        loadSupportingData();

    }, []);


    useEffect(() => {

        loadAppointments();

    }, [
        selectedDate,
        technicianFilter,
        statusFilter,
    ]);


    useEffect(() => {

        async function loadAvailability() {

            if (
                technicianId === "" ||
                serviceId === "" ||
                !appointmentDate
            ) {
                setAvailableTimes([]);
                setAppointmentTime("");
                return;
            }


            try {

                setLoadingAvailability(true);


                const times =
                    await getAvailability(
                        technicianId,
                        serviceId,
                        appointmentDate,
                        editingAppointment?.id
                    );


                setAvailableTimes(times);


                if (
                    !times.includes(
                        appointmentTime
                    )
                ) {
                    setAppointmentTime("");
                }

            } catch {

                setAvailableTimes([]);

                setAppointmentTime("");

                setError(
                    "Failed to load available appointment times."
                );

            } finally {

                setLoadingAvailability(false);

            }
        }


        loadAvailability();

    }, [
        technicianId,
        serviceId,
        appointmentDate,
    ]);


    function openAddModal() {

        setEditingAppointment(null);

        setCustomerId("");

        setCustomerSearch("");

        setShowCustomerResults(false);

        setTechnicianId("");

        setServiceId("");

        setAppointmentDate(
            selectedDate
        );

        setAppointmentTime("");

        setNotes("");

        setAvailableTimes([]);

        setError("");

        setIsModalOpen(true);
    }


    function openEditModal(
        appointment: Appointment
    ) {

        const appointmentDateTime =
            new Date(
                appointment.appointment_time
            );


        const customer =
            customers.find(
                (customer) =>
                    customer.id ===
                    appointment.customer_id
            );


        setEditingAppointment(
            appointment
        );

        setCustomerId(
            appointment.customer_id
        );

        setCustomerSearch(
            customer?.name ?? ""
        );

        setShowCustomerResults(false);

        setTechnicianId(
            appointment.technician_id
        );

        setServiceId(
            appointment.service_id
        );

        setAppointmentDate(
            formatDateForApi(
                appointmentDateTime
            )
        );

        setAppointmentTime(
            `${String(
                appointmentDateTime.getHours()
            ).padStart(2, "0")}:${String(
                appointmentDateTime.getMinutes()
            ).padStart(2, "0")}`
        );

        setNotes(
            appointment.notes ?? ""
        );

        setError("");

        setIsModalOpen(true);
    }


    function closeModal() {

        setIsModalOpen(false);

        setEditingAppointment(null);

        setCustomerId("");

        setCustomerSearch("");

        setShowCustomerResults(false);

        setTechnicianId("");

        setServiceId("");

        setAppointmentDate(
            selectedDate
        );

        setAppointmentTime("");

        setNotes("");

        setAvailableTimes([]);

    }


    function buildAppointmentDateTime():
        string {

        return `${appointmentDate}T${appointmentTime}:00`;
    }


    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setError("");


        if (
            customerId === "" ||
            technicianId === "" ||
            serviceId === ""
        ) {

            setError(
                "Please select a customer, technician, and service."
            );

            return;
        }


        if (!appointmentTime) {

            setError(
                "Please select an available appointment time."
            );

            return;
        }


        try {

            const appointmentDateTime =
                buildAppointmentDateTime();


            if (editingAppointment) {

                const updated =
                    await updateAppointment(
                        editingAppointment.id,
                        {
                            customer_id:
                                customerId,

                            technician_id:
                                technicianId,

                            service_id:
                                serviceId,

                            appointment_time:
                                appointmentDateTime,

                            notes:
                                notes.trim() || null,
                        }
                    );


                setAppointments(
                    (current) =>
                        current.map(
                            (appointment) =>
                                appointment.id ===
                                updated.id
                                    ? updated
                                    : appointment
                        )
                );

            } else {

                const created =
                    await createAppointment({
                        customer_id:
                            customerId,

                        technician_id:
                            technicianId,

                        service_id:
                            serviceId,

                        appointment_time:
                            appointmentDateTime,

                        notes:
                            notes.trim() || null,
                    });


                setAppointments(
                    (current) => [
                        ...current,
                        created,
                    ]
                );

            }


            closeModal();

        } catch {

            setError(
                editingAppointment
                    ? "Failed to update appointment."
                    : "Failed to create appointment."
            );

        }
    }


    async function handleDelete(
        id: number
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this appointment?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await deleteAppointment(id);


            setAppointments(
                (current) =>
                    current.filter(
                        (appointment) =>
                            appointment.id !== id
                    )
            );

        } catch {

            setError(
                "Failed to delete appointment."
            );

        }
    }


    async function handleStatusChange(
        appointment: Appointment,
        status: AppointmentStatus
    ) {

        try {

            setError("");


            const updated =
                await updateAppointmentStatus(
                    appointment.id,
                    { status }
                );


            setAppointments(
                (current) =>
                    current.map(
                        (item) =>
                            item.id === updated.id
                                ? updated
                                : item
                    )
            );

        } catch {

            setError(
                "Failed to update appointment status."
            );

        }
    }


    function getCustomerName(
        id: number
    ): string {

        return customers.find(
            (customer) =>
                customer.id === id
        )?.name ?? "Unknown customer";
    }


    function getTechnicianName(
        id: number
    ): string {

        return technicians.find(
            (technician) =>
                technician.id === id
        )?.name ?? "Unknown technician";
    }


    function getServiceName(
        id: number
    ): string {

        return services.find(
            (service) =>
                service.id === id
        )?.name ?? "Unknown service";
    }


    function getValidTransitions(
        status: AppointmentStatus
    ): AppointmentStatus[] {

        switch (status) {

            case "Scheduled":
                return [
                    "Confirmed",
                    "Cancelled",
                    "No Show",
                ];

            case "Confirmed":
                return [
                    "Completed",
                    "Cancelled",
                ];

            case "Completed":
            case "Cancelled":
            case "No Show":
                return [];

            default:
                return [];
        }
    }


    function changeDate(
        amount: number
    ) {

        const [
            year,
            month,
            day,
        ] = selectedDate
            .split("-")
            .map(Number);


        const date =
            new Date(
                year,
                month - 1,
                day
            );


        date.setDate(
            date.getDate() + amount
        );


        setSelectedDate(
            formatDateForApi(date)
        );
    }


    return (

        <div>

            <PageHeader
                title="Appointments"
                description="Manage your salon appointments and daily schedule."
                actionLabel="+ New Appointment"
                onAction={openAddModal}
            />


            {error && (

                <div
                    className="
                        mb-6
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


            {/* Date Navigation */}

            <div
                className="
                    mb-6
                    flex
                    flex-col
                    gap-4
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-4
                    shadow-sm
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <button
                    type="button"
                    onClick={() =>
                        changeDate(-1)
                    }
                    className="
                        rounded-lg
                        border
                        border-gray-300
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-gray-700
                        hover:bg-gray-50
                    "
                >
                    ← Previous
                </button>


                <div className="text-center">

                    <p
                        className="
                            text-lg
                            font-semibold
                            text-gray-900
                        "
                    >
                        {formatDisplayDate(
                            selectedDate
                        )}
                    </p>


                    {selectedDate === today && (

                        <p
                            className="
                                mt-1
                                text-sm
                                font-medium
                                text-blue-600
                            "
                        >
                            Today
                        </p>

                    )}

                </div>


                <button
                    type="button"
                    onClick={() =>
                        changeDate(1)
                    }
                    className="
                        rounded-lg
                        border
                        border-gray-300
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-gray-700
                        hover:bg-gray-50
                    "
                >
                    Next →
                </button>

            </div>


            {/* Filters */}

            <div
                className="
                    mb-6
                    grid
                    gap-4
                    sm:grid-cols-2
                "
            >

                <div>

                    <label
                        htmlFor="appointment-technician-filter"
                        className="
                            mb-1.5
                            block
                            text-sm
                            font-medium
                            text-gray-700
                        "
                    >
                        Technician
                    </label>


                    <select
                        id="appointment-technician-filter"
                        value={technicianFilter}
                        onChange={(e) =>
                            setTechnicianFilter(
                                e.target.value === ""
                                    ? ""
                                    : Number(
                                        e.target.value
                                    )
                            )
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-3
                            py-2
                            text-sm
                            text-gray-900
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20
                        "
                    >

                        <option value="">
                            All technicians
                        </option>


                        {technicians.map(
                            (technician) => (

                                <option
                                    key={
                                        technician.id
                                    }
                                    value={
                                        technician.id
                                    }
                                >
                                    {
                                        technician.name
                                    }
                                </option>

                            )
                        )}

                    </select>

                </div>


                <div>

                    <label
                        htmlFor="appointment-status-filter"
                        className="
                            mb-1.5
                            block
                            text-sm
                            font-medium
                            text-gray-700
                        "
                    >
                        Status
                    </label>


                    <select
                        id="appointment-status-filter"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value as
                                    AppointmentStatus |
                                    ""
                            )
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-3
                            py-2
                            text-sm
                            text-gray-900
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/20
                        "
                    >

                        <option value="">
                            All statuses
                        </option>


                        {STATUSES.map(
                            (status) => (

                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>

                            )
                        )}

                    </select>

                </div>

            </div>


            {/* Appointment List */}

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
                        py-4
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-semibold
                            text-gray-900
                        "
                    >
                        Daily Schedule
                    </h2>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-gray-500
                        "
                    >
                        {appointments.length}{" "}
                        {appointments.length === 1
                            ? "appointment"
                            : "appointments"}
                    </p>

                </div>


                {loading ? (

                    <div
                        className="
                            px-6
                            py-12
                            text-center
                            text-sm
                            text-gray-500
                        "
                    >
                        Loading appointments...
                    </div>

                ) : appointments.length === 0 ? (

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
                            No appointments scheduled.
                        </p>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >
                            Create an appointment to get started.
                        </p>

                    </div>

                ) : (

                    <div
                        className="
                            divide-y
                            divide-gray-200
                        "
                    >

                        {appointments.map(
                            (appointment) => {

                                const transitions =
                                    getValidTransitions(
                                        appointment.status
                                    );


                                return (

                                    <div
                                        key={
                                            appointment.id
                                        }
                                        className="
                                            p-6
                                            transition-colors
                                            hover:bg-gray-50
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-4
                                                lg:flex-row
                                                lg:items-start
                                                lg:justify-between
                                            "
                                        >

                                            {/* Appointment Info */}

                                            <div
                                                className="
                                                    flex
                                                    gap-5
                                                "
                                            >

                                                <div
                                                    className="
                                                        w-24
                                                        flex-shrink-0
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-gray-900
                                                        "
                                                    >
                                                        {
                                                            formatTime(
                                                                appointment.appointment_time
                                                            )
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            text-gray-500
                                                        "
                                                    >
                                                        {
                                                            formatDuration(
                                                                appointment.booked_duration
                                                            )
                                                        }
                                                    </p>

                                                </div>


                                                <div>

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-gray-900
                                                        "
                                                    >
                                                        {
                                                            getServiceName(
                                                                appointment.service_id
                                                            )
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            text-gray-600
                                                        "
                                                    >
                                                        {
                                                            getCustomerName(
                                                                appointment.customer_id
                                                            )
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            text-gray-500
                                                        "
                                                    >
                                                        Technician:{" "}
                                                        {
                                                            getTechnicianName(
                                                                appointment.technician_id
                                                            )
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            text-gray-500
                                                        "
                                                    >
                                                        {
                                                            formatPrice(
                                                                appointment.booked_price
                                                            )
                                                        }
                                                    </p>


                                                    {appointment.notes && (

                                                        <p
                                                            className="
                                                                mt-2
                                                                max-w-xl
                                                                text-sm
                                                                text-gray-500
                                                            "
                                                        >
                                                            <span
                                                                className="
                                                                    font-medium
                                                                    text-gray-700
                                                                "
                                                            >
                                                                Notes:
                                                            </span>{" "}
                                                            {
                                                                appointment.notes
                                                            }
                                                        </p>

                                                    )}

                                                </div>

                                            </div>


                                            {/* Actions */}

                                            <div
                                                className="
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-3
                                                    lg:justify-end
                                                "
                                            >

                                                <span
                                                    className={`
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-semibold
                                                        ${getStatusClasses(
                                                            appointment.status
                                                        )}
                                                    `}
                                                >
                                                    {
                                                        appointment.status
                                                    }
                                                </span>


                                                {transitions.map(
                                                    (status) => (

                                                        <button
                                                            key={
                                                                status
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    appointment,
                                                                    status
                                                                )
                                                            }
                                                            className="
                                                                text-sm
                                                                font-medium
                                                                text-blue-600
                                                                hover:text-blue-800
                                                            "
                                                        >
                                                            {status ===
                                                            "Confirmed"
                                                                ? "Confirm"
                                                                : status ===
                                                                  "Completed"
                                                                ? "Complete"
                                                                : status ===
                                                                  "Cancelled"
                                                                ? "Cancel"
                                                                : "No Show"}
                                                        </button>

                                                    )
                                                )}


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(
                                                            appointment
                                                        )
                                                    }
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-gray-700
                                                        hover:text-gray-900
                                                    "
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            appointment.id
                                                        )
                                                    }
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-red-600
                                                        hover:text-red-800
                                                    "
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>


            {/* Add / Edit Modal */}

            <Modal
                isOpen={isModalOpen}
                title={
                    editingAppointment
                        ? "Edit Appointment"
                        : "New Appointment"
                }
                onClose={closeModal}
            >

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Customer */}

                    <div className="relative">

                        <label
                            htmlFor="appointment-customer-search"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Customer
                        </label>


                        <input
                            id="appointment-customer-search"
                            type="text"
                            value={customerSearch}
                            onChange={(e) => {
                                setCustomerSearch(
                                    e.target.value
                                );

                                setCustomerId("");

                                setShowCustomerResults(
                                    true
                                );
                            }}
                            onFocus={() => {
                                setShowCustomerResults(
                                    true
                                );
                            }}
                            placeholder="Search customers..."
                            required={
                                customerId === ""
                            }
                            autoFocus
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                            "
                        />


                        {showCustomerResults && (

                            <div
                                className="
                                    absolute
                                    left-0
                                    right-0
                                    z-20
                                    mt-1
                                    max-h-60
                                    overflow-y-auto
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-white
                                    shadow-lg
                                "
                            >

                                {filteredCustomers.length === 0 ? (

                                    <div
                                        className="
                                            px-3
                                            py-3
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        No customers found.
                                    </div>

                                ) : (

                                    filteredCustomers.map(
                                        (customer) => (

                                            <button
                                                key={
                                                    customer.id
                                                }
                                                type="button"
                                                onClick={() => {
                                                    setCustomerId(
                                                        customer.id
                                                    );

                                                    setCustomerSearch(
                                                        customer.name
                                                    );

                                                    setShowCustomerResults(
                                                        false
                                                    );
                                                }}
                                                className="
                                                    block
                                                    w-full
                                                    px-3
                                                    py-2.5
                                                    text-left
                                                    text-sm
                                                    text-gray-700
                                                    hover:bg-blue-50
                                                    hover:text-blue-700
                                                "
                                            >
                                                {
                                                    customer.name
                                                }
                                            </button>

                                        )
                                    )

                                )}

                            </div>

                        )}

                    </div>


                    {/* Technician */}

                    <div>

                        <label
                            htmlFor="appointment-technician"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Technician
                        </label>


                        <select
                            id="appointment-technician"
                            value={technicianId}
                            onChange={(e) =>
                                setTechnicianId(
                                    e.target.value === ""
                                        ? ""
                                        : Number(
                                            e.target.value
                                        )
                                )
                            }
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                            "
                        >

                            <option value="">
                                Select a technician
                            </option>


                            {technicians.map(
                                (technician) => (

                                    <option
                                        key={
                                            technician.id
                                        }
                                        value={
                                            technician.id
                                        }
                                    >
                                        {
                                            technician.name
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* Service */}

                    <div>

                        <label
                            htmlFor="appointment-service"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Service
                        </label>


                        <select
                            id="appointment-service"
                            value={serviceId}
                            onChange={(e) =>
                                setServiceId(
                                    e.target.value === ""
                                        ? ""
                                        : Number(
                                            e.target.value
                                        )
                                )
                            }
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                            "
                        >

                            <option value="">
                                Select a service
                            </option>


                            {services.map(
                                (service) => (

                                    <option
                                        key={
                                            service.id
                                        }
                                        value={
                                            service.id
                                        }
                                    >
                                        {
                                            service.name
                                        }
                                        {" — "}
                                        {
                                            formatPrice(
                                                service.price
                                            )
                                        }
                                        {" / "}
                                        {
                                            formatDuration(
                                                service.duration
                                            )
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* Date */}

                    <div>

                        <label
                            htmlFor="appointment-date"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Date
                        </label>


                        <input
                            id="appointment-date"
                            type="date"
                            value={
                                appointmentDate
                            }
                            onChange={(e) =>
                                setAppointmentDate(
                                    e.target.value
                                )
                            }
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                            "
                        />

                    </div>


                    {/* Available Times */}

                    {technicianId !== "" &&
                        serviceId !== "" && (

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >
                                Available Times
                            </label>


                            {loadingAvailability ? (

                                <p
                                    className="
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    Loading available times...
                                </p>

                            ) : availableTimes.length ===
                              0 ? (

                                <p
                                    className="
                                        rounded-lg
                                        bg-gray-50
                                        px-3
                                        py-3
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    No available times for this
                                    technician, service, and date.
                                </p>

                            ) : (

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-2
                                        sm:grid-cols-3
                                    "
                                >

                                    {availableTimes.map(
                                        (time) => (

                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() =>
                                                    setAppointmentTime(
                                                        time
                                                    )
                                                }
                                                className={`
                                                    rounded-lg
                                                    border
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    font-medium
                                                    transition-colors
                                                    ${
                                                        appointmentTime ===
                                                        time
                                                            ? `
                                                                border-blue-600
                                                                bg-blue-600
                                                                text-white
                                                              `
                                                            : `
                                                                border-gray-300
                                                                bg-white
                                                                text-gray-700
                                                                hover:border-blue-400
                                                                hover:bg-blue-50
                                                              `
                                                    }
                                                `}
                                            >
                                                {(() => {

                                                    const [
                                                        hour,
                                                        minute,
                                                    ] =
                                                        time
                                                            .split(":")
                                                            .map(
                                                                Number
                                                            );


                                                    const suffix =
                                                        hour >=
                                                        12
                                                            ? "PM"
                                                            : "AM";

                                                    const displayHour =
                                                        hour % 12 ||
                                                        12;


                                                    return `${displayHour}:${String(
                                                        minute
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )} ${suffix}`;

                                                })()}
                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    )}


                    {/* Notes */}

                    <div>

                        <label
                            htmlFor="appointment-notes"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Notes
                        </label>


                        <textarea
                            id="appointment-notes"
                            value={notes}
                            onChange={(e) =>
                                setNotes(
                                    e.target.value
                                )
                            }
                            rows={3}
                            placeholder="Optional appointment notes..."
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border
                                border-gray-300
                                px-3
                                py-2
                                text-sm
                                text-gray-900
                                outline-none
                                placeholder:text-gray-400
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                            "
                        />

                    </div>


                    {/* Buttons */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            pt-2
                        "
                    >

                        <button
                            type="button"
                            onClick={closeModal}
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-gray-700
                                hover:bg-gray-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                loadingAvailability ||
                                !appointmentTime ||
                                customerId === "" ||
                                technicianId === "" ||
                                serviceId === ""
                            }
                            className="
                                rounded-lg
                                bg-blue-600
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {editingAppointment
                                ? "Save Changes"
                                : "Create Appointment"}
                        </button>

                    </div>

                </form>

            </Modal>

        </div>
    );
}
