import createAxios from '@/utils/request'

const baseUrl = import.meta.env.VITE_ADMIN_BASE_URL

// 小组管理列表查询
export function queryAiUserTeamList(params: PageQuery, option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/user/aiUserTeam/query`, params)
}

// 新增小组管理
export function postInsertAiUserTeam(params = {}, option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/user/aiUserTeam/insert`, params)
}

// 修改小组管理
export function putUpdateAiUserTeam(params = {}, option?: RequestOption) {
    return createAxios(option).put(`${baseUrl}/api/admin/user/aiUserTeam/update`, params)
}

// 获取小组管理详情
export function getAiUserTeamById(id: number) {
    return createAxios().get(`${baseUrl}/api/admin/user/aiUserTeam/get/${id}`)
}

// 批量删除小组管理
export function delAiUserTeamByIds(ids: string, option?: RequestOption) {
    return createAxios(option).delete(`${baseUrl}/api/admin/user/aiUserTeam/del`, { params: { ids } })
}

// 小组管理导入
export function aiUserTeamImport(params: object[], option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/user/aiUserTeam/imports`, params)
}



export function searchTeamAdmin(query: string = '', limit: number = 10, option?: RequestOption) {
  return createAxios(option).get(
    `${baseUrl}/api/admin/user/aiUser/searchTeamAdmin`,
    { params: { query, limit } }
  )
}