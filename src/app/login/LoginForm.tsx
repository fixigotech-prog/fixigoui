
'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {XMarkIcon} from '@heroicons/react/24/outline';

type ModalStep = 'phone' | 'otp' | 'forgot-password';

interface LoginFormProps {
  initialStep?: ModalStep;
  onClose: () => void;
}

export default function LoginForm({initialStep = 'phone', onClose}: LoginFormProps) {
  const t = useTranslations('IndexPage');
  const router = useRouter();
  const [modalStep, setModalStep] = useState<ModalStep>(initialStep);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30); // You might want to manage this timer globally or lift it up

  const handleContinue = () => {
    if (phoneNumber.length === 10) {
      // In a real app, you'd send an OTP to the phone number here
      setModalStep('otp');
      setTimer(30); // Reset timer for OTP
    }
  };

  const handleResend = () => {
    setTimer(30);
    // Add logic to resend OTP
  };

  const handleVerify = () => {
    // In a real app, you would verify the OTP with your backend.
    // If successful:
    router.push('/customers/dashboard'); // Or wherever the user should go after login
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
      Login form
      </div>
  );
}