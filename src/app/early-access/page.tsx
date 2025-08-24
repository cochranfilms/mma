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
            const res = await fetch('/api/emailjs/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            if (res.ok) {
              alert('Thanks! You\'re on the list.');
              form.reset();
            } else {
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


