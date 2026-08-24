import type { Activity, ActivityCategory } from '../types';
import { INITIAL_ACTIVITIES } from '../data/activities';

const ACTIVITIES_KEY = 'lv_activities';

export const activityService = {
  getAllActivities(): Activity[] {
    const data = localStorage.getItem(ACTIVITIES_KEY);
    if (!data) {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(data);
  },

  getFeaturedActivities(): Activity[] {
    return this.getAllActivities().filter(a => a.featured);
  },

  getActivityById(id: string): Activity | undefined {
    return this.getAllActivities().find(a => a.id === id);
  },

  getActivityBySlug(slug: string): Activity | undefined {
    return this.getAllActivities().find(a => a.slug === slug);
  },

  filterActivities(category?: ActivityCategory | 'All', destination?: string | 'All'): Activity[] {
    let list = this.getAllActivities();
    if (category && category !== 'All') {
      list = list.filter(a => a.category === category);
    }
    if (destination && destination !== 'All') {
      list = list.filter(a => a.destination.toLowerCase().includes(destination.toLowerCase()));
    }
    return list;
  },

  createActivity(act: Omit<Activity, 'id' | 'slug' | 'rating' | 'reviewCount'>): Activity {
    const activities = this.getAllActivities();
    const slug = act.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newAct: Activity = {
      ...act,
      id: `act-${Date.now()}`,
      slug,
      rating: 5.0,
      reviewCount: 0
    };
    activities.push(newAct);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    return newAct;
  },

  updateActivity(id: string, updates: Partial<Activity>): Activity {
    const activities = this.getAllActivities();
    const idx = activities.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Activity not found');
    activities[idx] = { ...activities[idx], ...updates };
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    return activities[idx];
  },

  deleteActivity(id: string): void {
    const activities = this.getAllActivities().filter(a => a.id !== id);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  }
};
