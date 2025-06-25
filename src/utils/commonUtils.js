import { MESSAGES } from '../constant/messages'

/* 이메일 유효성 검사 */
export const validateEmail = (rule, value, callback) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!value) {
    callback(new Error(MESSAGES.REQUIRE_EMAIL_FIELDS))
  } else if (!emailPattern.test(value)) {
    callback(new Error(MESSAGES.INVALID_EMAIL))
  } else {
    callback()
  }
}
