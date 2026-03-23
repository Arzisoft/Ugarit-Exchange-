import TransferDetail from "@/components/transfer/TransferDetail";

export default async function TransferTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TransferDetail id={id} />;
}
