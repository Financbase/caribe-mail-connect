import { Clock, MarkerPin02 } from "@untitledui/icons";
import type { BadgeColors } from "@/components/base/badges/badge-types";

type JobCardNakedProps = { title: string; description: string; href: string; location: string; type: string; badgeText?: string; badgeColor: BadgeColors };

const JobCardNaked = (props: JobCardNakedProps) => {
    return (
        <a
            href={props.href}
            className="-mt-px flex flex-col rounded-xs border-t border-brand_alt pt-6 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-4"
        >
            <h3 className="text-md font-semibold text-primary_on-brand">{props.title}</h3>
            <p className="mt-2 text-md text-tertiary_on-brand">{props.description}</p>
            <div className="mt-5 flex gap-4">
                <div className="flex items-center gap-1.5">
                    <MarkerPin02 size={20} className="text-icon-fg-brand_on-brand" />
                    <span className="text-sm font-medium text-tertiary_on-brand">{props.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={20} className="text-icon-fg-brand_on-brand" />
                    <span className="text-sm font-medium text-tertiary_on-brand">{props.type}</span>
                </div>
            </div>
        </a>
    );
};

const jobs: JobCardNakedProps[] = [
    {
        title: "Product Designer",
        description: "We're looking for a mid-level product designer to join our team.",
        href: "#",
        badgeColor: "blue",
        badgeText: "Design",
        location: "Remote",
        type: "Full-time",
    },
    {
        title: "Engineering Manager",
        description: "We're looking for an experienced engineering manager to join our team.",
        href: "#",
        badgeColor: "pink",
        badgeText: "Software Development",
        location: "Remote",
        type: "Full-time",
    },
    {
        title: "Customer Success Manager",
        description: "We're looking for a customer success manager to join our team.",
        href: "#",
        badgeColor: "success",
        badgeText: "Customer Success",
        location: "Remote",
        type: "Full-time",
    },
    {
        title: "Account Executive",
        description: "We're looking for an account executive to join our team.",
        href: "#",
        badgeColor: "indigo",
        badgeText: "Sales",
        location: "Remote",
        type: "Full-time",
    },
    {
        title: "SEO Marketing Manager",
        description: "We're looking for an experienced SEO marketing manager to join our team.",
        href: "#",
        badgeColor: "orange",
        badgeText: "Marketing",
        location: "Remote",
        type: "Full-time",
    },
    {
        title: "UX Researcher",
        description: "We're looking for a senior user researcher to join our team.",
        href: "#",
        badgeColor: "orange",
        badgeText: "Marketing",
        location: "Remote",
        type: "Full-time",
    },
];

export const CareersSimple04Brand = () => {
    return (
        <section className="bg-brand-section py-16 md:py-24">
            <div className="mx-auto max-w-container px-4 md:px-8">
                <div className="mx-auto flex max-w-3xl flex-col lg:mx-0">
                    <span className="text-sm font-semibold text-tertiary_on-brand md:text-md">We're hiring!</span>
                    <h2 className="mt-3 text-display-sm font-semibold text-primary_on-brand md:text-display-md">Start doing work that matters</h2>
                    <p className="mt-4 text-lg text-tertiary_on-brand md:mt-5 md:text-xl">
                        Our philosophy is simple—hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-2 lg:gap-16">
                    <ul className="flex w-full max-w-3xl flex-col gap-8 justify-self-center lg:max-w-none lg:py-6">
                        {jobs.slice(0, -2).map((job) => (
                            <li key={job.title}>
                                <JobCardNaked {...job} />
                            </li>
                        ))}
                    </ul>
                    <div className="h-60 md:h-110 md:flex-1 lg:relative lg:h-full">
                        <img
                            src="https://www.untitledui.com/marketing/smiling-girl-4.webp"
                            alt="Smiling girl"
                            className="size-full object-cover lg:absolute lg:inset-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
