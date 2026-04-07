import { GoogleLogin } from '@react-oauth/google'

interface LoginPageProps {
  onSuccess: (credential: string) => void
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-6 p-10 rounded-2xl bg-bg-secondary border border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-text-primary">SalesPulse</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Welcome back</h1>
          <p className="text-text-secondary text-sm">Sign in to access the dashboard</p>
        </div>
        <GoogleLogin
          onSuccess={(response) => {
            if (response.credential) onSuccess(response.credential)
          }}
          onError={() => console.error('Google login failed')}
          theme="filled_black"
          shape="rectangular"
          size="large"
          text="signin_with"
        />
      </div>
    </div>
  )
}
