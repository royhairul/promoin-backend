import { SupabaseService } from '@/supabase/supabase.client';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { platform, userInfo } from 'os';
import puppeteer from 'puppeteer';

@Injectable()
export class InstagramService {
  constructor(private supabaseService: SupabaseService) {}

  // Ambil userId dari username
  private async getUserId(username: string): Promise<string | null> {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0',
    };

    try {
      const res = await axios.get(`https://www.instagram.com/${username}/`, {
        headers,
        timeout: 10000,
      });
      const html = res.data as string;
      const match = html.match(/"profilePage_([0-9]+)"/);
      return match ? match[1] : null;
    } catch (e) {
      console.error('[!] Gagal request profile:', e.message);
      return null;
    }
  }

  async login(username: string, password: string) {
    // --- 1. Login via Puppeteer ---
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.instagram.com', { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', username, { delay: 100 });
    await page.type('input[name="password"]', password, { delay: 100 });
    await page.keyboard.press('Enter');

    // Ambil cookies
    const cookies = await page.cookies();
    await browser.close();

    // --- 2. Ambil userId via axios dengan cookies ---
    const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

    // Ambil userId setelah login
    const userId = await this.getUserId(username);

    // --- 3. Simpan ke Supabase ---
    const { data, error } = await this.supabaseService.supabase
      .from('scraper')
      .upsert({
        platform: 'instagram',
        cookie: JSON.stringify(cookies),
        user_id: userId,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[!] Error save to Supabase:', error.message);
      return null;
    }

    console.log('[+] Login + cookies + userId berhasil disimpan ke Supabase');

    return {
      username,
      userId,
      cookies,
    };
  }

  private async getAccount() {
    return await this.supabaseService.supabase
      .from('scraper')
      .select('cookie')
      .eq('platform', 'instagram')
      .single();
  }

  async fetchGraphQL(docId: string, variables: string) {
    const { data: account, error } = await this.getAccount();

    const url = `https://www.instagram.com/graphql/query/?doc_id=${docId}&variables=${variables}`;

    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      Accept: 'application/json',
      Cookie: account.cookie as string,
    };

    try {
      const response = await axios.get(url, {
        headers,
        timeout: 10000,
      });

      return response.data;
    } catch (e) {
      console.error('[!] Error saat request:', e.message);
      return null;
    }
  }

  async scrapeProfile(target: string) {
    const userId = await this.getUserId(target);

    const docId = '24098904923132686';
    const variables = JSON.stringify({
      id: userId,
      render_surface: 'PROFILE',
    });

    const response = await this.fetchGraphQL(docId, variables);
    if (!response?.data?.user) {
      return {
        platform: 'instagram',
        userId,
        message: 'Data user tidak ditemukan',
      };
    }

    const user = response.data.user;

    // 4. Return profil
    return {
      platform: 'instagram',
      username: user.username,
      userId: user.id,
      full_name: user.full_name,
      biography: user.biography,
      profile_pic: user.profile_pic_url,
      profile_pic_hd: user.hd_profile_pic_url_info?.url || null,
      followers: user.follower_count,
      following: user.following_count,
      posts: user.media_count,
    };
  }

  async scrapePost(target: string) {
    const userId = await this.getUserId(target);

    const docId = '9926142507487500';
    const variables = JSON.stringify({
      data: {
        count: 5,
        include_reel_media_seen_timestamp: true,
        include_relationship_info: true,
        latest_besties_reel_media: true,
        latest_reel_media: true,
      },
      username: target,
      __relay_internal__pv__PolarisIsLoggedInrelayprovider: true,
    });

    const response = await this.fetchGraphQL(docId, variables);
    if (!response?.data) {
      return {
        userId,
        username: target,
        platform: 'instagram',
        message: 'Data user tidak ditemukan',
      };
    }

    const data =
      response.data.xdt_api__v1__feed__user_timeline_graphql_connection.edges.map(
        (edge) => {
          const node = edge.node;
          return {
            id: node.id,
            caption: node.caption.text,
            taken_at: new Date(node.taken_at * 1000).toISOString(),
            images: node.image_versions2.candidates[0].url,
            likes: node.like_count,
            link_post: 'https://www.instagram.com/p/' + node.code,
          };
        },
      );

    // 4. Return profil
    return data;
  }
}
