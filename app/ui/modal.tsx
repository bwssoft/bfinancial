"use client";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { XCircleIcon } from "@heroicons/react/24/outline";

export function Modal({
  children,
  panelClassName,
  panelContainerClassname,
  title,
}: {
  children: React.ReactNode;
  panelClassName?: string;
  panelContainerClassname?: string;
  title?: string;
}) {
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={router.back}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div
            className={clsx(
              "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0",
              panelContainerClassname
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  "relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6",
                  panelClassName
                )}
              >
                <div className="min-w-0 flex-1 border-b border-gray-200">
                  {/* Profile */}
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold leading-6 text-gray-900 sm:truncate sm:leading-9">
                      {title && <p>{title}</p>}
                    </h1>
                    <button onClick={router.back}>
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
