import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Task manager</h1>
        <p className="text-gray-500 mb-8">Управляй задачами легко и быстро</p>
        <div className="flex gap-4 justify-center">
          <Link to='/login' className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer">Войти</Link>
          <Link to='/register' className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer">Регистрация</Link>
        </div>
      </div>
    </div>
  )
}