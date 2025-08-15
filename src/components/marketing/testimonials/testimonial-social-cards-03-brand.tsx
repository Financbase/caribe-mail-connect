import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { VerifiedTick } from "@/components/base/avatar/base-components";
import { cx } from "@/utils/cx";

const reviews = [
    [
        {
            id: "review-01",
            quote: "Untitled has been a lifesaver for our team—everything we need is right at our fingertips, and it helps us jump right into new design projects.",
            author: {
                name: "Nikolas Gibbons",
                title: "Product Designer, Powersurge",
                imageUrl: "https://www.untitledui.com/images/avatars/nikolas-gibbons?fm=webp&q=80",
            },
            company: {
                name: "Powersurge",
                imageUrl: "https://www.untitledui.com/logos/logotype/white/powersurge.svg",
            },
        },
        {
            id: "review-02",
            quote: "We love Untitled! It's made the design process super streamlined.",
            author: {
                name: "Marco Kelly",
                title: "UI Designer, Railspeed",
                imageUrl: "https://www.untitledui.com/images/avatars/marco-kelly?fm=webp&q=80",
            },
            company: {
                name: "Railspeed",
                imageUrl: "https://www.untitledui.com/logos/logotype/white/railspeed.svg",
            },
        },
        {
            id: "review-03",
            quote: "Starting projects used to feel daunting, but Untitled simplifies everything. We've used it for both small and large projects, and it never disappoints.",
            author: {
                name: "Zaid Schwartz",
                title: "Founder, Wildcrafted",
                imageUrl: "https://www.untitledui.com/images/avatars/zaid-schwartz?fm=webp&q=80",
            },
            company: {
                name: "Wildcrafted",
                imageUrl: "https://www.untitledui.com/logos/logotype/white/wildcrafted.svg",
            },
        },
    ],
    [
        {
            id: "review-01",
            quote: "Untitled is our secret weapon for staying ahead of deadlines. It gives us everything we need to get started quickly.",
            author: {
                name: "Ammar Foley",
                title: "UX Designer, Goodwell",
                imageUrl: "https://www.untitledui.com/images/avatars/ammar-foley?fm=webp&q=80",
            },
            company: {
                name: "Goodwell",
                imageUrl: "https://www.untitledui.com/logos/logotype/white/goodwell.svg",
            },
        },
        {
            id: "review-02",
            quote: "Untitled is hands down the best design library We've used. It has literally everything we need to get started for any possible project.",
            author: {
                name: "Florence Shaw",
                title: "Web Designer, Quixotic",
                imageUrl: "https://www.untitledui.com/images/avatars/florence-shaw?fm=webp&q=80",
            },
            company: {
                name: "Quixotic",
                imageUrl: "https://www.untitledui.com/logos/logotype/white/quixotic.svg",
            },
        },
        {
            id: "review-03",
            quote: "With Untitled, we can focus more on design and less on the tedious setup work. Best money ever spent.",
            author: {
                name: "Owen Garcia",
                title: "CTO, Solaris Energy",
                imageUrl: "https://www.untitledui.com/images/avatars/owen-garcia?fm=webp&q=80",
            },
            company: {
                name: "solaris-energy",
                imageUrl: "https://www.untitledui.com/logos/logotype/white/solaris-energy.svg",
            },
        },
    ],
    [
        {
            id: "review-01",
            quote: "Our workflow has improved dramatically since we started using Untitled and it's become an integral part of our workflow. It's easy to use, and the resources are top-notch. I recommend it to everyone!",
            author: {
                name: "Mathilde Lewis",
                title: "Project Lead, Stack3d Lab",
                imageUrl: "https://www.untitledui.com/images/avatars/mathilde-lewis?fm=webp&q=80",
            },
            company: {
                name: "Stack3d Lab",
                imageUrl: "https://www.untitledui.com/logos/logotype/white/stackedlab.svg",
            },
        },
        {
            id: "review-02",
            quote: "Untitled is an absolute game-changer for our projects. We can't imagine going back to how we used to work without it.",
            author: {
                name: "Stefan Sears",
                title: "UI/UX Designer, Magnolia",
                imageUrl: "https://www.untitledui.com/images/avatars/stefan-sears?fm=webp&q=80",
            },
            company: {
                name: "Magnolia",
                imageUrl: "https://www.untitledui.com/logos/logotype/white/magnolia.svg",
            },
        },
        {
            id: "review-03",
            quote: "Untitled has been a real time-saver for us. It's organized, efficient, and keeps us moving forward with every project.",
            author: {
                name: "Harriet Rojas",
                title: "Product Designer, Ikigai Labs",
                imageUrl: "https://www.untitledui.com/images/avatars/harriet-rojas?fm=webp&q=80",
            },
            company: {
                name: "Ikigai Labs",
                imageUrl: "https://www.untitledui.com/logos/logotype/white/ikigailabs.svg",
            },
        },
    ],
];

export const TestimonialSocialCards03Brand = () => {
    return (
        <div className="flex flex-col items-center gap-16 bg-brand-section py-16 lg:py-24">
            <div className="flex max-w-container flex-col items-center gap-4 px-4 text-center lg:gap-5 lg:px-8">
                <h1 className="text-display-sm font-semibold text-primary_on-brand lg:text-display-md">Our reviews</h1>
                <p className="text-lg text-tertiary_on-brand lg:text-xl">Hear first-hand from our incredible community of customers.</p>
            </div>
            <div className="grid max-w-container grid-cols-1 gap-5 mask-b-from-[calc(100%-340px)] px-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:px-8">
                {reviews.map((reviewGroup, index) => (
                    <div key={index} className={cx("flex flex-col gap-5 lg:gap-8", index === 0 && "lg:py-8", index === 2 && "lg:pt-10")}>
                        {reviewGroup.map((review) => (
                            <div
                                key={review.id}
                                className="flex flex-col gap-8 rounded-xl bg-brand-section_subtle p-6 shadow-xs lg:justify-between lg:gap-12 lg:p-8"
                            >
                                <div className="flex flex-col items-start gap-3">
                                    <img className="h-8 opacity-85" src={review.company.imageUrl} alt={review.company.name} />
                                    <blockquote className="text-md text-tertiary_on-brand">{review.quote}</blockquote>
                                </div>
                                <AvatarLabelGroup
                                    size="lg"
                                    src={review.author.imageUrl}
                                    alt={review.author.name}
                                    title={
                                        <span className="relative flex items-center gap-1 text-primary_on-brand">
                                            {review.author.name}
                                            <VerifiedTick size="lg" />
                                        </span>
                                    }
                                    subtitle={<span className="text-tertiary_on-brand">{review.author.title}</span>}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
