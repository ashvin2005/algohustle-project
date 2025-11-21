const users = new Map();

export const db = {
  users: {
    async set(userId, data) {
      users.set(userId, { ...data, updatedAt: new Date().toISOString() });
      return data;
    },
    
    async get(userId) {
      return users.get(userId) || null;
    },
    
    async exists(userId) {
      return users.has(userId);
    },
    
    async update(userId, data) {
      const existing = users.get(userId);
      if (!existing) return null;
      const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
      users.set(userId, updated);
      return updated;
    },
    
    async delete(userId) {
      return users.delete(userId);
    }
  }
};
