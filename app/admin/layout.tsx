import "@/app/globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-bone-100">{children}</div>;
}
