import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {}

function Footer({ }: Props) {
    return (
        <footer className="border-t bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-xl group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-md group-hover:shadow-lg transition-shadow">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-gradient">MedValidateAI</span>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
                            Empowering healthcare innovation in Pakistan through AI-powered startup validation.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-display font-semibold text-gray-900 dark:text-gray-100 text-base">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-white/80 dark:hover:text-white/80 transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-0.5 transition-transform">About Us</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-white/80 dark:hover:text-white/80 transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-0.5 transition-transform">Contact</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-white/80 dark:hover:text-white/80 transition-colors inline-flex items-center gap-1 group">
                                    <span className="group-hover:translate-x-0.5 transition-transform">Login</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Healthcare Focus */}
                    <div className="space-y-4">
                        <h4 className="font-display font-semibold text-gray-900 dark:text-gray-100 text-base">Healthcare Focus</h4>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                Mental Health Tech
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                Telemedicine
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                Health Monitoring
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                Healthcare AI
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-display font-semibold text-gray-900 dark:text-gray-100 text-base">Get in Touch</h4>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">📧</span>
                                <a href="mailto:support@MedValidateAI.pk" className="hover:text-white/80 transition-colors">
                                    ayanhaidershah0@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">📍</span>
                                <span>Haripur, Pakistan</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} <span className="font-semibold text-gray-900 dark:text-gray-100">MedValidateAI</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer