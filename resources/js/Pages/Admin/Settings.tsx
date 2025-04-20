import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const Settings = () => {
    return (
        <AdminLayout>
            <Head title="Settings" />

            <div className="text-gray-200">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>
                {/* Notifications */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Notification Preferences
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                className="form-checkbox text-blue-500"
                            />
                            <span>Receive Email Notifications</span>
                        </label>
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                className="form-checkbox text-blue-500"
                            />
                            <span>Receive SMS Notifications</span>
                        </label>
                    </div>
                </div>

                {/* Other Settings */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">
                        Other Settings
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span>Enable Dark Mode</span>
                            <input
                                type="checkbox"
                                className="form-checkbox text-blue-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Language</span>
                            <select className="p-2 bg-gray-700 text-white rounded-md">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;
