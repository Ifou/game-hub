import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="PortfolioHub - Showcase Your Work">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                {/* Navigation */}
                <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">PortfolioHub</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
                            Showcase Your
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Work</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                            Create stunning portfolio websites that highlight your skills, projects, and achievements.
                            Stand out from the crowd with professional designs.
                        </p>

                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {!auth.user ? (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-lg"
                                    >
                                        Create Your Portfolio
                                    </Link>
                                    <Link
                                        href="#features"
                                        className="text-base font-semibold leading-6 text-slate-900 dark:text-white"
                                    >
                                        Learn more <span aria-hidden="true">→</span>
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-lg"
                                >
                                    Go to Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Preview Cards */}
                    <div className="mt-16 flow-root sm:mt-24">
                        <div className="relative -m-2 rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-slate-800/50 dark:ring-slate-700">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                {/* Portfolio Preview 1 */}
                                <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                                    <div className="mb-4 h-32 rounded-md bg-gradient-to-br from-emerald-400 to-cyan-400"></div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Developer Portfolio</h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Perfect for showcasing code projects</p>
                                </div>

                                {/* Portfolio Preview 2 */}
                                <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                                    <div className="mb-4 h-32 rounded-md bg-gradient-to-br from-purple-400 to-pink-400"></div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Designer Portfolio</h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Highlight your creative work</p>
                                </div>

                                {/* Portfolio Preview 3 */}
                                <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                                    <div className="mb-4 h-32 rounded-md bg-gradient-to-br from-orange-400 to-red-400"></div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Artist Portfolio</h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Display your artistic creations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Everything you need to showcase your work
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                            Professional portfolio tools that help you stand out and get noticed by potential clients and employers.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            <div className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    <div className="h-5 w-5 rounded-full bg-blue-600"></div>
                                    Easy to Use
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                                    <p className="flex-auto">No coding required. Create your portfolio with our intuitive drag-and-drop builder.</p>
                                </dd>
                            </div>

                            <div className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    <div className="h-5 w-5 rounded-full bg-purple-600"></div>
                                    Beautiful Templates
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                                    <p className="flex-auto">Choose from professionally designed templates that make your work shine.</p>
                                </dd>
                            </div>

                            <div className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    <div className="h-5 w-5 rounded-full bg-emerald-600"></div>
                                    Custom Domain
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-300">
                                    <p className="flex-auto">Get your own custom domain to establish your professional online presence.</p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Ready to showcase your work?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                            Join thousands of professionals who trust PortfolioHub to showcase their best work.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {!auth.user ? (
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-lg"
                                >
                                    Get Started Today
                                </Link>
                            ) : (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-lg"
                                >
                                    Go to Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mx-auto mt-32 max-w-7xl px-6 pb-8 lg:px-8">
                    <div className="border-t border-slate-900/10 pt-8 dark:border-slate-700">
                        <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                            &copy; 2025 PortfolioHub. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
