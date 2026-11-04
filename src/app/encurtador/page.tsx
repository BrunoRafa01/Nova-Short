import { redirect } from "next/navigation";

export default function EncurtadorPage() {
  redirect("/?tab=shortener");
}
