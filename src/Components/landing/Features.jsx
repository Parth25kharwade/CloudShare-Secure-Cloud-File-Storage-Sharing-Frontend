import {
    ArrowUpCircle,
    Shield,
    Share2,
    Lock,
    Users,
    Activity
} from "lucide-react";

/**
 * Map string names to Lucide icon components
 */
const iconMap = {
    ArrowUpCircle,
    Shield,
    Share2,
    Lock,
    Users,
    Activity
};

const Features = ({ features }) => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Everything you need for file sharing
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        Upload, store, and share files securely with powerful features
                        designed for individuals and teams.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, index) => {
                        const Icon = iconMap[feature.iconName];

                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition"
                            >
                                {/* Icon */}
                                {Icon && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                                        <Icon
                                            size={28}
                                            strokeWidth={1.75}
                                            className={feature.iconColor}
                                        />
                                    </div>
                                )}

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="mt-2 text-gray-500">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default Features;
