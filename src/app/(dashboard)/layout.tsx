import { Header } from "@/shared/components/layouts/Header";
import { ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div>
            <Header />
            <main>{children}</main>
        </div>
    );
}
