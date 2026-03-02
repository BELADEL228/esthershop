import { supabase } from '../supabase';

export const contactApi = {
  async sendMessage(data) {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      }]);

    if (error) throw error;
    return { success: true };
  },

  async getAllMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async markAsRead(id) {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};