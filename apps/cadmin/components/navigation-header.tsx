"use client"
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { Database } from "@/lib/database.types";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export default function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient<Database>();
  const summaryRoute = "/events"
  const manageGuestRoute = "/events/manage-guest"
  const handleSignOutClick = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (<>
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">E<small>vents</small>M<small>anager</small></p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname.endsWith(summaryRoute)}>
          <Link color="foreground" href={summaryRoute} aria-current="page" >
            Summary
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.endsWith(manageGuestRoute)}>
          <Link color="foreground" href={manageGuestRoute} >
            Manage Guests
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button color="danger" onClick={handleSignOutClick}>Sign Out</Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem >
          <Link color="foreground" href={summaryRoute} aria-current="page" >
            Summary
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem >
          <Link color="foreground" href={manageGuestRoute} aria-current="page" >
            Manage Guests
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem >
          <Button color="danger" onClick={handleSignOutClick}>Sign Out</Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  </>
  );
}
