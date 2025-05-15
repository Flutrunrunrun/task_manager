// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const filterButtons = {
        all: document.getElementById('showAll'),
        active: document.getElementById('showActive'),
        completed: document.getElementById('showCompleted')
    };

    // 任务数组
    let tasks = [];

    // 初始化：从本地存储加载任务
    function init() {
        try {
            const savedTasks = localStorage.getItem('tasks');
            if (savedTasks) {
                tasks = JSON.parse(savedTasks);
                if (!Array.isArray(tasks)) throw new Error('数据格式错误');
                renderTasks();
            }
        } catch (e) {
            console.error('读取存储失败:', e);
            tasks = [];
            localStorage.removeItem('tasks');
            renderTasks();
        }
    }

    // 渲染任务列表
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        const tasksToShow = tasks.filter(task => {
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        });
        
        tasksToShow.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.completed ? 'completed' : ''}`;
            
            taskElement.innerHTML = `
                <input 
                    type="checkbox" 
                    ${task.completed ? 'checked' : ''}
                    data-index="${index}"
                    aria-label="标记任务为完成"
                >
                <span class="task-text">${task.text}</span>
                <button data-index="${index}" aria-label="删除任务">删除</button>
            `;
            
            taskList.appendChild(taskElement);
        });
        
        // 保存到本地存储
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // 添加新任务
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const text = taskInput.value.trim();
        if (!text) {
            alert('任务内容不能为空');
            return;
        }
        
        tasks.push({ text, completed: false });
        taskInput.value = '';
        renderTasks();
    });

    // 处理任务完成状态和删除
    taskList.addEventListener('click', function(e) {
        // 完成/取消完成任务
        if (e.target.matches('input[type="checkbox"]')) {
            const index = e.target.dataset.index;
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
        }
        
        // 删除任务
        if (e.target.matches('button')) {
            const index = e.target.dataset.index;
            tasks.splice(index, 1);
            renderTasks();
        }
    });

    // 过滤任务
    filterButtons.all.addEventListener('click', () => renderTasks('all'));
    filterButtons.active.addEventListener('click', () => renderTasks('active'));
    filterButtons.completed.addEventListener('click', () => renderTasks('completed'));

    // 初始化应用
    init();
});