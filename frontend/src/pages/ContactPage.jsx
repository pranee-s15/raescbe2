import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import contactDesk from '../assets/contact/contact-desk.png';
import contactDisplay from '../assets/contact/contact-display.png';
import heroLotus from '../assets/raes-hero-lotus-cutout.png';
import SectionHeading from '../components/shared/SectionHeading';
import { contactDetails } from '../data/site';

const ContactPage = () => (
  <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
    <SectionHeading
      eyebrow="Contact"
      title="Visit the boutique or plan a private styling conversation"
      description="Reach us for festive styling, fabric guidance, and appointment-based boutique support."
    />

    <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
      <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-soft">
        {[
          { icon: MapPin, label: 'Address', value: contactDetails.address },
          { icon: Phone, label: 'Phone', value: contactDetails.phone },
          { icon: Mail, label: 'Email', value: contactDetails.email },
          { icon: Clock3, label: 'Working Hours', value: contactDetails.hours }
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-4">
            <div className="rounded-full bg-boutique-background p-3 text-boutique-maroon">
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">{item.label}</p>
              <p className="mt-2 text-sm leading-7 text-boutique-ink/72">{item.value}</p>
            </div>
          </div>
        ))}

        <div className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-boutique-maroon to-[#2f050d] p-5 text-white shadow-luxe">
          <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-boutique-gold/12 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <img src={heroLotus} alt="" className="h-12 w-auto object-contain" />
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Boutique Glimpse</p>
              <p className="mt-2 text-sm text-white/75">A warm styling space shaped around quiet luxury and personal attention.</p>
            </div>
          </div>

          <div className="relative mt-6 grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
            <div className="overflow-hidden rounded-[1.5rem] bg-white/8">
              <img
                src={contactDesk}
                alt="Raes Boutique consultation desk"
                className="h-[280px] w-full object-cover object-center"
              />
            </div>
            <div className="overflow-hidden rounded-[1.5rem] bg-white/8">
              <img
                src={contactDisplay}
                alt="Raes Boutique display wall"
                className="h-[280px] w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white p-4 shadow-soft">
        <iframe
          title="Raes Boutique location"
          src="https://www.google.com/maps?q=G1,%206th%20St,%20Kuppakonam%20Pudur,%20Coimbatore,%20Tamil%20Nadu%20641038&z=16&output=embed"
          className="h-[560px] w-full rounded-[1.6rem]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </section>
);

export default ContactPage;
