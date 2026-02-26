export default function Profile() {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Engineer Profile</h1>
                <p className="text-silver-dark mt-1">Manage your account and studio settings.</p>
            </header>
            <div className="flex-1 glass-panel rounded-xl flex items-center justify-center min-h-[500px]">
                <p className="text-silver-dark">Profile settings pending...</p>
            </div>
        </div>
    );
}
