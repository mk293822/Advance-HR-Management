// Enums

// RoleEnum.ts
export enum Role {
    ADMIN = "admin",
    HR_MANAGER = "hr_manager",
    EMPLOYEE = "employee",
    SUPERVISOR = "supervisor",
    INTERN = "intern",
}

export enum AttendanceEnum {
    PRESENT = "present",
    ABSENT = "absent",
    LEAVE = "leave",
    LATE = "late",
    HALF_DAY = "half_day",
}

// PositionEnum.ts
export enum Position {
    SOFTWARE_ENGINEER = "Software Engineer",
    MARKETING_MANAGER = "Marketing Manager",
    ACCOUNTANT = "Accountant",
    SALES_EXECUTIVE = "Sales Executive",
    CUSTOMER_SUPPORT = "Customer Support Representative",
    HR_SPECIALIST = "HR Specialist",
    PROJECT_MANAGER = "Project Manager",
}

// Status Enums
export enum Status {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
    SUSPENDED = "Suspended",
    PENDING = "Pending",
}

export enum Approving {
    APPROVED = "approved",
    REJECTED = "rejected",
    PENDING = "pending",
}

export enum Gender {
    MALE = "Male",
    FEMALE = "Female",
}
