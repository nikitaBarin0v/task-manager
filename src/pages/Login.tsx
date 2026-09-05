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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type='email' placeholder='Введите email' />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type='password' placeholder='Введите пароль' />
      {errors.password && <span>{errors.password.message}</span>}

      <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Вход...' : 'Войти'}</button>
      <Link to='/register'>Регистрация</Link>
    </form>
  )
}