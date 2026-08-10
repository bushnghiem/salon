interface PageHeaderProps {
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
}


export default function PageHeader({
    title,
    description,
    actionLabel,
    onAction,
}: PageHeaderProps) {

    return (

        <div
            className="
                mb-8
                flex
                items-start
                justify-between
            "
        >

            <div>

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-gray-900
                    "
                >
                    {title}
                </h1>

                <p
                    className="
                        mt-2
                        text-sm
                        text-gray-500
                    "
                >
                    {description}
                </p>

            </div>


            <button
                type="button"
                onClick={onAction}
                className="
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-colors
                    hover:bg-blue-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:ring-offset-2
                "
            >
                {actionLabel}
            </button>

        </div>

    );
}