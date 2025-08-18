import React, { useState } from 'react';

type SignUpProps = {
  navigateTo?: (path: string) => void;
};

const SignUp: React.FC<SignUpProps> = ({ navigateTo }) => {
  const [userType, setUserType] = useState<'user' | 'seller'>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    // 셀러 전용 필드
    companyName: '',
    businessNumber: '',
    companyPhone: '',
    companyAddress: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    }

    // 전화번호 검증
    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^[0-9-]+$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식을 입력해주세요.';
    }

    // 주소 검증
    if (!formData.address) {
      newErrors.address = '주소를 입력해주세요.';
    }

    // 셀러 전용 필드 검증
    if (userType === 'seller') {
      if (!formData.companyName) {
        newErrors.companyName = '회사명을 입력해주세요.';
      }
      if (!formData.businessNumber) {
        newErrors.businessNumber = '사업자등록번호를 입력해주세요.';
      } else if (!/^[0-9-]+$/.test(formData.businessNumber)) {
        newErrors.businessNumber = '올바른 사업자등록번호 형식을 입력해주세요.';
      }
      if (!formData.companyPhone) {
        newErrors.companyPhone = '회사 전화번호를 입력해주세요.';
      }
      if (!formData.companyAddress) {
        newErrors.companyAddress = '회사 주소를 입력해주세요.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const endpoint = userType === 'user' ? '/auth/signup' : '/auth/seller-signup';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          ...(userType === 'seller' && {
            companyName: formData.companyName,
            businessNumber: formData.businessNumber,
            companyPhone: formData.companyPhone,
            companyAddress: formData.companyAddress
          })
        }),
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다!');
        navigateTo?.('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-2xl font-bold text-rose-500">11</div>
            <div className="text-rose-500 ml-1">▶</div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">회원가입</h2>
        </div>

        {/* 사용자 타입 선택 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex mb-6">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="6자 이상 입력"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="비밀번호 재입력"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="홍길동"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="010-1234-5678"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주소
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="서울시 강남구 테헤란로 123"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* 셀러 전용 필드들 */}
            {userType === 'seller' && (
              <>
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">셀러 정보</h3>
                </div>

                {/* 회사명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    회사명
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(주)예시회사"
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                  )}
                </div>

                {/* 사업자등록번호 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사업자등록번호
                  </label>
                  <input
                    type="text"
                    name="businessNumber"
                    value={formData.businessNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.businessNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123-45-67890"
                  />
                  {errors.businessNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessNumber}</p>
                  )}
                </div>

                {/* 회사 전화번호 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    회사 전화번호
                  </label>
                  <input
                    type="text"
                    name="companyPhone"
                    value={formData.companyPhone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.companyPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="02-1234-5678"
                  />
                  {errors.companyPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyPhone}</p>
                  )}
                </div>

                {/* 회사 주소 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    회사 주소
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      errors.companyAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="서울시 강남구 테헤란로 456"
                  />
                  {errors.companyAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyAddress}</p>
                  )}
                </div>
              </>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-500 text-white py-3 px-4 rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '처리 중...' : '회원가입'}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="text-center mt-4">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <button
              onClick={() => navigateTo?.('/login')}
              className="text-rose-500 hover:text-rose-600 font-medium"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
