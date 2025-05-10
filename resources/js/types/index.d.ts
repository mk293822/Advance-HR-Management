interface User {
    [key: string]: any;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    gender: string | null;
    employee_id: string;
    avatar: string | File | null;
    department_id: number; // Nested Department type
    position_id: number; // Nested Position type
    role_id: number; // Nested Role type
    status: "Active" | "Inactive" | "Suspended" | "Pending";
    date_of_birth: string | null; // ISO Date string
    address: string | null;
    date_hired: string; // ISO Date string
    salary: number | null;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
