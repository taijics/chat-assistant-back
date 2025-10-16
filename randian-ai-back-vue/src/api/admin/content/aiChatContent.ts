import createAxios from '@/utils/request'

const baseUrl = import.meta.env.VITE_ADMIN_BASE_URL

// 聊天内容管理列表查询
export function queryAiChatContentList(params: PageQuery, option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/content/aiChatContent/query`, params)
}

// 新增聊天内容管理
export function postInsertAiChatContent(params = {}, option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/content/aiChatContent/insert`, params)
}

// 修改聊天内容管理
export function putUpdateAiChatContent(params = {}, option?: RequestOption) {
    return createAxios(option).put(`${baseUrl}/api/admin/content/aiChatContent/update`, params)
}

// 获取聊天内容管理详情
export function getAiChatContentById(id: number) {
    return createAxios().get(`${baseUrl}/api/admin/content/aiChatContent/get/${id}`)
}

// 批量删除聊天内容管理
export function delAiChatContentByIds(ids: string, option?: RequestOption) {
    return createAxios(option).delete(`${baseUrl}/api/admin/content/aiChatContent/del`, { params: { ids } })
}

// 聊天内容管理导入
export function aiChatContentImport(params: object[], option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/content/aiChatContent/imports`, params)
}
