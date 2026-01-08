import { NextResponse } from "next/server";
export function POST(_request: Request) {
  const proProductId = process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID;
  const checkoutUrl = proProductId
    ? `/api/checkout?products=${proProductId}`
    : null;

  return NextResponse.json(
    {
      error: "Signup is disabled. Complete checkout to access Beeline.",
      code: "SIGNUP_DISABLED",
      checkoutUrl,
    },
    { status: 410 }
  );
}
