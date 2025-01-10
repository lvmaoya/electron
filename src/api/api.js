import request from '@/api/request';

// 获取所有 Todo 项目
export function getTodos(data) {
  return request({
    url: '/todo/list',
    method: 'get',
    params: data
  });
}
// 获取今天的 Todo 项目
export function getTodayTodos() {
  return request({
    url: '/todo',
    method: 'get'
  });
}
// 添加新的 Todo 项目
export function addTodo(data) {
  return request({
    url: '/todo',
    method: 'post',
    data,
  });
}

// 更新 Todo 项目
export function updateTodo(data) {
  return request({
    url: `/todo`,
    method: 'put',
    data,
  });
}

// 删除 Todo 项目
export function deleteTodo(id) {
  return request({
    url: `/todo/${id}`,
    method: 'delete',
  });
}
// 排序 Todo 项目
export function orderTodo(params) {
  return request({
    url: `/todo/order`,
    method: 'get',
    params
  });
}
