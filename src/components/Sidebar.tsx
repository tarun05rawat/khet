'use client';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChartBarDecreasing, Home, User, Settings, LogOut, PanelLeft, MessageSquare, LayoutDashboard, BookOpenText, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsExpanded } from '@/lib/atom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function AccountSidebar() {
  const [isExpanded, setIsExpanded] = useIsExpanded();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User is signed in:", currentUser);
      } else {
        setUser(null);
        console.log("User is signed out");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  const getUserInitials = () => {
    if (!user) return "?";

    const name = user.user_metadata?.full_name || user.email || "";
    if (!name) return "?";

    if (name.includes('@')) {
      return name.charAt(0).toUpperCase();
    }

    const nameParts = name.split(' ').filter(Boolean);
    if (nameParts.length === 0) return "?";
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Sidebar
      variant="floating"
      className={`transition-all duration-100 overflow-hidden scrollbar-none ${isExpanded ? 'w-64' : 'w-16'
        } bg-gradient-to-b from-[#FEFEFE] to-[#D3E7C8]`} // Gradient applied always
    >
      <SidebarHeader className='bg-[#FEFEFE]'>
        <div className={`p-2 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          {isExpanded && <p className='font-bold'>Fourth and Hope</p>}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-grow bg-gradient-to-b from-[#FEFEFE] to-[#D3E7C8]"> {/* Ensure no gradient class here */}
        <SidebarGroup>
          <nav className={`space-y-1 p-2 ${!isExpanded ? 'flex flex-col items-center' : ''}`}>
            <Link href="/dashboard" className={`flex items-center rounded-md text-sm hover:bg-secondary ${isExpanded ? 'space-x-3 p-2' : 'w-8 h-8 justify-center p-0'}`}>
              <LayoutDashboard className="h-5 w-5 min-w-[20px]" />
              <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>Dashboard</span>
            </Link>
            <Link href="/analytics" className={`flex items-center rounded-md text-sm hover:bg-secondary ${isExpanded ? 'space-x-3 p-2' : 'w-8 h-8 justify-center p-0'}`}>
              <ChartBarDecreasing className="h-5 w-5 min-w-[20px]" />
              <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>Analytics</span>
            </Link>
            <Link href="/messages" className={`flex items-center rounded-md text-sm hover:bg-secondary ${isExpanded ? 'space-x-3 p-2' : 'w-8 h-8 justify-center p-0'}`}>
              <MessageSquare className="h-5 w-5 min-w-[20px]" />
              <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>Messages</span>
            </Link>
            <Link href="/case" className={`flex items-center rounded-md text-sm hover:bg-secondary ${isExpanded ? 'space-x-3 p-2' : 'w-8 h-8 justify-center p-0'}`}>
              <Lightbulb className="h-5 w-5 min-w-[20px]" />
              <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>Case management</span>
            </Link>
            <Link href="/settings" className={`flex items-center rounded-md text-sm hover:bg-secondary ${isExpanded ? 'space-x-3 p-2' : 'w-8 h-8 justify-center p-0'}`}>
              <Settings className="h-5 w-5 min-w-[20px]" />
              <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>Settings</span>
            </Link>
          </nav>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto bg-gradient-to-b from-[#D3E7C8] to-[#D3E7C8]"> {/* Ensure no gradient class here */}
        {!loading && user && (
          <div className={`p-2 flex items-center ${!isExpanded ? 'flex justify-center' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center p-2 hover:bg-[#B5D0A9] dark:hover:bg-green-800/40 ${isExpanded
                    ? 'w-full justify-start gap-4'
                    : 'justify-center h-8 w-8'
                    }`}
                >
                  <Avatar className={`h-7 w-7`}>
                    <AvatarImage
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                      alt={user.user_metadata?.full_name || user.email}
                    />
                    <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className={`text-sm font-medium truncate transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="mb-2 w-56">
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}