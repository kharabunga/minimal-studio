import PageLayout from "@/components/PageLayout";
import { useState } from "react";

const WorkWithMe = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <PageLayout>
      <h1 className="font-serif text-4xl md:text-5xl mb-12">Work With Me</h1>

      {/* Video placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div>
          <div className="aspect-video bg-muted mb-3" />
          <p className="text-sm text-muted-foreground italic">
            Serious about the work.
          </p>
        </div>
        <div>
          <div className="aspect-video bg-muted mb-3" />
          <p className="text-sm text-muted-foreground italic">
            Not too serious about ourselves.
          </p>
        </div>
      </div>

      {/* Tagline */}
      <div className="mb-20">
        <h2 className="font-serif text-2xl md:text-3xl mb-4">
          Dynamic problems require dynamic problem solvers.
        </h2>
        <p className="text-lg text-muted-foreground">
          Good thing we're a little bit of everything.
        </p>
      </div>

      {/* Contact */}
      <div className="space-y-12">
        <div className="space-y-4">
          <h3 className="font-serif text-xl">Get in touch</h3>
          <div className="flex flex-col gap-2 text-sm">
            <a
              href="mailto:yo@kharabunga.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              yo@kharabunga.com
            </a>
            <a
              href="https://instagram.com/kharabungastudios"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              @kharabungastudios
            </a>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-6 max-w-md"
        >
          <div>
            <label className="block text-sm mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="text-sm tracking-wide border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default WorkWithMe;
