import { useRouter } from 'next/navigation';

export const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const router = useRouter();
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!authToken) {
      router.push('/login');
      return null;
    }
    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithAuth;
};