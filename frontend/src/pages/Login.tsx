import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const { login } = useAuth();


    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setError("");

        try {

            await login(
                email,
                password
            );

            navigate("/dashboard");

        } catch {

            setError(
                "Invalid email or password."
            );

        }
    }


    return (

        <div
            className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-gray-50
                px-4
                py-12
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                "
            >

                {/* Logo / Brand */}

                <div
                    className="
                        mb-8
                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-600
                            text-xl
                            font-bold
                            text-white
                            shadow-sm
                        "
                    >
                        BEE
                    </div>


                    <h1
                        className="
                            mt-4
                            text-2xl
                            font-bold
                            text-gray-900
                        "
                    >
                        Salon Manager
                    </h1>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-gray-500
                        "
                    >
                        Sign in to manage your salon
                    </p>

                </div>


                {/* Login Card */}

                <div
                    className="
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-6
                        shadow-sm
                        sm:p-8
                    "
                >

                    <div className="mb-6">

                        <h2
                            className="
                                text-xl
                                font-semibold
                                text-gray-900
                            "
                        >
                            Welcome back
                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >
                            Enter your credentials to continue.
                        </p>

                    </div>


                    {/* Error */}

                    {error && (

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
                            role="alert"
                        >
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >
                                Email
                            </label>


                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    text-gray-900
                                    outline-none
                                    placeholder:text-gray-400
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20
                                "
                            />

                        </div>


                        {/* Password */}

                        <div>

                            <label
                                htmlFor="password"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >
                                Password
                            </label>


                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    text-gray-900
                                    outline-none
                                    placeholder:text-gray-400
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20
                                "
                            />

                        </div>


                        {/* Submit */}

                        <button
                            type="submit"
                            className="
                                w-full
                                rounded-lg
                                bg-blue-600
                                px-4
                                py-2.5
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
                            Sign in
                        </button>

                    </form>

                </div>


                {/* Footer */}

                <p
                    className="
                        mt-6
                        text-center
                        text-xs
                        text-gray-400
                    "
                >
                    Salon Manager
                </p>

            </div>

        </div>
    );
}