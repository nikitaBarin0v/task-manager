import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import z from "zod"
import { useLazyLoginQuery } from "../store/api/authAPI";
import { setCredentials } from "../store/slices/authSlice";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Введите корректный email'),
  password: z
    .string()
    .min(8, 'Пароль обязателен, минимум 8 символов'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { data: loginData, isLoading }] = useLazyLoginQuery()

  const { register, handleSubmit, formState: {
    errors, isSubmitting
  } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  async function onSubmit(data: LoginFormData) {

    console.log(data);

    const result = await login({ email: data.email, password: data.password })
    console.log(result)

    if (result.data && result.data.length > 0) {
      const fakeToken = `fake-token-${result.data[0].id}`

      dispatch(setCredentials({ user: result.data[0], token: fakeToken }))
      navigate('/dashboard')
    } else {
      return alert('Неверный email или пароль')
    }
  }

  return (
    <div className="min-b-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded p-8 w-96 shadow">
        <h2 className="text-2xl font-bold mb-6">Логин</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('email')} type='email' placeholder='Введите email' className="w-full border rounded p-2 mb-1 outline-none focus:border-blue-500" />
          {errors.email && <span>{errors.email.message}</span>}

          <input {...register('password')} type='password' placeholder='Введите пароль' className="w-full border rounded p-2 mb-1 outline-none focus:border-blue-500" />
          {errors.password && <span>{errors.password.message}</span>}

          <button type='submit' disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer hover:bg-blue-600 mt-2">{isSubmitting ? 'Вход...' : 'Войти'}</button>
          <Link to='/register' className="block text-center mt-2 text-blue-500 hover:underline">Регистрация</Link>
          <Link to='/' className="block text-center mt-2 text-gray-500 hover:underline">
            На главную
          </Link>
        </form>
      </div>
    </div>
  )
}