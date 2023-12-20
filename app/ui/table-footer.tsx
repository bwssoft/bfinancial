function Mobile() {
  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
      aria-label="Pagination"
    >
      <div className="flex flex-1 justify-between">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Anterior
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Próximo
        </a>
      </div>
    </nav>
  );
}

function Desktop() {
  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> até{" "}
          <span className="font-medium">10</span> de{" "}
          <span className="font-medium">20</span> resultados
        </p>
      </div>
      <div className="flex flex-1 justify-between gap-x-3 sm:justify-end">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
        >
          Anterior{" "}
        </a>
        <a
          href="#"
          className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
        >
          Próximo{" "}
        </a>
      </div>
    </nav>
  );
}

export const TableFooter = {
  Mobile,
  Desktop,
};
