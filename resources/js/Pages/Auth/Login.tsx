import ApplicationLogo from "@/Components/ApplicationLogo";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="flex justify-center mb-6">
                <ApplicationLogo className="h-16 w-14 text-indigo-600" />
            </div>

            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
                M K Core
            </h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Sign in to continue
            </p>

            {status && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-sm rounded-md">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5 mt-4">
                {/* Email */}
                <div>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full outline-none focus:ring-0 active:outline-none bg-transparent border-b-2 border-t-0 border-x-0 dark:text-white"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Email"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password */}
                <div>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full outline-none focus:ring-0 active:outline-none bg-transparent border-b-2 border-t-0 border-x-0 dark:text-white"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between text-sm pt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                            Remember me
                        </span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Login and Register */}
                <div className="flex justify-between items-center">
                    <Link
                        href={route("register")}
                        className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                    >
                        Don’t have an account?
                    </Link>

                    <PrimaryButton className="ml-3" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
