import Navbar from '../Navbar'

export default function AppLayout({ children, maxWidth = "max-w-8xl" }) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-24 py-8`}>
                {children}
            </div>
        </div>
    );
}
