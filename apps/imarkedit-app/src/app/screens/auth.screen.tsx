import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { useFormik } from 'formik';
import { AuthLayout } from '../components/auth-layout';
import { twMerge } from 'tailwind-merge';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function AuthScreen() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: ''
    },
    onSubmit: async (values) => {
      try {
        await signup(values.username);
        navigate('/auth/confirm');
      } catch (error) {
        console.error(error);
      }
    }
  });

  return (
    <AuthLayout title={(
      <span>Sign in to your account</span>
    )}>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className={twMerge([
            'form-control w-full',
            formik.errors.username?.length && 'label-error'
          ])}>
            <div className="label">
              <span className="label-text">What is your username?</span>
            </div>
            <input
              required
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              onChange={formik.handleChange}
              value={formik.values.username}
              placeholder="selast00"
              className="input input-bordered w-full"
            />
            <div className="label" role='alert'>
              <span className="label-text-alt">{formik.errors.username}</span>
            </div>
          </label>

          <div>
            <div className="text-xs inline-flex gap-2">
              Already have an account?{' '}
              <Link to="/auth/login" className='flex gap-1 text-primary'>
                Log in
                <ArrowRightIcon className='w-4 h-4' />
              </Link>
            </div>
          </div>
        </div>

        <div>
          <button className="btn btn-primary w-full" type="submit">
            Sign up
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
