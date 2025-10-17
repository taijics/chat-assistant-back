import createAxios from '@/utils/request'

const baseUrl = import.meta.env.VITE_ADMIN_BASE_URL

// 用户管理列表查询
export function queryAiUserList(params: PageQuery, option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/user/aiUser/query`, params)
}

// 新增用户管理
export function postInsertAiUser(params = {}, option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/user/aiUser/insert`, params)
}

// 修改用户管理
export function putUpdateAiUser(params = {}, option?: RequestOption) {
    return createAxios(option).put(`${baseUrl}/api/admin/user/aiUser/update`, params)
}

// 获取用户管理详情
export function getAiUserById(id: number) {
    return createAxios().get(`${baseUrl}/api/admin/user/aiUser/get/${id}`)
}

// 批量删除用户管理
export function delAiUserByIds(ids: string, option?: RequestOption) {
    return createAxios(option).delete(`${baseUrl}/api/admin/user/aiUser/del`, { params: { ids } })
}

// 用户管理导入
export function aiUserImport(params: object[], option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/user/aiUser/imports`, params)
}

