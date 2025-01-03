import { FunctionComponent } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: FunctionComponent<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
