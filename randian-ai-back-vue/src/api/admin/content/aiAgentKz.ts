import createAxios from '@/utils/request'

const baseUrl = import.meta.env.VITE_ADMIN_BASE_URL

// 扣子智能体管理列表查询
export function queryAiAgentKzList(params: PageQuery, option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/content/aiAgentKz/query`, params)
}

// 新增扣子智能体管理
export function postInsertAiAgentKz(params = {}, option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/content/aiAgentKz/insert`, params)
}

// 修改扣子智能体管理
export function putUpdateAiAgentKz(params = {}, option?: RequestOption) {
    return createAxios(option).put(`${baseUrl}/api/admin/content/aiAgentKz/update`, params)
}

// 获取扣子智能体管理详情
export function getAiAgentKzById(id: number) {
    return createAxios().get(`${baseUrl}/api/admin/content/aiAgentKz/get/${id}`)
}

// 批量删除扣子智能体管理
export function delAiAgentKzByIds(ids: string, option?: RequestOption) {
    return createAxios(option).delete(`${baseUrl}/api/admin/content/aiAgentKz/del`, { params: { ids } })
}

// 扣子智能体管理导入
export function aiAgentKzImport(params: object[], option?: RequestOption) {
    return createAxios(option).post(`${baseUrl}/api/admin/content/aiAgentKz/imports`, params)
}
