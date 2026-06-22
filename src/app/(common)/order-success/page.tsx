import { Suspense } from "react";
import OrderSuccessContent from "./_components/OrderSuccessContent";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}