"use client";
import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { auth, signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const userNavigation = [{ name: "Sign out", href: "#", onClick: signOut }];

export function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>();

  async function fetchUserFromAuth() {
    const data = await auth();
    if (!data) return;
    setUser(data.user);
  }

  React.useEffect(() => {
    fetchUserFromAuth();
  }, []);

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1" />
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="-m-1.5 flex items-center p-1.5 text-gray-800 hover:text-gray-500">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full border shadow-sm border-gray-200"
                src="/logotipo.png"
                alt="Foto do usuario"
              />
              <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-4 text-sm font-semibold leading-6"
                  aria-hidden="true"
                >
                  Usuário: {user?.name}
                </span>
                <ChevronDownIcon className="ml-2 h-5 w-5 " aria-hidden="true" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem>Meus dados</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
