import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { useFormik } from 'formik';
import { AuthLayout } from '../components/auth-layout';
import { twMerge } from 'tailwind-merge';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useError } from 'react-use';

export function LoginScreen() {
  const navigate = useNavigate();
  const { registerDevice, login } = useAuth();
  const dispatch = useError();

  const formik = useFormik({
    initialValues: {
      username: '',
      otp: ''
    },
    onSubmit: async (values) => {
      try {
        await registerDevice(values.username, values.otp);
        await login();
        navigate('/');
      } catch (error) {
        dispatch(error as Error);
      }
    }
  });

  return (
    <AuthLayout title={(
      <span>Sign in to your account</span>
    )}>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label
            className={twMerge([
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
            <div className="label" role="alert">
              <span className="label-text-alt">{formik.errors.username}</span>
            </div>
          </label>

          <label className={twMerge([
            'form-control w-full',
            formik.errors.otp?.length && 'label-error'
          ])}>
            <div className="label">
              <span className="label-text">Enter your OTP?</span>
            </div>
            <input
              required
              id="otp"
              name="otp"
              type="text"
              autoComplete="otp"
              onChange={formik.handleChange}
              value={formik.values.otp}
              className="input input-bordered w-full"
            />
            <div className="label" role="alert">
              <span className="label-text-alt">{formik.errors.otp}</span>
            </div>
          </label>

          <div>
            <div className="text-xs inline-flex gap-2">
              No account yet?{' '}
              <Link to="/auth" className="flex gap-1 text-primary">
                Sign up
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div>
          <button className="btn btn-primary w-full" type="submit">
            Sign in
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
