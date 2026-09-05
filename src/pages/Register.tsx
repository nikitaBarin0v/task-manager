import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} type='text' placeholder='Введите имя' />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} type='email' placeholder='Введите email' />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type='password' placeholder='Введите пароль' />
      {errors.password && <span>{errors.password.message}</span>}

      <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}</button>
    </form>
  )
}