'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function App() {
  const [tab, setTab] = useState<'tasks' | 'ideas'>('tasks');
  const [tasks, setTasks] = useState<any[]>([]);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Смартфоны');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: t } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    const { data: i } = await supabase.from('ideas').select('*').order('created_at', { ascending: false });
    if (t) setTasks(t);
    if (i) setIdeas(i);
  }

  async function addTask(e: any) {
    e.preventDefault();
    if (!title) return;
    await supabase.from('tasks').insert([{ title, category }]);
    setTitle('');
    loadData();
  }

  async function addIdea(e: any) {
    e.preventDefault();
    if (!ideaTitle) return;
    await supabase.from('ideas').insert([{ title: ideaTitle, description: ideaDesc }]);
    setIdeaTitle(''); setIdeaDesc('');
    loadData();
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-4 md:p-8 font-sans">
      <header className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm mb-6 flex justify-between items-center border border-black/5">
        <h1 className="font-semibold text-lg">Маркетинг • Сеть магазинов техники</h1>
        <div className="flex gap-2 bg-black/5 p-1 rounded-xl text-sm font-medium">
          <button onClick={() => setTab('tasks')} className={`px-4 py-1.5 rounded-lg ${tab === 'tasks' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Задачи по дням</button>
          <button onClick={() => setTab('ideas')} className={`px-4 py-1.5 rounded-lg ${tab === 'ideas' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Идеи и Акции</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {tab === 'tasks' ? (
          <div className="space-y-4">
            <form onSubmit={addTask} className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex gap-2">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Новая задача..." className="flex-1 bg-black/5 px-4 py-2 rounded-xl text-sm outline-none" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-black/5 px-3 py-2 rounded-xl text-sm">
                <option value="Смартфоны">Смартфоны</option>
                <option value="Бытовая техника">Бытовая техника</option>
                <option value="Акции">Акции</option>
              </select>
              <button type="submit" className="bg-[#0071E3] text-white px-5 py-2 rounded-xl text-sm font-medium">Добавить</button>
            </form>

            <div className="bg-white rounded-2xl border border-black/5 divide-y">
              {tasks.map((t) => (
                <div key={t.id} className="p-4 flex justify-between items-center text-sm">
                  <span>{t.title}</span>
                  <span className="bg-black/5 px-3 py-1 rounded-full text-xs font-medium text-gray-600">{t.category}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={addIdea} className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 space-y-3">
              <input value={ideaTitle} onChange={(e) => setIdeaTitle(e.target.value)} placeholder="Название идеи / акции..." className="w-full bg-black/5 px-4 py-2 rounded-xl text-sm outline-none" />
              <textarea value={ideaDesc} onChange={(e) => setIdeaDesc(e.target.value)} placeholder="Описание предложения..." className="w-full bg-black/5 px-4 py-2 rounded-xl text-sm outline-none h-20" />
              <button type="submit" className="bg-black text-white px-5 py-2 rounded-xl text-sm font-medium">Опубликовать идею</button>
            </form>

            <div className="grid md:grid-cols-2 gap-4">
              {ideas.map((i) => (
                <div key={i.id} className="bg-white p-5 rounded-2xl border border-black/5 space-y-2">
                  <h3 className="font-semibold text-sm">{i.title}</h3>
                  <p className="text-xs text-gray-600">{i.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
