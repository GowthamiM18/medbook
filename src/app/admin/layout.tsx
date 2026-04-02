// Root admin layout: no sidebar (covers /admin/login and dashboard group stacks its own layout)
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
