import { Spinner } from "@nextui-org/react";

export default function LoadingSpinner() {
  return (
    <div className="flex place-content-center h-screen">
      <Spinner color="primary" size="lg" />
    </div>
  );
}
