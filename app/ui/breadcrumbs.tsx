"use client";
import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";
import { HomeIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

type Props = {
  breadcrumbs: {
    name: string;
    href: string;
  }[];
  linkRoot: string;
};
export function Breadcrumbs({ breadcrumbs, linkRoot }: Props) {
  const pathname = usePathname();

  const isOptionInPathname = useCallback(
    (href: string) => {
      if (href === "/" && pathname !== "/") {
        return false;
      }
      return pathname.includes(href);
    },
    [pathname]
  );
  return (
    <div className="w-full px-4 sm:px-6 bg-white border-t border-gray-200 py-3 shadow">
      <div>
        <nav className="flex" aria-label="Breadcrumb">
          <div className="flex sm:hidden">
            <a
              href="#"
              className="group inline-flex space-x-3 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLongLeftIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600"
                aria-hidden="true"
              />
              <span>Back to Applicants</span>
            </a>
          </div>
          <div className="hidden sm:block">
            <ol role="list" className="flex items-center space-x-4">
              <li>
                <div>
                  <a
                    href={linkRoot}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <HomeIcon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Home</span>
                  </a>
                </div>
              </li>
              {breadcrumbs.map((item) => (
                <li key={item.name}>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <a
                      href={item.href}
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                      aria-current={
                        isOptionInPathname(item.href) ? "page" : undefined
                      }
                    >
                      {item.name}
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      </div>
    </div>
  );
}
