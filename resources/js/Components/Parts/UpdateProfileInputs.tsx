import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import InputError from "../InputError";
import { Textarea } from "@headlessui/react";
import { Gender, Status } from "@/types/Enums";
import { usePage } from "@inertiajs/react";
import React, { useState } from "react";

interface Inputs {
    data: any;
    onValueChange: (e: any) => void;
    errors: any;
    htmlFor: string;
    value: string;
    type?: string;
    departments: Array<{
        id: number;
        name: string;
    }>;
    roles: Array<{
        id: number;
        name: string;
    }>;
    positions: Array<{
        id: number;
        name: string;
    }>;
}

const UpdateProfileInputs = ({
    data,
    onValueChange = (e)=>{},
    errors,
    htmlFor,
    value,
    type = "text",
    departments,
    roles,
    positions
}: Inputs) => {

    const [selectData, setSelectData] = useState(data);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setSelectData(e.target.value);
        if (typeof onValueChange === "function") {
            onValueChange(e);
        }
    }

    if (type === "select") {
        return (
            <div className="w-[100%]">
                <InputLabel htmlFor={htmlFor} value={value} />
                <select
                    value={selectData}
                    autoComplete={htmlFor}
                    id={htmlFor}
                    onChange={handleSelectChange}
                    required
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select {value}</option>
                    {htmlFor === "status" &&
                        Object.values(Status).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    {htmlFor === "gender" &&
                        Object.values(Gender).map((gender) => (
                            <option key={gender} value={gender}>
                                {gender}
                            </option>
                        ))}
                    {htmlFor === "position_id" &&
                        positions?.map((pos) => (
                            <option key={pos.id} value={pos.id}>
                                {pos.name}
                            </option>
                        ))}
                    {htmlFor === "role_id" &&
                        roles?.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    {htmlFor === "department_id" &&
                        departments?.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                </select>
                <InputError className="mt-2" message={errors.name} />
            </div>
        );
    } else if (type === 'textarea') {
        return (
            <div className="w-[100%] col-span-2">
                <InputLabel htmlFor={htmlFor} value={value} />
                <Textarea
                    id={htmlFor}
                    className="mt-1 block w-full bg-gray-900"
                    value={data}
                    onChange={(e) => onValueChange(e)}
                    required
                    autoComplete={htmlFor}
                />
                <InputError className="mt-2" message={errors.name} />
            </div>
        );
    } else {
        return (
            <div className="w-[100%]">
                <InputLabel htmlFor={htmlFor} value={value} />
                <TextInput
                    id={htmlFor}
                    className="mt-1 block w-full"
                    value={data}
                    onChange={(e) => onValueChange(e)}
                    required
                    isFocused
                    type={type}
                    autoComplete={htmlFor}
                    readOnly={htmlFor === 'employee_id'}
                />
                <InputError className="mt-2" message={errors.name} />
            </div>
        );

    }

};

export default UpdateProfileInputs;
