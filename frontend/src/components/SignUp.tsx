import React, { useState, useEffect, useRef } from 'react';




type SignUpProps = {
  navigateTo?: (path: string) => void;
};

const SignUp: React.FC<SignUpProps> = ({ navigateTo }) => {
  const [userType, setUserType] = useState<'general' | 'seller'>('general');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    postcode: '',
    // 셀러 전용 필드
    companyName: '',
    businessNumber: '',
    companyPhone: '',
    companyAddress: '',
    companyPostcode: '',
    companyDetailAddress: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenPostcode = () => {
    new (window as any).daum.Postcode({
      oncomplete: function(data: any) {
        let addr = ''; // 주소 변수
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else { // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }

        setFormData(prev => ({
          ...prev,
          postcode: data.zonecode,
          address: addr,
        }));
      }
    }).open();
  };

  const handleOpenCompanyPostcode = () => {
    new (window as any).daum.Postcode({
      oncomplete: function(data: any) {
        let addr = '';
        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }
        setFormData(prev => ({
          ...prev,
          companyPostcode: data.zonecode,
          companyAddress: addr,
        }));
      }
    }).open();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
    else if (formData.password.length < 8) newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!formData.name) newErrors.name = '이름을 입력해주세요.';
    if (!formData.phone) newErrors.phone = '전화번호를 입력해주세요.';
    else if (!/^[0-9]+$/.test(formData.phone)) newErrors.phone = '전화번호는 숫자만 입력 가능합니다.';

    if (userType === 'general') {
        if (!formData.address) newErrors.address = '주소를 입력해주세요.';
    }

    if (userType === 'seller') {
      if (!formData.companyName) newErrors.companyName = '회사명을 입력해주세요.';
      if (!formData.businessNumber) newErrors.businessNumber = '사업자등록번호를 입력해주세요.';
      if (!formData.companyPhone) newErrors.companyPhone = '회사 전화번호를 입력해주세요.';
      if (!formData.companyAddress) newErrors.companyAddress = '회사 주소를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    const submissionData = { ...formData };
    if (userType === 'general') {
        submissionData.address = `${formData.address} ${formData.detailAddress} (${formData.postcode})`.trim();
    }
    if (userType === 'seller') {
        submissionData.companyAddress = `${formData.companyAddress} ${formData.companyDetailAddress} (${formData.companyPostcode})`.trim();
    }

    try {
      const endpoint = userType === 'general' ? '/auth/signup' : '/auth/seller-signup';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
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
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-2xl font-bold text-rose-500">11ST</div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">회원가입</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setUserType('general')}
              className={`flex-1 py-2 px-4 rounded-l-lg border ${
                userType === 'general'
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              일반
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
            {/* Email, Password, Name, Phone inputs... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {userType === 'general' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    readOnly
                    className="w-1/3 px-3 py-2 border rounded-md bg-gray-100"
                    placeholder="우편번호"
                  />
                  <button
                    type="button"
                    onClick={handleOpenPostcode}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    주소 검색
                  </button>
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 mb-2"
                  placeholder="주소"
                />
                <input
                  type="text"
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="상세주소"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            )}

            {userType === 'seller' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
                  <input type="text" name="businessNumber" value={formData.businessNumber} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${errors.businessNumber ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.businessNumber && <p className="text-red-500 text-sm mt-1">{errors.businessNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">회사 전화번호</label>
                  <input type="text" name="companyPhone" value={formData.companyPhone} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-md ${errors.companyPhone ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.companyPhone && <p className="text-red-500 text-sm mt-1">{errors.companyPhone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">회사 주소</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      name="companyPostcode"
                      value={formData.companyPostcode}
                      readOnly
                      className="w-1/3 px-3 py-2 border rounded-md bg-gray-100"
                      placeholder="우편번호"
                    />
                    <button
                      type="button"
                      onClick={handleOpenCompanyPostcode}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      주소 검색
                    </button>
                  </div>
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md bg-gray-100 mb-2"
                    placeholder="회사 주소"
                  />
                  <input
                    type="text"
                    name="companyDetailAddress"
                    value={formData.companyDetailAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="상세주소"
                  />
                  {errors.companyAddress && <p className="text-red-500 text-sm mt-1">{errors.companyAddress}</p>}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-500 text-white py-3 px-4 rounded-md hover:bg-rose-600"
            >
              {isSubmitting ? '처리 중...' : '회원가입'}
            </button>
          </form>

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
