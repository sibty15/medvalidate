"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Sparkles, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {}

const navLinks = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
];

function Header({ }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = usePathname();
    const { user, isAuthenticated, logout } = useAuth();
    const isHomePage = location === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    const headerBg = isHomePage && !isScrolled 
        ? 'bg-transparent border-white/10' 
        : 'bg-white/90 border-gray-200';

    const navTextColor = isHomePage && !isScrolled ? 'text-gray-700' : '';
    const navActiveColor = isHomePage && !isScrolled ? 'text-green-800 font-semibold' : 'text-green-800 font-semibold';
    const logoTextColor = isHomePage && !isScrolled ? 'text-white' : '';

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full border-b backdrop-blur-lg transition-all duration-300",
            headerBg
        )}>
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className={cn(
                    "flex items-center gap-2.5 font-display font-bold text-xl transition-opacity hover:opacity-80",
                    logoTextColor
                )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-md">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gradient hidden sm:inline">MedValidateAI</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary px-1 py-2",
                                location === link.href
                                    ? navActiveColor
                                    : navTextColor
                            )}
                        >
                            {link.title}
                        </Link>
                    ))}
                </nav>

                {/* Auth / Dashboard - Desktop */}
                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated && user ? (
                        <>
                            <Button variant="outline" asChild className="font-medium">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-accent">
                                        <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                                {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">{user.fullName || 'User'}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings" className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings" className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-destructive focus:text-destructive"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button 
                                variant="ghost" 
                                asChild
                                 className=' bg-gray-200'
                            >
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button asChild className="gradient-primary hover:opacity-90 transition-opacity shadow-lg">
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <Menu className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] px-6">
                        <div className="flex flex-col gap-8 mt-12">
                            <nav className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "text-base font-medium transition-colors hover:text-primary py-3 px-2 rounded-md hover:bg-accent",
                                            location === link.href
                                                ? "text-primary bg-accent"
                                                : "text-foreground"
                                        )}
                                    >
                                        {link.title}
                                    </Link>
                                ))}
                            </nav>
                            <div className="flex flex-col gap-3 pt-4 border-t">
                                {isAuthenticated && user ? (
                                    <>
                                        <Button asChild className="w-full gradient-primary">
                                            <Link href="/dashboard" onClick={() => setIsOpen(false)}>Go to Dashboard</Link>
                                        </Button>
                                        <Button variant="outline" asChild className="w-full">
                                            <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span>Profile</span>
                                                </div>
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="outline" asChild className="w-full">
                                            <Link href="/login" onClick={() => setIsOpen(false)}>Log in</Link>
                                        </Button>
                                        <Button asChild className="w-full gradient-primary">
                                            <Link href="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}

export default Header