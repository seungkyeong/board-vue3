import { ElMessageBox } from 'element-plus'

/* ConfirmBox */
export function showConfirmBox(message, title = '확인') {
  return ElMessageBox.confirm(message, title, {
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    type: 'warning',
  })
}

/* AlertBox */
export function showAlertBox(message, type) {
  return ElMessageBox.alert(message, '', {
    confirmButtonText: '확인',
    type: type,
  })
}
