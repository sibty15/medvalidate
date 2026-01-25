'use client';

import React from "react"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

import {
  Home,
  Lightbulb,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const sidebarLinks = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Submit Idea', href: '/dashboard/submit', icon: Lightbulb },
  { title: 'Results', href: '/dashboard/results', icon: BarChart3 },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const pathname = usePathname();
  const isFullAnalysisPage = pathname?.includes('/dashboard/results/full-analysis/');
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar Header */}
      

      {/* Navigation */}
      <nav className="flex-1 px-3 sm:px-4 py-4 space-y-2 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = (isFullAnalysisPage && link.href === '/dashboard/results') || pathname === link.href;
          const Icon = link.icon;

          const linkNode = (
            <Link
              href={link.href}
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group',
                isActive
                  ? 'bg-[#16a286] text-white shadow-md shadow-[#16a286]/20 scale-105'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
                isCollapsed && !isMobile && 'justify-center px-3'
              )}
            >
              <Icon className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform duration-200" />
              {(!isCollapsed || isMobile) && <span>{link.title}</span>}
            </Link>
          );

          if (isCollapsed && !isMobile) {
            return (
              <TooltipProvider key={link.href}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>{linkNode}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium bg-gray-900 text-white border border-gray-700">
                    {link.title}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return <div key={link.href}>{linkNode}</div>;
        })}
      </nav>

      {/* Collapse Toggle (Desktop) */}
      {!isMobile && (
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 lg:flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex lg:sticky  lg:top-16 lg:h-screen z-30 flex-col bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden shadow-sm',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="left"
          className="w-64 sm:w-72 p-0 bg-white border-r border-gray-200"
        >
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <div className="flex-1 flex min-h-screen flex-col min-w-0">
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4 px-4 sm:px-6 py-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-gray-900">Dashboard</h1>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
