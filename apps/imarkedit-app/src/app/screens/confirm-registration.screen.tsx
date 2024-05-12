import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { useFormik } from 'formik';
import { AuthLayout } from '../components/auth-layout';
import { twMerge } from 'tailwind-merge';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useError } from 'react-use';
import { QRCodeSVG } from 'qrcode.react';

export function ConfirmRegistrationScreen() {
  const navigate = useNavigate();
  const { confirmSignup, login, username, otp_data, registerDevice } = useAuth();
  const dispatch = useError();

  const formik = useFormik({
    initialValues: {
      otp: ''
    },
    onSubmit: async (values) => {
      try {
        await confirmSignup(username!, values.otp);
        await registerDevice(username!, values.otp);
        await login();
        navigate('/');
      } catch (error) {
        console.error(error);
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

          <div className="bg-primary p-4 md:p-10 rounded-xl mb-6">
            {otp_data && (
              <QRCodeSVG
                value={otp_data!}
                bgColor={'#ffffff00'}
                className="w-full h-full"
              />
            )}
            {!otp_data && (
              <div className="text-center text-white">
                Loading QR Code...
              </div>
            )}
          </div>

          <label className={twMerge([
            'form-control w-full',
            formik.errors.otp?.length && 'label-error'
          ])}>
            <div className="label">
              <span className="label-text">Enter your OTP</span>
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
        </div>

        <div>
          <button className="btn btn-primary w-full" type="submit">
            Confirm
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
