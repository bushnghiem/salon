import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";

import {
    getTechnicians,
    createTechnician,
    updateTechnician,
    deleteTechnician,
} from "../api/technicians";

import type {
    Technician,
} from "../types/technician";


function formatHour(hour: number): string {

    if (hour === 0) {
        return "12:00 AM";
    }

    if (hour === 12) {
        return "12:00 PM";
    }

    if (hour > 12) {
        return `${hour - 12}:00 PM`;
    }

    return `${hour}:00 AM`;
}


export default function Technicians() {

    const [technicians, setTechnicians] =
        useState<Technician[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [modalError, setModalError] =
        useState("");

    
    const [search, setSearch] = 
        useState("");

    
    const [name, setName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [workStart, setWorkStart] =
        useState(9);

    const [workEnd, setWorkEnd] =
        useState(17);


    const [editingTechnician, setEditingTechnician] =
        useState<Technician | null>(null);

    const [isModalOpen, setIsModalOpen] =
        useState(false);


    async function loadTechnicians(
            searchValue = ""
        ) {

        try {

            setLoading(true);
            setError("");

            const data =
                await getTechnicians(searchValue);


            setTechnicians(data);

        } catch {

            setError(
                "Failed to load technicians."
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadTechnicians();

    }, []);


    function openAddModal() {

        setEditingTechnician(null);

        setName("");
        setPhone("");

        setWorkStart(9);
        setWorkEnd(17);

        setError("");
        setModalError("");


        setIsModalOpen(true);

    }


    function openEditModal(
        technician: Technician
    ) {

        setEditingTechnician(technician);

        setName(technician.name);
        setPhone(technician.phone);

        setWorkStart(
            technician.work_start
        );

        setWorkEnd(
            technician.work_end
        );

        setError("");
        setModalError("");

        setIsModalOpen(true);

    }


    function closeModal() {

        setIsModalOpen(false);

        setEditingTechnician(null);

        setName("");
        setPhone("");

        setWorkStart(9);
        setWorkEnd(17);

        setModalError("");
    }


    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setError("");


        if (workStart >= workEnd) {

            setModalError(
                "Work start time must be before work end time."
            );

            return;
        }


        try {

            if (editingTechnician) {

                const updated =
                    await updateTechnician(
                        editingTechnician.id,
                        {
                            name,
                            phone,
                            work_start: workStart,
                            work_end: workEnd,
                        }
                    );


                setTechnicians((current) =>
                    current.map((technician) =>
                        technician.id === updated.id
                            ? updated
                            : technician
                    )
                );

            } else {

                const created =
                    await createTechnician({
                        name,
                        phone,
                        work_start: workStart,
                        work_end: workEnd,
                    });


                setTechnicians((current) => [
                    ...current,
                    created,
                ]);

            }


            closeModal();

        } catch {

            setModalError(
                editingTechnician
                    ? "Failed to update technician."
                    : "Failed to create technician."
            );

        }
    }


    async function handleDelete(
        id: number
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this technician?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await deleteTechnician(id);


            setTechnicians((current) =>
                current.filter(
                    (technician) =>
                        technician.id !== id
                )
            );

        } catch {

            setError(
                "Failed to delete technician."
            );

        }
    }

    async function handleSearch(
        e: React.FormEvent
    ) {

        e.preventDefault();

        await loadTechnicians(search);
    }



    return (

        <div>

            {/* Page Header */}

            <PageHeader
                title="Technicians"
                description="Manage your salon technicians and their working hours."
                actionLabel="+ Add Technician"
                onAction={openAddModal}
            />



            {/* Error */}

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

            {/* Search */}

            <SearchBar
                value={search}
                onChange={setSearch}
                onSubmit={handleSearch}
                placeholder="Search by name or phone..."
            />


            {/* Technician Table */}

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
                        Technician List
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-gray-500
                        "
                    >
                        {technicians.length}{" "}
                        {technicians.length === 1
                            ? "technician"
                            : "technicians"}
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
                        Loading technicians...
                    </div>

                ) : technicians.length === 0 ? (

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
                            No technicians found.
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >
                            Add a technician to get started.
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
                                        Name
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
                                        Phone
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
                                        Work Hours
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
                                        Actions
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

                                {technicians.map(
                                    (technician) => (

                                        <tr
                                            key={
                                                technician.id
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
                                                    technician.name
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
                                                    technician.phone
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
                                                {formatHour(
                                                    technician.work_start
                                                )}
                                                {" – "}
                                                {formatHour(
                                                    technician.work_end
                                                )}
                                            </td>


                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-6
                                                    py-4
                                                    text-right
                                                    text-sm
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(
                                                            technician
                                                        )
                                                    }
                                                    className="
                                                        mr-4
                                                        font-medium
                                                        text-blue-600
                                                        hover:text-blue-800
                                                    "
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            technician.id
                                                        )
                                                    }
                                                    className="
                                                        font-medium
                                                        text-red-600
                                                        hover:text-red-800
                                                    "
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* Add / Edit Modal */}

            <Modal
                isOpen={isModalOpen}
                title={
                    editingTechnician
                        ? "Edit Technician"
                        : "Add Technician"
                }
                onClose={closeModal}
            >
                {modalError && (

                    <div
                        className="
                            mb-5
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
                        {modalError}
                    </div>

                )}
                
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Name */}

                    <div>

                        <label
                            htmlFor="technician-name"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Name
                        </label>

                        <input
                            id="technician-name"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            required
                            autoFocus
                            placeholder="Sarah Smith"
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

                                placeholder:text-gray-400

                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                            "
                        />

                    </div>


                    {/* Phone */}

                    <div>

                        <label
                            htmlFor="technician-phone"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Phone
                        </label>

                        <input
                            id="technician-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) =>
                                setPhone(
                                    e.target.value
                                )
                            }
                            required
                            placeholder="612-555-1234"
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

                                placeholder:text-gray-400

                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                            "
                        />

                    </div>


                    {/* Work Start */}

                    <div>

                        <label
                            htmlFor="technician-work-start"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Work Start
                        </label>

                        <select
                            id="technician-work-start"
                            value={workStart}
                            onChange={(e) =>
                                setWorkStart(
                                    Number(
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

                            {Array.from(
                                { length: 24 },
                                (_, hour) => (

                                    <option
                                        key={hour}
                                        value={hour}
                                    >
                                        {formatHour(hour)}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* Work End */}

                    <div>

                        <label
                            htmlFor="technician-work-end"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Work End
                        </label>

                        <select
                            id="technician-work-end"
                            value={workEnd}
                            onChange={(e) =>
                                setWorkEnd(
                                    Number(
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

                            {Array.from(
                                { length: 24 },
                                (_, hour) => (

                                    <option
                                        key={hour}
                                        value={hour}
                                    >
                                        {formatHour(hour)}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* Modal Buttons */}

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
                            className="
                                rounded-lg
                                bg-blue-600
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-blue-700
                            "
                        >
                            {editingTechnician
                                ? "Save Changes"
                                : "Add Technician"
                            }
                        </button>

                    </div>

                </form>
            </Modal>


        </div>
    );
}