const Testimonials = ({ testimonials = [] }) => {
        return (
            <section className="py-20 bg-white overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Section Heading */}
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Trusted by professionals worldwide
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                            See how people use CloudShare to share files securely and efficiently.
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="flex flex-col p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition"
                            >
                                {/* Quote */}
                                <p className="text-gray-600 italic leading-relaxed">
                                    “{testimonial.quote}”
                                </p>

                                {/* User Info */}
                                <div className="mt-6 flex items-center">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {testimonial.role} · {testimonial.company}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mt-4 flex">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-lg">★</span>
                                    ))}
                                    {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                                        <span key={i} className="text-gray-300 text-lg">★</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        );
    };


    export default Testimonials;