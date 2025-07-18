"use client";

import { Menu, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";

// const fetchShopData = async (token) => {
//   const response = await fetch(
//     "https://ftfdesignco-backend.onrender.com/api/v1/shop/my-shop",
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   if (!response.ok) {
//     throw new Error("Failed to fetch shop data");
//   }
//   return response.json();
// };

export default function ShopNavbar() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const token = session?.accessToken;

  const {
    data: shopData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shopData", token],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/shop/my-shop`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white">
            <nav className="flex flex-col gap-4">
              <div className="px-2 py-1">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="flex h-10 w-32 items-center justify-center rounded bg-muted text-sm font-medium text-muted-foreground">
                      {isLoading
                        ? "Loading..."
                        : error
                        ? "Company Logo"
                        : shopData?.data?.companyName || "Company Logo"}
                    </div>
                  </Link>
                </div>
              </div>
              <Link
                href="/shop"
                className="block px-2 py-1 text-lg hover:text-foreground/80"
              >
                Shop
              </Link>
              <Link
                href="/shop"
                className="block px-2 py-1 text-lg hover:text-foreground/80"
              >
                All Products
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-32 items-center justify-center rounded bg-muted text-sm font-medium text-muted-foreground">
              {isLoading
                ? "Loading..."
                : error
                ? "Company Logo"
                : shopData?.data?.companyName || "Company Logo"}
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/shop"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  Shop
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/shop"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  All Products
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Shopping Cart */}
          {role === "employee" && (
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gratisswag-dark-gray" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#424242] px-1.5 text-xs font-semibold text-white">
                0
              </Badge>
            </Button>
          )}

          {/* User Dropdown */}
          {(role === "company_admin" || role === "employee") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarImage src="/placeholder.svg" alt="User Avatar" />
                    <AvatarFallback className="bg-[#D9AD5E] hover:bg-[#f5b641] text-white">
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-white w-48 cursor-pointer"
                align="end"
              >
                {role === "employee" ? (
                  <>
                    <DropdownMenuLabel className="cursor-pointer">
                      <Link href="/my-account">My Account</Link>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/order-history">Order History</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="cursor-pointer">
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuLabel>
                    <DropdownMenuLabel className="cursor-pointer">
                      <span onClick={() => signOut({ callbackUrl: "/" })}>
                        Log out
                      </span>
                    </DropdownMenuLabel>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
