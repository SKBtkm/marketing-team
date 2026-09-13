<div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Ваша роль / должность</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full bg-black/5 px-4 py-3 rounded-2xl text-sm outline-none border border-transparent"
            >
              <option value="Главный маркетолог">Главный маркетолог</option>
              <option value="SMM-специалист">SMM-специалист</option>
              <option value="Таргетолог / Трафик">Таргетолог / Трафик</option>
              <option value="Контент-мейкер">Контент-мейкер</option>
              <option value="Trade-маркетолог">Trade-маркетолог</option>
            </select>
          </div>
