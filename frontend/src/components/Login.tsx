import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login as authLogin } from '../services/authService';

type LoginProps = {
  navigateTo?: (path: string) => void;
};

type Form = { id: string; pw: string; keep: boolean };
type Errors = { id?: string; pw?: string };

function Logo() {
  return (
    <div className="flex justify-center">
      {/* 단순한 11 로고 모사 (SVG 대체 가능) */}
      <div className="text-4xl font-extrabold text-rose-500 tracking-tight select-none">11ST</div>
    </div>
  );
}



const Login: React.FC<LoginProps> = ({ navigateTo }) => {
  const [userType, setUserType] = useState<'general' | 'seller'>('general');
  const [form, setForm] = useState<Form>({ id: '', pw: '', keep: false });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const { login } = useAuth();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name as keyof Errors]) {
      setErrors((p) => ({ ...p, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!form.id) newErrors.id = '아이디를 입력해주세요.';
    if (!form.pw) newErrors.pw = '비밀번호를 입력해주세요.';
    return newErrors;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.id,
          password: form.pw,
          userType: userType,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.accessToken) {
          // 새로운 AuthContext login 함수 사용
          login(userType, data.accessToken, data.user);
          
          // 판매자인 경우 판매자 마이페이지로, 일반 사용자는 홈으로
          if (userType === 'seller') {
            navigateTo?.('/seller/mypage');
          } else {
            navigateTo?.('/');
          }
        } else {
          alert('로그인에 성공했으나 토큰을 받지 못했습니다.');
        }
      } else {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '로그인에 실패했습니다.');
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
                  onClick={() => setUserType('general')}
                  className={`flex-1 py-2 px-4 rounded-l-lg border ${
                    userType === 'general'
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
                <div>
                  <input
                    name="id"
                    value={form.id}
                    onChange={onChange}
                    placeholder="아이디 입력"
                    className={`w-full rounded-lg border ${errors.id ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20`}
                  />
                  {errors.id && <p className="mt-1 text-xs text-red-500">{errors.id}</p>}
                </div>
                <div className="relative">
                  <input
                    name="pw"
                    value={form.pw}
                    onChange={onChange}
                    type={showPw ? 'text' : 'password'}
                    placeholder="비밀번호 8자~20자"
                    className={`w-full rounded-lg border ${errors.pw ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-3 text-sm pr-10 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="비밀번호 표시 전환"
                  >
                    <i className={`fa ${showPw ? 'fa-eye-slash' : 'fa-eye'} fa-lg`}></i>
                  </button>
                  {errors.pw && <p className="mt-1 text-xs text-red-500">{errors.pw}</p>}
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-rose-500 py-3 text-sm font-semibold text-white hover:bg-rose-600 transition-colors"
                >
                  로그인
                </button>


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
              onClick={() => navigateTo?.(userType === 'seller' ? '/seller-signup' : '/signup')}
              className="hover:text-gray-800"
            >
              {userType === 'seller' ? '판매자 회원가입' : '회원가입'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
