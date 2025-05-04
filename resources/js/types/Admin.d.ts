// Dashboard types for the admin dashboard

import { Status } from "./Enums";

export type DashboardProps = {
    employee_count: number;
    department_count: number;
    leave_request_count: number;
    pending_approvals: PendingApproval;
    upcoming_events: UpcomingEvent[];
    leave_requests: LeaveRequest[];
    attendances: AttendanceType[];
    chart_type: "day" | "month";
    event_type: "upcoming" | "all";
};

// Pending Approvals
export type PendingApproval = {
    leave_requests_count: number;
    employees_count: number;
    departments_count: number;
};

// Attendances types
export type AttendanceProps = {
    attendances: AttendanceType[];
    links: PaginateLinks[];
};

export type AttendanceType = {
    id: number;
    employee: {
        full_name: string;
        employee_id: string;
    };
    status: string;
    date: string;
    check_in: string;
    check_out: string;
    remark: string;
};

// Pagination Links

export type PaginateLinks = {
    url: string;
    label: string;
    active: string;
};

// Upcoming Event types for the admin dashboard

export type UpcomingEvent = {
    id?: number;
    title: string;
    start_date: string; // ISO format date string
    end_date: string; // ISO format date string
    description: string;
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;
};

// Department types for the admin dashboard

export type DepartmentProps = {
    departments: Department[];
    header_ids: string[];
};

export type Department = {
    id?: number;
    name: string;
    description: string | null;
    header: {
        full_name: string;
        employee_id: string | null;
    } | null;
    employees_count?: number;
    status: Status | string; // Use string literal union if status is fixed
    created_at?: string;
    updated_at?: string;
    participants: Array<{
        full_name: string;
        employee_id: string;
    }>;
};

// Role types for the admin dashboard

export type RoleProps = {
    id: number;
    name: string;
};

export type PositionProps = {
    id: number;
    name: string;
};

// Employee types for the admin dashboard

export type EmployeeProps = {
    all_employees: Employee[];
    all_departments: Department[];
    all_roles: RoleProps[];
    all_positions: PositionProps[];
};

export type Employee = {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    gender: string | null;
    employee_id: string;
    department: Department | null; // Nested Department type
    position: PositionProps; // Nested Position type
    role: RoleProps; // Nested Role type
    status: "Active" | "Inactive" | "Suspended" | "Pending";
    date_of_birth: string | null; // ISO Date string
    address: string | null;
    date_hired: string; // ISO Date string
    salary: number | null;
    created_at: string; // ISO Date string
    updated_at: string; // ISO Date string
};

// Leave Request types for the admin dashboard

export type LeaveRequestProps = {
    leave_requests: LeaveRequest[];
};

export type LeaveRequest = {
    id: number;
    user_id: number;
    employee_id: string;
    employee_name: string;
    start_date: string; // ISO format date string
    end_date: string; // ISO format date string
    leave_type: "Sick" | "Casual" | "Annual";
    reason: string;
    status: "pending" | "approved" | "rejected";
    approved_by: number | null;
    created_at?: string; // DateTime string
    updated_at?: string; // DateTime string
};
