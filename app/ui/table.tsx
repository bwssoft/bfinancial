function Desktop<T>({
  header,
  data,
  keyExtractor,
  lineRender,
}: {
  header: React.ReactNode;
  data: T[];
  keyExtractor: (d: T) => string;
  lineRender: (d: T) => React.ReactNode;
}) {
  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        {header}
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((d) => (
            <tr key={keyExtractor(d)} className="bg-white">
              {lineRender(d)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Mobile<T>({
  header,
  data,
  keyExtractor,
  lineRender,
}: {
  header?: React.ReactNode;
  data: T[];
  keyExtractor: (d: T) => string;
  lineRender: (d: T) => React.ReactNode;
}) {
  return (
    <>
      <ul
        role="list"
        className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden"
      >
        {data.map((d) => (
          <li key={keyExtractor(d)}>{lineRender(d)}</li>
        ))}
      </ul>
    </>
  );
}

export const Table = {
  Desktop,
  Mobile,
};
