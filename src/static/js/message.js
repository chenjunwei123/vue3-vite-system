import {ElMessage} from 'element-plus';
function msg(res) {
  if(res.meta.status === 200 || res.meta.status === 201) {
   ElMessage.success(res.meta.msg)
   return true
  }else {
   ElMessage.warning(res.meta.msg)
  }
}
export default msg