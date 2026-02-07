import { redirect } from "next/navigation";

/** Redirect: il login con account è per le imprese */
export default function LoginPage() {
  redirect("/impresa/login");
}
