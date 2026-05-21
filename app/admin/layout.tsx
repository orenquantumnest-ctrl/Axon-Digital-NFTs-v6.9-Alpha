import { RoleProvider } from "@/components/admin/RoleContext";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleProvider>{children}</RoleProvider>;
}
