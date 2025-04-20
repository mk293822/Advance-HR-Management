export const Detail = ({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) => (
    <div>
        <span className="block text-gray-400 mb-1">{label}</span>
        <span className="text-gray-100">{value}</span>
    </div>
);

export const Info = ({ label, value }: { label: string; value: string }) => (
    <p>
        <span className="text-gray-400">{label}:</span>{" "}
        <span className="text-gray-100">{value}</span>
    </p>
);
