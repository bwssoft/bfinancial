import { ReactNode } from "react"

interface PageHeaderProps {
  pageTitle: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ pageTitle, description, children }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
          {pageTitle}
        </h1>
        {description && <span className="text-sm text-gray-500">{description}</span>}
      </div>

      <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
        {children}
      </div>
    </div>
  )
}