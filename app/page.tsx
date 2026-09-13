'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function App() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isSavedUser, setIsSavedUser] = useState(false);

  const [tab, setTab] = useState<'tasks' | 'calendar' | 'ideas'>('tasks');
  const [tasks, setTasks] = useState<any[]>([]);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});

  // Формы
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Смартфоны');
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);

  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const savedName = localStorage.getItem('marketing_user_name');
    const savedRole = localStorage.getItem('marketing_user_role');
    if (savedName) {
      setUserName(savedName);
      if (savedRole) setUserRole(savedRole);
      setIsSavedUser(true);
    }
    loadData();
  }, []);

  function saveProfile(e: any) {
    e.preventDefault();
    if (!userName.trim() || !userRole.trim()) return;
    localStorage.setItem('marketing_user_name', userName);
    localStorage.setItem('marketing_user_role', userRole);
    setIsSavedUser(true);
  }

  async function loadData() {
    const { data: t } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    const { data: i } = await supabase.from('ideas').select('*').order('created_at', { ascending: false });
    const { data: c } = await supabase.from('idea_comments').select('*').order('created_at', { ascending: true });

    if (t) setTasks(t);
    if (i) setIdeas(i);

    if (c) {
      const grouped: { [key: string]: any[] } = {};
      c.forEach((com) => {
        if (!grouped[com.idea_id]) grouped[com.idea_id] = [];
        grouped[com.idea_id].push(com);
      });
      setComments(grouped);
    }
  }

  async function addTask(e: any) {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    await supabase.from('tasks').insert([
      { title: taskTitle, category: taskCategory, author_name: userName, created_at: new Date(taskDate).toISOString() }
    ]);
    setTaskTitle('');
    loadData();
  }

  async function toggleTaskStatus(id: string, currentStatus: string) {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    await supabase.from('tasks').update({ status: nextStatus }).eq('id', id);
    loadData();
  }

  async function addIdea(e: any) {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaDesc.trim()) return;
    await supabase.from('ideas').insert([
      { title: ideaTitle, description: ideaDesc, author_name: userName, author_role: userRole }
    ]);
    setIdeaTitle('');
    setIdeaDesc('');
    loadData();
  }

  async function addComment(ideaId: string) {
    const text = commentInputs[ideaId];
    if (!text || !text.trim()) return;

    await supabase.from('idea_comments').insert([
      { idea_id: ideaId, author_name: userName, comment_text: text }
    ]);

    setCommentInputs({ ...commentInputs, [ideaId]: '' });
    loadData();
  }

  // Окно входа (имя и должность вручную)
  if (!isSavedUser) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans text-[#1D1D1F]">
        <form onSubmit={saveProfile} className="bg-white p-8 rounded-3xl shadow-lg border border-black/5 max-w-md w-full space-y-4">
          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-2">
            M
          </div>
          <h1 className="text-xl font-bold">Добро пожаловать в команду!</h1>
          <p className="text-sm text-gray-500">Представьтесь, чтобы коллеги знали, кто добавляет задачи и идеи.</p>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Ваше имя и фамилия</label>
            <input
              type="text"
              required
              placeholder="Например: Курбан Сахатмурадов"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-black/5 px-4 py-3 rounded-2xl text-sm outline-none border border-transparent focus:border-black/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Ваша роль / должность</label>
            <input
              type="text"
              required
              placeholder="Например: Главный маркетолог, Дизайнер..."
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full bg-black/5 px-4 py-3 rounded-2xl text-sm outline-none border border-transparent focus:border-black/20"
            />
          </div>

          <button type="submit" className="w-full bg-[#0071E3] text-white py-3 rounded-2xl text-sm font-semibold hover:bg-[#0077ED] transition-all">
            Войти в систему
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-4 md:p-8 font-sans antialiased">
      {/* Шапка */}
      <header className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-black/5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-sm">
            M
          </div>
          <div>
            <h1 className="font-bold text-base">Маркетинг • Сеть электроники</h1>
            <p className="text-xs text-gray-400">Сотрудник: <span className="font-semibold text-gray-700">{userName}</span> ({userRole})</p>
          </div>
        </div>

        <div className="flex bg-black/5 p-1 rounded-2xl text-xs font-medium">
          <button
            onClick={() => setTab('tasks')}
            className={`px-4 py-2 rounded-xl transition-all ${tab === 'tasks' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-500'}`}
          >
            Планы на день
          </button>
          <button
            onClick={() => setTab('calendar')}
            className={`px-4 py-2 rounded-xl transition-all ${tab === 'calendar' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-500'}`}
          >
            Обзор за месяц
          </button>
          <button
            onClick={() => setTab('ideas')}
            className={`px-4 py-2 rounded-xl transition-all ${tab === 'ideas' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-500'}`}
          >
            Идеи и Обсуждения
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {/* Вкладка 1: Планы по дням */}
        {tab === 'tasks' && (
          <div className="space-y-4">
            <form onSubmit={addTask} className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 flex flex-col md:flex-row gap-3">
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Новая задача или активность..."
                className="flex-1 bg-black/5 px-4 py-2.5 rounded-2xl text-sm outline-none"
              />
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="bg-black/5 px-4 py-2.5 rounded-2xl text-sm outline-none"
              />
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
                className="bg-black/5 px-3 py-2.5 rounded-2xl text-sm outline-none"
              >
                <option value="Смартфоны">Смартфоны</option>
                <option value="Бытовая техника">Бытовая техника</option>
                <option value="ТВ и Звук">ТВ и Звук</option>
                <option value="Акции и Скидки">Акции и Скидки</option>
                <option value="Общее">Общее</option>
              </select>
              <button type="submit" className="bg-[#0071E3] text-white px-6 py-2.5 rounded-2xl text-sm font-semibold hover:bg-[#0077ED]">
                Добавить
              </button>
            </form>

            <div className="bg-white rounded-3xl border border-black/5 divide-y overflow-hidden shadow-sm">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">Список задач пуст</div>
              ) : (
                tasks.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-black/[0.01] transition-colors">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleTaskStatus(t.id, t.status)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          t.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                        }`}
                      >
                        {t.status === 'done' && '✓'}
                      </button>
                      <div>
                        <p className={`text-sm font-medium ${t.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {t.title}
                        </p>
                        <p className="text-[11px] text-gray-400">Автор: {t.author_name || 'Маркетинг'}</p>
                      </div>
                    </div>
                    <span className="bg-black/5 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                      {t.category}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Вкладка 2: Обзор за месяц */}
        {tab === 'calendar' && (
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">План активностей на текущий месяц</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tasks.map((t) => (
                <div key={t.id} className="bg-[#F5F5F7] p-4 rounded-2xl border border-black/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#0071E3]">{new Date(t.created_at).toLocaleDateString('ru-RU')}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-gray-500 border border-black/5">{t.category}</span>
                  </div>
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-[11px] text-gray-400">Ответственный: {t.author_name || 'Команда'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка 3: Идеи и Обсуждения */}
        {tab === 'ideas' && (
          <div className="space-y-6">
            <form onSubmit={addIdea} className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-3">
              <h2 className="font-bold text-base">Предложить идею / кампанию</h2>
              <input
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="Заголовок идеи (например: Акция Trade-In на новые смартфоны)..."
                className="w-full bg-black/5 px-4 py-2.5 rounded-2xl text-sm outline-none"
              />
              <textarea
                value={ideaDesc}
                onChange={(e) => setIdeaDesc(e.target.value)}
                placeholder="Подробное описание предложения и механики акции..."
                className="w-full bg-black/5 px-4 py-2.5 rounded-2xl text-sm outline-none h-24"
              />
              <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-2xl text-sm font-semibold hover:bg-gray-800">
                Опубликовать предложение
              </button>
            </form>

            {/* Список предложений */}
            <div className="space-y-4">
              {ideas.map((i) => (
                <div key={i.id} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-base">{i.title}</h3>
                      <span className="text-xs text-gray-400">{i.author_name} ({i.author_role || 'Маркетолог'})</span>
                    </div>
                    <p className="text-sm text-gray-600">{i.description}</p>
                  </div>

                  {/* Блок комментариев */}
                  <div className="pt-4 border-t border-black/5 space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Обсуждение и комментарии</h4>
                    
                    <div className="space-y-2">
                      {(comments[i.id] || []).map((com) => (
                        <div key={com.id} className="bg-[#F5F5F7] p-3 rounded-2xl text-xs space-y-1">
                          <span className="font-bold text-gray-700">{com.author_name}: </span>
                          <span className="text-gray-600">{com.comment_text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Поле добавления комментария */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Написать комментарий..."
                        value={commentInputs[i.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [i.id]: e.target.value })}
                        className="flex-1 bg-black/5 px-3 py-2 rounded-xl text-xs outline-none"
                      />
                      <button
                        onClick={() => addComment(i.id)}
                        className="bg-black/10 hover:bg-black/20 text-black px-4 py-2 rounded-xl text-xs font-semibold"
                      >
                        Ответить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
