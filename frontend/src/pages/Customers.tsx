import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from "../api/customers";

import type { Customer } from "../types/customer";


export default function Customers() {

    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [search, setSearch] =
        useState("");


    const [name, setName] =
        useState("");

    const [phone, setPhone] =
        useState("");


    const [editingCustomer, setEditingCustomer] =
        useState<Customer | null>(null);

    const [isModalOpen, setIsModalOpen] =
        useState(false);


    async function loadCustomers(
        searchValue = ""
    ) {

        try {

            setLoading(true);
            setError("");

            const data =
                await getCustomers(searchValue);

            setCustomers(data);

        } catch {

            setError(
                "Failed to load customers."
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadCustomers();

    }, []);


    function openAddModal() {

        setEditingCustomer(null);

        setName("");
        setPhone("");

        setError("");

        setIsModalOpen(true);

    }


    function openEditModal(
        customer: Customer
    ) {

        setEditingCustomer(customer);

        setName(customer.name);
        setPhone(customer.phone);

        setError("");

        setIsModalOpen(true);

    }


    function closeModal() {

        setIsModalOpen(false);

        setEditingCustomer(null);

        setName("");
        setPhone("");

    }


    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        try {

            setError("");


            if (editingCustomer) {

                const updated =
                    await updateCustomer(
                        editingCustomer.id,
                        {
                            name,
                            phone,
                        }
                    );


                setCustomers((current) =>
                    current.map((customer) =>
                        customer.id === updated.id
                            ? updated
                            : customer
                    )
                );

            } else {

                const created =
                    await createCustomer({
                        name,
                        phone,
                    });


                setCustomers((current) => [
                    ...current,
                    created,
                ]);

            }


            closeModal();

        } catch {

            setError(
                editingCustomer
                    ? "Failed to update customer."
                    : "Failed to create customer."
            );

        }
    }


    async function handleDelete(
        id: number
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this customer?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await deleteCustomer(id);


            setCustomers((current) =>
                current.filter(
                    (customer) =>
                        customer.id !== id
                )
            );

        } catch {

            setError(
                "Failed to delete customer."
            );

        }
    }


    async function handleSearch(
        e: React.FormEvent
    ) {

        e.preventDefault();

        await loadCustomers(search);

    }


    return (

        <div>

            {/* Page Header */}

            <PageHeader
                title="Customers"
                description="Manage your salon customers."
                actionLabel="+ Add Customer"
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

            {/* Customer Table */}

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
                        Customer List
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-gray-500
                        "
                    >
                        {customers.length}{" "}
                        {customers.length === 1
                            ? "customer"
                            : "customers"}
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
                        Loading customers...
                    </div>

                ) : customers.length === 0 ? (

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
                            No customers found.
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >
                            Add a customer to get started.
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

                                {customers.map(
                                    (customer) => (

                                        <tr
                                            key={
                                                customer.id
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
                                                    customer.name
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
                                                    customer.phone
                                                }
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
                                                            customer
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
                                                            customer.id
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
                    editingCustomer
                        ? "Edit Customer"
                        : "Add Customer"
                }
                onClose={closeModal}
            >
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label
                            htmlFor="customer-name"
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
                            id="customer-name"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                            autoFocus
                            placeholder="Jane Smith"
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


                    <div>

                        <label
                            htmlFor="customer-phone"
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
                            id="customer-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
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
                            {editingCustomer
                                ? "Save Changes"
                                : "Add Customer"
                            }
                        </button>

                    </div>

                </form>
            </Modal>

        </div>
    );
}
