import fs from 'fs';
import path from 'path';

export interface VIPUser {
  id: string;
  username: string;
  passwordHash: string; // Plain/hashed comparison handled server-side
  role: 'admin' | 'vip';
  name: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'suspended';
  notes?: string;
}

export interface UserFeedback {
  id: string;
  name: string;
  deviceModel: string;
  category: 'General' | 'Feature Suggestion' | 'Sensitivity Correction' | 'New Device Request' | 'Website Improvement' | 'Bug Report';
  rating: number;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed';
}

export interface CustomDevice {
  id: string;
  platform: 'Android' | 'iOS' | 'PC';
  brand: string;
  model: string;
  refreshRate: number; // e.g. 60, 90, 120, 144, 165
  recommendedDpi: number;
  specs: string;
  createdAt: string;
}

export interface SiteConfig {
  customLogoUrl: string | null;
  whatsappContact: string;
  tiktokUrl: string;
  tiktokUsername: string;
  announcement: string;
}

interface DatabaseSchema {
  users: VIPUser[];
  feedback: UserFeedback[];
  customDevices: CustomDevice[];
  config: SiteConfig;
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'fixa_db.json');

const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: 'usr_admin_1',
      username: 'fixaadmin',
      passwordHash: 'fixa@2026',
      role: 'admin',
      name: 'FIXA GAMING Owner',
      createdAt: new Date().toISOString(),
      expiresAt: '2099-12-31',
      status: 'active',
      notes: 'Main Administrator & Site Owner',
    },
    {
      id: 'usr_vip_demo',
      username: 'fixavip',
      passwordHash: 'vipheadshot2026',
      role: 'vip',
      name: 'Pro Esports VIP Member',
      createdAt: new Date().toISOString(),
      expiresAt: '2027-12-31',
      status: 'active',
      notes: 'Official VIP Access Pass',
    },
    {
      id: 'usr_vip_player2',
      username: 'headshotking',
      passwordHash: 'onetap777',
      role: 'vip',
      name: 'Drag Master VIP',
      createdAt: new Date().toISOString(),
      expiresAt: '2027-06-30',
      status: 'active',
      notes: 'Tournament player account',
    }
  ],
  feedback: [
    {
      id: 'fb_1',
      name: 'Kasun Bandara',
      deviceModel: 'Redmi Note 12 Pro 5G',
      category: 'Sensitivity Correction',
      rating: 5,
      message: 'The One Tap drag sensitivity for 120Hz display is absolutely insane! Got 82% headshot rate in CS Ranked.',
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      status: 'reviewed',
    },
    {
      id: 'fb_2',
      name: 'Dineth Perera',
      deviceModel: 'iPhone 14 Pro Max',
      category: 'General',
      rating: 5,
      message: 'Best Free Fire optimization guide for iOS. Zero frame drops even when recording highlights!',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'reviewed',
    },
    {
      id: 'fb_3',
      name: 'Tharindu Fernando',
      deviceModel: 'Samsung Galaxy A54',
      category: 'New Device Request',
      rating: 5,
      message: 'Can you please add more specific settings for Exynos 1380 with 450 DPI? Loved the FIXA AI assistant advice.',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      status: 'new',
    }
  ],
  customDevices: [
    {
      id: 'dev_1',
      platform: 'Android',
      brand: 'Infinix',
      model: 'GT 20 Pro Gaming',
      refreshRate: 144,
      recommendedDpi: 440,
      specs: 'Dimensity 8200 Ultimate, 12GB RAM, 144Hz AMOLED',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'dev_2',
      platform: 'Android',
      brand: 'Tecno',
      model: 'Pova 6 Pro 5G',
      refreshRate: 120,
      recommendedDpi: 420,
      specs: 'Dimensity 6080, 12GB RAM, 120Hz Display',
      createdAt: new Date().toISOString(),
    }
  ],
  config: {
    customLogoUrl: null,
    whatsappContact: '0741123762',
    tiktokUrl: 'https://www.tiktok.com/@fixafftop?_r=1&_t=ZS-9AzTNxLrOXl',
    tiktokUsername: '@fixafftop',
    announcement: '🔥 FIXA GAMING OB48 Season Update: New Drag Headshot Curve Algorithms and VIP Sensitivity Presets are now live!',
  }
};

class DBManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          ...INITIAL_DB,
          ...parsed,
          config: { ...INITIAL_DB.config, ...(parsed.config || {}) },
        };
      }
    } catch (e) {
      console.error('Error reading DB, using initial data:', e);
    }
    this.saveData(INITIAL_DB);
    return INITIAL_DB;
  }

  private saveData(data: DatabaseSchema) {
    try {
      this.ensureDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving DB:', e);
    }
  }

  // Users
  getUsers(): VIPUser[] {
    return this.data.users;
  }

  getUserByUsername(username: string): VIPUser | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  }

  getUserById(id: string): VIPUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  addUser(user: Omit<VIPUser, 'id' | 'createdAt'>): VIPUser {
    const newUser: VIPUser = {
      ...user,
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData(this.data);
    return newUser;
  }

  deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (this.data.users.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Feedback
  getFeedback(): UserFeedback[] {
    return this.data.feedback;
  }

  addFeedback(item: Omit<UserFeedback, 'id' | 'createdAt' | 'status'>): UserFeedback {
    const newFeedback: UserFeedback = {
      ...item,
      id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    this.data.feedback.unshift(newFeedback);
    this.saveData(this.data);
    return newFeedback;
  }

  deleteFeedback(id: string): boolean {
    const initialLen = this.data.feedback.length;
    this.data.feedback = this.data.feedback.filter(f => f.id !== id);
    if (this.data.feedback.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Custom Devices
  getCustomDevices(): CustomDevice[] {
    return this.data.customDevices;
  }

  addCustomDevice(device: Omit<CustomDevice, 'id' | 'createdAt'>): CustomDevice {
    const newDevice: CustomDevice = {
      ...device,
      id: 'dev_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.data.customDevices.push(newDevice);
    this.saveData(this.data);
    return newDevice;
  }

  deleteCustomDevice(id: string): boolean {
    const len = this.data.customDevices.length;
    this.data.customDevices = this.data.customDevices.filter(d => d.id !== id);
    if (this.data.customDevices.length !== len) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Config
  getConfig(): SiteConfig {
    return this.data.config;
  }

  updateConfig(updates: Partial<SiteConfig>): SiteConfig {
    this.data.config = { ...this.data.config, ...updates };
    this.saveData(this.data);
    return this.data.config;
  }
}

export const db = new DBManager();
