import { ReactNode } from "react"

interface PageHeaderProps {
  pageTitle: string;
  children?: ReactNode;
}

export function PageHeader({ pageTitle, children }: PageHeaderProps) {
  return (
    <div className="flex justify-between bg-white shadow rounded-lg p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
        {pageTitle}
      </h1>

      <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
        {children}
      </div>
    </div>
  )
}