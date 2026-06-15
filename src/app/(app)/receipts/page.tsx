import { redirect } from "next/navigation";

export default function ReceiptsRedirectPage() {
  redirect("/transactions");
}
