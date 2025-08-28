export const TODO_STORAGE_KEY = "personal.todo.v2"; // v2で管理
export const defaultTodos = [];

export const loadTodos = () => {
    try {
        const raw = localStorage.getItem(TODO_STORAGE_KEY);
        return raw ? JSON.parse(raw) : defaultTodos;
    } catch {
        return defaultTodos;
    }
};
