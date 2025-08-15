import { MarkerPin02, MessageChatCircle, Phone } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

export const ContactIconCards02 = () => {
    return (
        <section className="bg-primary py-16 md:py-24">
            <div className="m-auto grid max-w-container grid-cols-1 gap-12 px-4 md:grid-cols-3 md:gap-8 md:px-8">
                <div className="col-span-1 flex max-w-3xl flex-col">
                    <span className="text-sm font-semibold text-brand-secondary md:text-md">Contact us</span>
                    <h2 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">Get in touch</h2>
                    <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">Chat to our friendly team.</p>
                </div>

                <ul className="col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                    {[
                        {
                            title: "Chat to sales",
                            subtitle: "Speak to our friendly team.",
                            href: "mailto:sales@untitledui.com",
                            cta: "sales@untitledui.com",
                            icon: MessageChatCircle,
                        },
                        {
                            title: "Chat to support",
                            subtitle: "We're here to help.",
                            href: "mailto:sales@untitledui.com",
                            cta: "support@untitledui.com",
                            icon: MessageChatCircle,
                        },
                        {
                            title: "Visit us",
                            subtitle: "Visit our office HQ.",
                            href: "https://goo.gl/maps/zTXmPKVdUvCQH9Wd6",
                            cta: "100 Smith St, \nCollingwood VIC 3066 AU",
                            icon: MarkerPin02,
                        },
                        {
                            title: "Call us",
                            subtitle: "Mon-Fri from 8am to 5pm.",
                            href: "tel:+1 (555) 000-0000",
                            cta: "+1 (555) 000-0000",
                            icon: Phone,
                        },
                    ].map((item) => (
                        <li key={item.title} className="flex h-full flex-col items-start bg-secondary p-6">
                            <item.icon className="size-6 text-icon-fg-brand" />

                            <h3 className="mt-8 text-lg font-semibold text-primary md:mt-12">{item.title}</h3>
                            <p className="mt-1 text-md text-tertiary">{item.subtitle}</p>
                            <Button color="link-color" size="lg" href={item.href} className="mt-4 whitespace-pre md:mt-5 md:whitespace-nowrap">
                                {item.cta}
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};
