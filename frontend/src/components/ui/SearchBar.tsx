import type { FormEvent } from "react";


interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    placeholder?: string;
}


export default function SearchBar({
    value,
    onChange,
    onSubmit,
    placeholder = "Search...",
}: SearchBarProps) {

    return (

        <div
            className="
                mb-6
                rounded-xl
                border
                border-gray-200
                bg-white
                p-4
                shadow-sm
            "
        >

            <form
                onSubmit={onSubmit}
                className="
                    flex
                    gap-3
                "
            >

                <input
                    type="search"
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    placeholder={placeholder}
                    className="
                        flex-1
                        rounded-lg
                        border
                        border-gray-300
                        px-4
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


                <button
                    type="submit"
                    className="
                        rounded-lg
                        bg-gray-900
                        px-5
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        transition-colors
                        hover:bg-gray-800
                    "
                >
                    Search
                </button>

            </form>

        </div>

    );
}
