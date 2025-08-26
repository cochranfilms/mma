"use client";

export default function EarlyAccessPage() {
  return (
    <main className="min-h-screen bg-[rgb(16,11,9)] text-[#f5efe7]">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight">Request Early Access</h1>
        <p className="mt-2 text-[#d7c9b6]">
          Join the private beta and get updates, tips, tools, and launch access.
        </p>

        <form
          className="mt-6 grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const data = Object.fromEntries(new FormData(form).entries());
            try {
              const res = await fetch('/api/emailjs/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
              if (res.ok) {
                alert('Thanks! You\'re on the list.');
                form.reset();
                return;
              }
            } catch (_) {}

            // Fallback to EmailJS client-side REST if server route is unavailable
            try {
              const SERVICE_ID = 'service_hers22k';
              const TEMPLATE_ID_ADMIN = 'template_rjp7hxy';
              const TEMPLATE_ID_CLIENT = 'template_lzio9kd';
              const USER_ID = 'p4pF3OWvh-DXtae4c';
              const baseParams: Record<string, string | number | boolean | null | undefined> = {
                email: String(data.email || ''),
                first_name: String(data.first_name || ''),
                company: String(data.company || ''),
                goals: String(data.goals || ''),
                cta_url: 'https://www.marketingmousetrapagency.com/early-access',
                to_email: String(data.email || ''),
                to_name: String(data.first_name || data.email || ''),
                reply_to: String(data.email || ''),
                user_email: String(data.email || ''),
                user_name: String(data.first_name || data.email || ''),
              };
              const sendEmailJs = async (templateId: string) => {
                const payload = {
                  service_id: SERVICE_ID,
                  template_id: templateId,
                  user_id: USER_ID,
                  template_params: baseParams,
                };
                const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                if (!r.ok) throw new Error('EmailJS send failed');
              };
              await sendEmailJs(TEMPLATE_ID_ADMIN);
              await sendEmailJs(TEMPLATE_ID_CLIENT);
              alert('Thanks! You\'re on the list.');
              form.reset();
            } catch (err) {
              alert('Something went wrong. Please email us directly.');
            }
          }}
        >
          <label className="grid gap-1">
            <span className="text-sm">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-white/5 border border-white/20 px-3 py-3 outline-none"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm">First name</span>
              <input name="first_name" className="w-full bg-white/5 border border-white/20 px-3 py-3 outline-none" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Company</span>
              <input name="company" className="w-full bg-white/5 border border-white/20 px-3 py-3 outline-none" />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm">What are you hoping to achieve?</span>
            <textarea name="goals" rows={4} className="w-full bg-white/5 border border-white/20 px-3 py-3 outline-none" />
          </label>

          <button type="submit" className="bg-[#C7AE6A] text-black font-semibold px-5 py-3">
            Request early access
          </button>
        </form>
      </div>
    </main>
  );
}


