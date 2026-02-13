import {CreditCard, Folder, LayoutDashboard, Receipt, Upload} from "lucide-react";

export const features = [
    {
        iconName: "ArrowUpCircle",
        iconColor: "text-purple-500",
        title: "Easy File Upload",
        description: "Upload your files quickly using a simple drag-and-drop interface."
    },
    {
        iconName: "Shield",
        iconColor: "text-green-500",
        title: "Secure Storage",
        description: "Your files are encrypted and stored securely in the cloud."
    },
    {
        iconName: "Share2",
        iconColor: "text-purple-500",
        title: "Simple Sharing",
        description: "Share files with anyone using secure, controlled links."
    },
    {
        iconName: "Lock",
        iconColor: "text-red-500",
        title: "Password Protection",
        description: "Protect sensitive files with passwords."
    },
    {
        iconName: "Users",
        iconColor: "text-indigo-500",
        title: "Team Collaboration",
        description: "Collaborate with your team using shared folders."
    },
    {
        iconName: "Activity",
        iconColor: "text-pink-500",
        title: "Activity Logs",
        description: "Track downloads and file access history."
    }
];


export const pricingPlans = [
    {
        name: "Free",
        price: "0",
        description: "Perfect for getting started",
        features: [
            "5 file uploads",
            "Basic file sharing",
            "7-day file retention",
            "Email support"
        ],
        cta: "Get Started",
        highlighted: false
    },
    {
        name: "Premium",
        price: "500",
        description: "For individuals with larger needs",
        features: [
            "500 file uploads",
            "Advanced file sharing",
            "30-day file retention",
            "Priority support"
        ],
        cta: "Go Premium",
        highlighted: true
    },
    {
        name: "Ultimate",
        price: "799",
        description: "For professionals and teams",
        features: [
            "1000 file uploads",
            "Custom sharing permissions",
            "90-day file retention",
            "24/7 support"
        ],
        cta: "Upgrade to Ultimate",
        highlighted: false
    }
];


export const testimonials = [
    {
        name: "Michael Chen",
        role: "Freelance Designer",
        company: "Self-employed",
        image: "https://randomuser.me/api/portraits/men/46.jpg",
        quote: "As a freelancer, I need to share large design files securely. CloudShare makes it effortless.",
        rating: 5
    },
    {
        name: "Priya Sharma",
        role: "Project Manager",
        company: "TechSolutions Ltd.",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        quote: "Managing files across teams used to be painful. CloudShare simplified everything.",
        rating: 4
    },
    {
        name: "Rahul Mehta",
        role: "Startup Founder",
        company: "InnoStack",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        quote: "Fast uploads and secure links are perfect for our startup workflow.",
        rating: 5
    }
];
export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Upload",
        icon: Upload,
        path: "/upload",
    },
    {
        id: "03",
        label: "My Files",
        icon: Folder,
        path: "/my-files",
    },
    {
        id: "04",
        label: "Subscriptions",
        icon: CreditCard,
        path: "/subscriptions",
    },
    {
        id: "05",
        label: "Transactions",
        icon: Receipt,
        path: "/transactions",
    },
];
