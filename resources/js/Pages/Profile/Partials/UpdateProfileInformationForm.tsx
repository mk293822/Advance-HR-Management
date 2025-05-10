import UpdateProfileInputs from "@/Components/Parts/UpdateProfileInputs";
import PrimaryButton from "@/Components/PrimaryButton";
import SuccessErrorShowModal from "@/Components/SuccessErrorShowModal";
import { User } from "@/types";
import { Link, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";

interface Props {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    department: Array<{
        id: number;
        name: string;
    }>;
    role: Array<{
        id: number;
        name: string;
    }>;
    position: Array<{
        id: number;
        name: string;
    }>;
}

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
    department,
    role,
    position,
}: Props) {
    const user = usePage().props.auth.user;

    const avatarRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm("UserEditForm", {
            name: user.name,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            address: user.address,
            employee_id: user.employee_id,
            department_id: user.department?.id ?? null,
            position_id: user.position.id,
            role_id: user.role.id,
            date_hired: user.date_hired,
            salary: user.salary,
            status: user.status,
            avatar: null,
        }) as {
            data: User;
            setData: <K extends keyof User>(key: K, value: User[K]) => void;
            post: (url: string, {}) => void;
            errors: Partial<Record<keyof User, string>>;
            processing: boolean;
            recentlySuccessful: boolean;
        };

    useEffect(() => setData("avatar", null), []);

    const [avatarUrl, setAvatarUrl] = useState(user.avatar);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("profile.update"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const formFields = [
        { label: "Username", name: "name", type: "text", value: data.name },
        { label: "Email", name: "email", type: "email", value: data.email },
        {
            label: "First Name",
            name: "first_name",
            type: "text",
            value: data.first_name,
        },
        {
            label: "Last Name",
            name: "last_name",
            type: "text",
            value: data.last_name,
        },
        { label: "Phone", name: "phone", type: "text", value: data.phone },
        { label: "Gender", name: "gender", type: "select", value: data.gender },
        {
            label: "Date of Birth",
            name: "date_of_birth",
            type: "date",
            value: data.date_of_birth,
        },
        {
            label: "Employee ID",
            name: "employee_id",
            type: "text",
            value: data.employee_id,
        },
        {
            label: "Department",
            name: "department_id",
            type: "select",
            value: data.department_id,
        },
        {
            label: "Position",
            name: "position_id",
            type: "select",
            value: data.position_id,
        },
        {
            label: "Role",
            name: "role_id",
            type: "select",
            value: data.role_id,
        },
        {
            label: "Date Hired",
            name: "date_hired",
            type: "date",
            value: data.date_hired,
        },
        { label: "Salary", name: "salary", type: "number", value: data.salary },
        { label: "Status", name: "status", type: "select", value: data.status },
        {
            label: "Address",
            name: "address",
            type: "textarea",
            value: data.address,
        },
    ];

    return (
        <section className={className}>
            <header className="flex justify-between">
                <div className="">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Profile Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Update your account's profile information and email
                        address.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => avatarRef.current?.click()}
                    className="focus:outline-none"
                    aria-label="Upload image"
                >
                    <img
                        src={
                            typeof avatarUrl === "string"
                                ? avatarUrl
                                : avatarUrl
                                ? URL.createObjectURL(avatarUrl)
                                : ""
                        }
                        alt={data.name}
                        className="w-24 h-24 rounded-full mr-8"
                    />
                </button>
            </header>

            <form onSubmit={submit} className=" space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {formFields.map((field, index) => (
                        <UpdateProfileInputs
                            key={index}
                            data={field.value}
                            onValueChange={(e) =>
                                setData(field?.name, e.target.value)
                            }
                            errors={errors}
                            htmlFor={field.name}
                            value={field.label}
                            type={field.type}
                            departments={department}
                            roles={role}
                            positions={position}
                        />
                    ))}
                    <input
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setAvatarUrl(
                                    URL.createObjectURL(e.target.files[0])
                                );
                                setData("avatar", e.target.files[0]);
                            }
                        }}
                        type="file"
                        accept="image/*"
                        ref={avatarRef}
                    />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <SuccessErrorShowModal
                        show={recentlySuccessful}
                        message={{
                            message: "Profile Updated Successfully",
                            status: 200,
                        }}
                        onClose={() => {}}
                    />
                </div>
            </form>
        </section>
    );
}
