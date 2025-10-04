import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {redirect} from "next/navigation";


export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if(!session) {
        redirect('/login')
    }

    return (
        <div>
            <h1>Добро пожаловать, {session.user?.name || session.user?.email}!</h1>
            <p>Это защищённая страница дашборда</p>
        </div>
    )
}