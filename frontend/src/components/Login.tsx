import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type LoginProps = {
  navigateTo?: (path: string) => void;
};

type Form = { id: string; pw: string; keep: boolean };

function Logo() {
  return (
    <div className="flex justify-center">
      {/* 단순한 11 로고 모사 (SVG 대체 가능) */}
      <div className="text-4xl font-extrabold text-rose-500 tracking-tight select-none">11ST</div>
    </div>
  );
}

function SocialIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="h-10 w-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

const Login: React.FC<LoginProps> = ({ navigateTo }) => {
  const [userType, setUserType] = useState<'user' | 'seller'>('user');
  const [form, setForm] = useState<Form>({ id: '', pw: '', keep: false });
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.id,
          password: form.pw,
          userType: userType, // 사용자 타입 전송
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // 로그인 성공 시 AuthContext 업데이트
        login(userType);
        alert('로그인 성공!');
        navigateTo?.('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4">
          {/* 카드 영역 */}
          <div className="mt-16 rounded-2xl border border-gray-200 shadow-lg bg-white">
            <div className="mx-auto max-w-md p-10">
              <Logo />

              {/* 사용자 타입 선택 */}
              <div className="flex mt-6 mb-4">
                <button
                  type="button"
                  onClick={() => setUserType('user')}
                  className={`flex-1 py-2 px-4 rounded-l-lg border ${
                    userType === 'user'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  일반 사용자
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('seller')}
                  className={`flex-1 py-2 px-4 rounded-r-lg border ${
                    userType === 'seller'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  셀러
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-3">
                <div className="space-y-3">
                  <input
                    name="id"
                    value={form.id}
                    onChange={onChange}
                    placeholder="아이디 입력"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                  <div className="relative">
                    <input
                      name="pw"
                      value={form.pw}
                      onChange={onChange}
                      type={showPw ? 'text' : 'password'}
                      placeholder="비밀번호 8자~20자"
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm pr-10 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="비밀번호 표시 전환"
                    >
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-rose-500 py-3 text-sm font-semibold text-white hover:bg-rose-600 transition-colors"
                >
                  로그인
                </button>

                {/* 최근로그인 + 소셜 행 */}
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 border border-gray-200">
                    최근로그인
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-4">
                  <SocialIcon label="카카오">💬</SocialIcon>
                  <SocialIcon label="네이버">N</SocialIcon>
                  <SocialIcon label="구글">G</SocialIcon>
                  <SocialIcon label="애플">🍎</SocialIcon>
                  <SocialIcon label="페이코">P</SocialIcon>
                  <SocialIcon label="휴대폰">📱</SocialIcon>
                </div>

                {/* 로그인 상태 유지 */}
                <label className="mt-2 flex items-center gap-2 text-sm text-gray-600 select-none">
                  <input
                    type="checkbox"
                    name="keep"
                    checked={form.keep}
                    onChange={onChange}
                    className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                  />
                  로그인 상태 유지
                </label>
              </form>
            </div>
          </div>

          {/* 하단 링크들 */}
          <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
            <a className="hover:text-gray-800" href="#">아이디찾기</a>
            <span>·</span>
            <a className="hover:text-gray-800" href="#">비밀번호찾기</a>
            <span>·</span>
            <a className="hover:text-gray-800" href="#">비회원 주문조회</a>
            <span>·</span>
            <button 
              onClick={() => navigateTo?.('/signup')}
              className="hover:text-gray-800"
            >
              회원가입
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
