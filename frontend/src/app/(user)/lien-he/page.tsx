import { getContactFaqItems } from "@/services/pageContentService";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactFaq from "@/components/contact/ContactFaq";

export default function LienHePage() {
  const faqItems = getContactFaqItems();

  return (
    <main className="bg-[#f8fafc] pb-16">
      <ContactHero />

      <section className="pt-10 md:pt-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="mt-12">
        <ContactFaq faqItems={faqItems} />
      </section>
    </main>
  );
}
