import { useEffect, useState } from "react";

import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";

import {
    getServices,
    createService,
    updateService,
    deleteService,
} from "../api/services";

import type {
    Service,
} from "../types/service";


function formatDuration(
    minutes: number
): string {

    if (minutes < 60) {
        return `${minutes} min`;
    }


    const hours =
        Math.floor(minutes / 60);

    const remainingMinutes =
        minutes % 60;


    if (remainingMinutes === 0) {

        return `${hours} ${
            hours === 1
                ? "hr"
                : "hrs"
        }`;

    }


    return `${hours} ${
        hours === 1
            ? "hr"
            : "hrs"
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


export default function Services() {

    const [services, setServices] =
        useState<Service[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [search, setSearch] =
        useState("");


    const [name, setName] =
        useState("");

    const [duration, setDuration] =
        useState(60);

    const [price, setPrice] =
        useState("");

    const [description, setDescription] =
        useState("");


    const [editingService, setEditingService] =
        useState<Service | null>(null);

    const [isModalOpen, setIsModalOpen] =
        useState(false);


    async function loadServices(
        searchValue = ""
    ) {

        try {

            setLoading(true);
            setError("");


            const data =
                await getServices(
                    searchValue
                );


            setServices(data);

        } catch {

            setError(
                "Failed to load services."
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadServices();

    }, []);


    function openAddModal() {

        setEditingService(null);

        setName("");
        setDuration(60);
        setPrice("");
        setDescription("");

        setError("");

        setIsModalOpen(true);

    }


    function openEditModal(
        service: Service
    ) {

        setEditingService(service);

        setName(service.name);

        setDuration(
            service.duration
        );

        setPrice(
            service.price.toString()
        );

        setDescription(
            service.description
        );

        setError("");

        setIsModalOpen(true);

    }


    function closeModal() {

        setIsModalOpen(false);

        setEditingService(null);

        setName("");
        setDuration(60);
        setPrice("");
        setDescription("");

    }


    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setError("");


        const trimmedName =
            name.trim();

        const trimmedDescription =
            description.trim();

        const numericPrice =
            Number(price);


        /*
         * Validate name
         */

        if (!trimmedName) {

            setError(
                "Service name is required."
            );

            return;
        }


        /*
         * Validate duration
         */

        if (
            !Number.isInteger(duration) ||
            duration <= 0
        ) {

            setError(
                "Duration must be a positive whole number of minutes."
            );

            return;
        }


        /*
         * Validate price
         */

        if (
            price.trim() === "" ||
            !Number.isFinite(numericPrice) ||
            numericPrice < 0
        ) {

            setError(
                "Price must be a valid non-negative number."
            );

            return;
        }


        /*
         * Validate description
         */

        if (!trimmedDescription) {

            setError(
                "Description is required."
            );

            return;
        }


        try {

            if (editingService) {

                /*
                 * Update existing service
                 */

                const updated =
                    await updateService(
                        editingService.id,
                        {
                            name: trimmedName,
                            duration,
                            price: numericPrice,
                            description:
                                trimmedDescription,
                        }
                    );


                setServices((current) =>
                    current.map(
                        (service) =>
                            service.id ===
                            updated.id
                                ? updated
                                : service
                    )
                );

            } else {

                /*
                 * Create new service
                 */

                const created =
                    await createService({
                        name: trimmedName,
                        duration,
                        price: numericPrice,
                        description:
                            trimmedDescription,
                    });


                setServices((current) => [
                    ...current,
                    created,
                ]);

            }


            closeModal();

        } catch {

            setError(
                editingService
                    ? "Failed to update service."
                    : "Failed to create service."
            );

        }
    }


    async function handleDelete(
        id: number
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this service?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");


            await deleteService(id);


            setServices((current) =>
                current.filter(
                    (service) =>
                        service.id !== id
                )
            );

        } catch {

            setError(
                "Failed to delete service."
            );

        }
    }


    async function handleSearch(
        e: React.FormEvent
    ) {

        e.preventDefault();

        await loadServices(search);

    }


    return (

        <div>

            {/* Page Header */}

            <PageHeader
                title="Services"
                description="Manage the services offered by your salon."
                actionLabel="+ Add Service"
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
                placeholder="Search by name or description..."
            />


            {/* Service Table */}

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

                {/* Table Header */}

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
                        Service List
                    </h2>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-gray-500
                        "
                    >
                        {services.length}{" "}
                        {services.length === 1
                            ? "service"
                            : "services"}
                    </p>

                </div>


                {/* Loading */}

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
                        Loading services...
                    </div>

                ) : services.length === 0 ? (

                    /* Empty State */

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
                            No services found.
                        </p>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >
                            Add a service to get started.
                        </p>

                    </div>

                ) : (

                    /* Service Table */

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

                                    {/* Name */}

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


                                    {/* Duration */}

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
                                        Duration
                                    </th>


                                    {/* Price */}

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
                                        Price
                                    </th>


                                    {/* Description */}

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
                                        Description
                                    </th>


                                    {/* Actions */}

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

                                {services.map(
                                    (service) => (

                                        <tr
                                            key={
                                                service.id
                                            }
                                            className="
                                                transition-colors
                                                hover:bg-gray-50
                                            "
                                        >

                                            {/* Name */}

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
                                                    service.name
                                                }
                                            </td>


                                            {/* Duration */}

                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-6
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                "
                                            >
                                                {formatDuration(
                                                    service.duration
                                                )}
                                            </td>


                                            {/* Price */}

                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-6
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                "
                                            >
                                                {formatPrice(
                                                    service.price
                                                )}
                                            </td>


                                            {/* Description */}

                                            <td
                                                className="
                                                    max-w-md
                                                    px-6
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                "
                                            >
                                                <div
                                                    className="
                                                        line-clamp-2
                                                    "
                                                >
                                                    {
                                                        service.description
                                                    }
                                                </div>
                                            </td>


                                            {/* Actions */}

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
                                                            service
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
                                                            service.id
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
                    editingService
                        ? "Edit Service"
                        : "Add Service"
                }
                onClose={closeModal}
            >

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Name */}

                    <div>

                        <label
                            htmlFor="service-name"
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
                            id="service-name"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            required
                            autoFocus
                            placeholder="Manicure"
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


                    {/* Duration */}

                    <div>

                        <label
                            htmlFor="service-duration"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Duration
                        </label>


                        <div className="relative">

                            <input
                                id="service-duration"
                                type="number"
                                min="1"
                                step="1"
                                value={duration}
                                onChange={(e) =>
                                    setDuration(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                required
                                placeholder="60"
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    pr-20
                                    text-sm
                                    text-gray-900
                                    outline-none
                                    placeholder:text-gray-400
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20
                                "
                            />


                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-sm
                                    text-gray-400
                                "
                            >
                                minutes
                            </span>

                        </div>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-gray-500
                            "
                        >
                            Enter the duration in minutes.
                        </p>

                    </div>


                    {/* Price */}

                    <div>

                        <label
                            htmlFor="service-price"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Price
                        </label>


                        <div className="relative">

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-sm
                                    text-gray-400
                                "
                            >
                                $
                            </span>


                            <input
                                id="service-price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) =>
                                    setPrice(
                                        e.target.value
                                    )
                                }
                                required
                                placeholder="45.00"
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    pl-7
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

                    </div>


                    {/* Description */}

                    <div>

                        <label
                            htmlFor="service-description"
                            className="
                                mb-1.5
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Description
                        </label>


                        <textarea
                            id="service-description"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            required
                            rows={4}
                            placeholder="A cosmetic treatment of the hands"
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
                            {editingService
                                ? "Save Changes"
                                : "Add Service"
                            }
                        </button>

                    </div>

                </form>

            </Modal>

        </div>
    );
}
