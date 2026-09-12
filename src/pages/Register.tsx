import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import z from "zod"
import { useRegisterMutation } from "../store/api/authAPI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCredentials } from "../store/slices/authSlice";

const loginSchema = z.object({
  name: z
    .string()
    .min(1, 'Введите имя'),
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Введите корректный email'),
  password: z
    .string()
    .min(1, 'Пароль обязателен, минимум 8 символов'),
});

type RegisterFormData = z.infer<typeof loginSchema>;

export function Register() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const { register, handleSubmit, formState: {
    errors, isSubmitting
  } } = useForm<RegisterFormData>({
    resolver: zodResolver(loginSchema)
  });

  async function onSubmit(data: RegisterFormData) {

    const result = await registerUser({ name: data.name, email: data.email, password: data.password });

    if (result.data) {
      const fakeToken = `fake-token-${result.data.id}`;

      dispatch(setCredentials({ user: result.data, token: fakeToken }))
      navigate('/')
    }

  }

  return (
    <div className="min-b-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded p-8 w-96 shadow">
        <h2 className="text-2xl font-bold mb-6">Регистрация</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('name')} type='text' placeholder='Введите имя' className="w-full border rounded p-2 mb-1 outline-none focus:border-blue-500" />
          {errors.name && <span>{errors.name.message}</span>}

          <input {...register('email')} type='email' placeholder='Введите email' className="w-full border rounded p-2 mb-1 outline-none focus:border-blue-500" />
          {errors.email && <span>{errors.email.message}</span>}

          <input {...register('password')} type='password' placeholder='Введите пароль' className="w-full border rounded p-2 mb-1 outline-none focus:border-blue-500" />
          {errors.password && <span>{errors.password.message}</span>}

          <button type='submit' disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer hover:bg-blue-600 mt-2">{isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}</button>
          <Link to='/' className="block text-center mt-2 text-gray-500 hover:underline">
            На главную
          </Link>
        </form>
      </div>
    </div>
  )
}