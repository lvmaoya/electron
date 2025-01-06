import request from '@/api/request';

// 获取所有 Todo 项目
export function getTodos(data) {
  console.log(data);
  
  return request({
    url: '/todo/list',
    method: 'get',
    params: data
  });
}

// 添加新的 Todo 项目
export function addTodo(data) {
  return request({
    url: '/todos',
    method: 'post',
    data,
  });
}

// 更新 Todo 项目
export function updateTodo(id, data) {
  return request({
    url: `/todos/${id}`,
    method: 'put',
    data,
  });
}

// 删除 Todo 项目
export function deleteTodo(id) {
  return request({
    url: `/todos/${id}`,
    method: 'delete',
  });
}