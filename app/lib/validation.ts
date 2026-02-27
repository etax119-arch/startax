export const PHONE_REGEX = /^[0-9]{2,4}-?[0-9]{3,4}-?[0-9]{4}$/;

export const VALID_CATEGORIES = [
  '기장대리',
  '세무조정',
  '양도세',
  '상속세',
  '증여세',
  '경정청구',
  '세무조사',
  '병의원 컨설팅',
  '경영 컨설팅',
  '기타',
] as const;

export const FIELD_LIMITS = {
  name: 50,
  company: 100,
  phone: 20,
  category: 30,
  message: 2000,
} as const;
