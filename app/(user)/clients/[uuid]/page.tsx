export default function Example({
  params,
}: {
  params: {
    uuid: string;
  };
}) {
  return <div>{params.uuid}</div>;
}
