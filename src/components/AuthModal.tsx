'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendOTP, verifyOTP, registerUser, verifyRegistrationOTP } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (message: string, type: 'success' | 'error') => void;
}

export default function AuthModal({ isOpen, onClose, onToast }: AuthModalProps) {
  const t = useTranslations('IndexPage');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading: authLoading } = useAppSelector(state => state.auth);

  const [modalStep, setModalStep] = useState<'phone' | 'otp' | 'forgot-password' | 'signup' | 'signup-otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [signupData, setSignupData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (modalStep === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [modalStep, timer]);

  const handleContinue = async () => {
    if (phoneNumber.length === 10) {
      try {
        await dispatch(sendOTP({ phone: phoneNumber })).unwrap();
        setModalStep('otp');
        setTimer(30);
      } catch (error) {
        console.error('Login error:', error);
        onToast('Failed to send OTP. Please try again.', 'error');
      }
    }
  };

  const handleResend = async () => {
    try {
      await dispatch(sendOTP({ phone: phoneNumber })).unwrap();
      setTimer(30);
    } catch (error) {
      console.error('Resend OTP error:', error);
      onToast('Failed to resend OTP. Please try again.', 'error');
    }
  };

  const handleVerify = async () => {
    if (otp.length === 6) {
      try {
        await dispatch(verifyOTP({ phone: phoneNumber, otp })).unwrap();
        router.push('/customers/dashboard');
        closeModal();
      } catch (error) {
        console.error('OTP verification error:', error);
        onToast('Invalid OTP. Please try again.', 'error');
      }
    }
  };

  const closeModal = () => {
    onClose();
    setModalStep('phone');
    setPhoneNumber('');
    setOtp('');
    setSignupData({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' });
  };

  const handleSignup = async () => {
    if (signupData.password !== signupData.confirmPassword) {
      onToast('Passwords do not match', 'error');
      return;
    }
    try {
      await dispatch(registerUser({
        fullName: signupData.fullName,
        phone: signupData.phone,
        email: signupData.email,
        password: signupData.password
      })).unwrap();
      setPhoneNumber(signupData.phone);
      setModalStep('signup-otp');
      setTimer(30);
    } catch (error) {
      console.error('Signup error:', error);
      onToast('Registration failed. Please try again.', 'error');
    }
  };

  const handleVerifyRegistrationOTP = async () => {
    if (otp.length === 6) {
      try {
        await dispatch(verifyRegistrationOTP({ phone: phoneNumber, otp })).unwrap();
        router.push('/customers/dashboard');
        closeModal();
      } catch (error) {
        console.error('Registration OTP verification error:', error);
        onToast('Invalid OTP. Please try again.', 'error');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {modalStep === 'phone' && (
          <div>
            <h3 className="text-xl font-bold">{t('loginPopupTitle')}</h3>
            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {t('phoneInputLabel')}
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">+91</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full rounded-md border-gray-300 p-3 pl-12 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleContinue}
              disabled={phoneNumber.length !== 10 || authLoading}
              className="mt-6 w-full rounded-md bg-[#00A2B5] p-3 font-semibold text-white shadow-sm hover:bg-[#008C9E] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {authLoading ? 'Sending...' : t('continueButton')}
            </button>
            <div className="mt-4 text-center text-sm space-y-2">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setModalStep('forgot-password');
                    setPhoneNumber('');
                  }}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot Password?
                </button>
              </div>
              <div>
                <span className="text-gray-500">Not yet registered? </span>
                <button
                  type="button"
                  onClick={() => setModalStep('signup')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Click here to register
                </button>
              </div>
            </div>
          </div>
        )}

        {modalStep === 'forgot-password' && (
          <div>
            <h3 className="text-xl font-bold">{t('forgotPasswordTitle')}</h3>
            <p className="mt-2 text-sm text-gray-600">{t('forgotPasswordSubtitle')}</p>
            <div className="mt-4">
              <label htmlFor="reset-phone" className="block text-sm font-medium text-gray-700">
                {t('phoneInputLabel')}
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">+91</span>
                </div>
                <input
                  type="tel"
                  name="reset-phone"
                  id="reset-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full rounded-md border-gray-300 p-3 pl-12 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleContinue}
              disabled={phoneNumber.length !== 10}
              className="mt-6 w-full rounded-md bg-[#00A2B5] p-3 font-semibold text-white shadow-sm hover:bg-[#008C9E] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {t('sendOtpButton')}
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              <button
                type="button"
                onClick={() => setModalStep('phone')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('backToLoginLink')}
              </button>
            </p>
          </div>
        )}

        {modalStep === 'otp' && (
          <div>
            <h3 className="text-xl font-bold">{t('otpTitle')}</h3>
            <p className="mt-2 text-sm text-gray-600">
              {t('otpSubtitle', {phoneNumber})}
            </p>
            <div className="mt-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full rounded-md border-gray-300 p-3 text-center tracking-[.5em] shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleVerify}
              disabled={otp.length !== 6 || authLoading}
              className="mt-6 w-full rounded-md bg-[#00A2B5] p-3 font-semibold text-white shadow-sm hover:bg-[#008C9E] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Verifying...' : t('verifyButton')}
            </button>
            <div className="mt-4 text-center text-sm text-gray-600">
              {t('didNotReceive')}{' '}
              {timer > 0 ? (
                <span className="text-gray-500">
                  {t('resendTimer', {seconds: timer})}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {t('resendLink')}
                </button>
              )}
            </div>
          </div>
        )}

        {modalStep === 'signup' && (
          <div>
            <h3 className="text-xl font-bold">Create Account</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    className="block w-full rounded-md border-gray-300 p-3 pl-12 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Confirm password"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignup}
              disabled={!signupData.phone || !signupData.email || !signupData.password || !signupData.confirmPassword || authLoading}
              className="mt-6 w-full rounded-md bg-[#00A2B5] p-3 font-semibold text-white shadow-sm hover:bg-[#008C9E] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {authLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setModalStep('phone')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </button>
            </p>
          </div>
        )}

        {modalStep === 'signup-otp' && (
          <div>
            <h3 className="text-xl font-bold">Verify Registration</h3>
            <p className="mt-2 text-sm text-gray-600">
              Enter the OTP sent to {phoneNumber}
            </p>
            <div className="mt-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full rounded-md border-gray-300 p-3 text-center tracking-[.5em] shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleVerifyRegistrationOTP}
              disabled={otp.length !== 6 || authLoading}
              className="mt-6 w-full rounded-md bg-[#00A2B5] p-3 font-semibold text-white shadow-sm hover:bg-[#008C9E] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Verifying...' : 'Verify & Complete Registration'}
            </button>
            <div className="mt-4 text-center text-sm text-gray-600">
              Didn't receive OTP?{' '}
              {timer > 0 ? (
                <span className="text-gray-500">Resend in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(registerUser({
                      fullName: signupData.fullName,
                      phone: signupData.phone,
                      email: signupData.email,
                      password: signupData.password
                    }));
                    setTimer(30);
                  }}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}