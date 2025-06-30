import { ElMessageBox } from 'element-plus'

/* ConfirmBox */
export function showConfirmBox(message, title, type, confirmText) {
  return ElMessageBox.confirm(message, title, {
    confirmButtonText: confirmText,
    cancelButtonText: '취소',
    type: type,
  })
}

/* AlertBox */
export function showAlertBox(message, type) {
  return ElMessageBox.alert(message, '', {
    confirmButtonText: '확인',
    type: type,
  })
}
