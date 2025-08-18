// src/App.tsx
import { useState } from 'react'

type Form = { id: string; pw: string; keep: boolean }

function Logo() {
  return (
    <div className="flex justify-center">
      {/* 단순한 11 로고 모사 (SVG 대체 가능) */}
      <div className="text-4xl font-extrabold text-pink-500 tracking-tight select-none">11ST</div>
    </div>
  )
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
  )
}

export default function App() {
  const [form, setForm] = useState<Form>({ id: '', pw: '', keep: false })
  const [showPw, setShowPw] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 실제 로그인 연동
    alert(JSON.stringify(form, null, 2))
  }

  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4">
          {/* 카드 영역 */}
          <div className="mt-16 rounded-2xl border border-gray-200 shadow-card">
            <div className="mx-auto max-w-md p-10">
              <Logo />

              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <div className="space-y-3">
                  <input
                    name="id"
                    value={form.id}
                    onChange={onChange}
                    placeholder="아이디 입력"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand.red focus:ring-2 focus:ring-brand.red/20"
                  />
                  <div className="relative">
                    <input
                      name="pw"
                      value={form.pw}
                      onChange={onChange}
                      type={showPw ? 'text' : 'password'}
                      placeholder="비밀번호 8자~20자"
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm pr-10 outline-none focus:border-brand.red focus:ring-2 focus:ring-brand.red/20"
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
                  className="mt-2 w-full rounded-lg bg-brand.red py-3 text-sm font-semibold text-white hover:bg-brand.redDark transition-colors"
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
                  <SocialIcon label="애플"></SocialIcon>
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
                    className="h-4 w-4 rounded border-gray-300 text-brand.red focus:ring-brand.red"
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
            <a className="hover:text-gray-800" href="#">회원가입</a>
          </div>
        </div>
      </main>
    </div>
  )
}