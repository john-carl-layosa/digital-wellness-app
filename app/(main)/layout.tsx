import React from "react";
import { NavShell } from "../../components/NavShell";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <NavShell>{children}</NavShell>;
}