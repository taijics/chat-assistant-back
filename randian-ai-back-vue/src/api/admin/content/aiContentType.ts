import createAxios from '@/utils/request'

const baseUrl = import.meta.env.VITE_ADMIN_BASE_URL

// 内容分类管理列表查询
export function queryAiContentTypeList(params: PageQuery, option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/content/aiContentType/query`, params)
}

// 新增内容分类管理
export function postInsertAiContentType(params = {}, option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/content/aiContentType/insert`, params)
}

// 修改内容分类管理
export function putUpdateAiContentType(params = {}, option?: RequestOption) {
    return createAxios(option).put(`${baseUrl}/api/admin/content/aiContentType/update`, params)
}

// 获取内容分类管理详情
export function getAiContentTypeById(id: number) {
    return createAxios().get(`${baseUrl}/api/admin/content/aiContentType/get/${id}`)
}

// 批量删除内容分类管理
export function delAiContentTypeByIds(ids: string, option?: RequestOption) {
    return createAxios(option).delete(`${baseUrl}/api/admin/content/aiContentType/del`, { params: { ids } })
}

// 内容分类管理导入
export function aiContentTypeImport(params: object[], option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/content/aiContentType/imports`, params)
}
