import Image from "next/image";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
      <div>
        <h1>Подготовка к собеседованиям</h1>
        <p>Тренируйтесь и готовьтесь к интервью с лучшими вопросами</p>

        {session ? (
            <Link href="/dashboard">Перейти к дашборду</Link>
        ) : (
            <>
              <Link href="/login">Войти</Link>
              <Link href="/register">Регистрация</Link>
            </>
        )}
      </div>
  )
}
