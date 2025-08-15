import { Fragment } from "react";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";
import { Header } from "@/components/marketing/header-navigation/header";
import { cx } from "@/utils/cx";

const AvatarsWithReview = (props: { className?: string }) => {
    return (
        <div className={cx("flex items-center gap-4", props.className)}>
            <div className="inline-flex -space-x-3 overflow-hidden">
                <img
                    className="inline-block size-10 rounded-full ring-[1.5px] ring-bg-primary outline-1 -outline-offset-1 outline-avatar-contrast-border"
                    src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"
                    alt="Olivia Rhye"
                />
                <img
                    className="inline-block size-10 rounded-full ring-[1.5px] ring-bg-primary outline-1 -outline-offset-1 outline-avatar-contrast-border"
                    src="https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80"
                    alt="Phoenix Baker"
                />
                <img
                    className="inline-block size-10 rounded-full ring-[1.5px] ring-bg-primary outline-1 -outline-offset-1 outline-avatar-contrast-border"
                    src="https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80"
                    alt="Lana Steiner"
                />
                <img
                    className="inline-block size-10 rounded-full ring-[1.5px] ring-bg-primary outline-1 -outline-offset-1 outline-avatar-contrast-border"
                    src="https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80"
                    alt="Demi Wilkinson"
                />
                <img
                    className="inline-block size-10 rounded-full ring-[1.5px] ring-bg-primary outline-1 -outline-offset-1 outline-avatar-contrast-border"
                    src="https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80"
                    alt="Candice Wu"
                />
            </div>
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {Array(5)
                            .fill(null)
                            .map((_, index) => (
                                <svg
                                    key={index}
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="relative size-5 shrink-0 grow-0"
                                    preserveAspectRatio="none"
                                >
                                    <g clipPath="url(#clip0_1307_2721)">
                                        <path
                                            d="M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z"
                                            className="fill-bg-tertiary"
                                        />
                                        <g clipPath="url(#clip1_1307_2721)">
                                            <path
                                                d="M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z"
                                                className="fill-warning-300"
                                            />
                                        </g>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1307_2721">
                                            <rect width={20} height={20} fill="white" />
                                        </clipPath>
                                        <clipPath id="clip1_1307_2721">
                                            <rect width={20} height={20} fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            ))}
                    </div>
                    <span className="text-md font-semibold text-secondary">5.0</span>
                </div>
                <p className="text-md font-medium text-tertiary">from 200+ reviews</p>
            </div>
        </div>
    );
};

export const HeroSplitForm01 = () => {
    return (
        <Fragment>
            <Header className="bg-primary" />
            <section className="relative bg-primary md:pt-16 md:pb-24">
                <div className="mx-auto flex w-full max-w-container flex-col items-center md:gap-24 md:px-8 lg:flex-row lg:justify-between lg:gap-8">
                    <div className="flex w-full flex-col items-start px-4 pt-16 pb-12 md:p-0">
                        <h1 className="text-display-md font-semibold text-primary md:text-display-lg lg:text-display-xl">
                            Super simplified <br /> customer service
                        </h1>
                        <p className="mt-4 max-w-120 text-lg text-balance text-tertiary md:mt-6 md:text-xl">
                            Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
                        </p>

                        <AvatarsWithReview className="mt-8 md:mt-12" />
                    </div>

                    <div className="relative w-full bg-secondary px-4 pt-12 pb-16 md:max-w-110 md:rounded-2xl md:px-10 md:py-8">
                        <div className="absolute hidden xl:bottom-12 xl:block xl:-translate-x-[107%]">
                            <svg className="text-fg-brand-secondary" width="317" height="155" viewBox="0 0 317 155" fill="none">
                                <path
                                    d="M308.654 69.2268C309.704 67.9449 311.594 67.7565 312.876 68.8061C314.158 69.8557 314.346 71.7459 313.296 73.0278L308.654 69.2268ZM125.589 36.4204L125.868 33.4335L125.869 33.4335L125.589 36.4204ZM150.236 143.724L148.479 141.293L148.479 141.292L150.236 143.724ZM0.917705 3.2753C1.01701 1.62142 2.43825 0.361194 4.09212 0.4605C5.746 0.559807 7.00622 1.98104 6.90692 3.63492L0.917705 3.2753ZM316.512 95.0444C316.567 96.7004 315.269 98.0872 313.613 98.142C311.957 98.1967 310.57 96.8987 310.515 95.2427L316.512 95.0444ZM312.66 69.3439L312.944 66.3574C314.447 66.5001 315.609 67.7366 315.659 69.2448L312.66 69.3439ZM286.295 69.3074C284.67 68.9805 283.619 67.3988 283.945 65.7745C284.272 64.1502 285.854 63.0984 287.478 63.4253L286.295 69.3074ZM310.975 71.1273C313.296 73.0278 313.295 73.0289 313.294 73.0303C313.294 73.0313 313.292 73.0331 313.29 73.035C313.287 73.0388 313.283 73.044 313.278 73.0506C313.267 73.0639 313.251 73.0829 313.231 73.1073C313.19 73.1563 313.131 73.2275 313.054 73.32C312.899 73.5051 312.672 73.7757 312.373 74.1252C311.776 74.8243 310.897 75.8392 309.754 77.1173C307.468 79.6731 304.125 83.2834 299.881 87.5257C291.399 96.0037 279.281 107.038 264.76 117.223C235.869 137.488 196.675 154.93 157.571 140.779L159.613 135.138C195.851 148.251 232.849 132.278 261.314 112.311C275.471 102.381 287.322 91.5948 295.639 83.2819C299.795 79.1287 303.06 75.6008 305.282 73.1172C306.392 71.8756 307.241 70.8956 307.81 70.2296C308.094 69.8966 308.308 69.6422 308.45 69.4728C308.52 69.3882 308.573 69.3248 308.607 69.2835C308.624 69.2629 308.637 69.2478 308.644 69.2383C308.648 69.2336 308.651 69.2302 308.653 69.2283C308.653 69.2273 308.654 69.227 308.654 69.2265C308.654 69.2265 308.654 69.2268 310.975 71.1273ZM157.571 140.779C118.934 126.798 101.393 99.746 98.163 76.1849C96.5578 64.4758 98.4843 53.5141 103.294 45.5627C108.156 37.5256 116.052 32.5155 125.868 33.4335L125.31 39.4074C118.19 38.7417 112.326 42.224 108.428 48.6682C104.478 55.1981 102.646 64.7069 104.107 75.37C107.011 96.5536 122.908 121.855 159.613 135.138L157.571 140.779ZM125.869 33.4335C135.254 34.3138 144.636 39.72 152.578 47.5065C160.556 55.3284 167.323 65.7783 171.438 77.2421C179.68 100.207 177.378 127.813 151.993 146.156L148.479 141.292C171.099 124.948 173.407 100.49 165.79 79.2689C161.975 68.6397 155.696 58.9662 148.377 51.7909C141.023 44.5801 132.856 40.1152 125.309 39.4073L125.869 33.4335ZM151.993 146.155C139.06 155.503 122.569 156.895 105.593 152.576C88.6214 148.258 70.8875 138.182 54.9736 124.122C23.1795 96.0314 -1.97525 51.4552 0.917705 3.2753L6.90692 3.63492C4.15129 49.5278 28.1638 92.4288 58.9463 119.626C74.3207 133.209 91.2274 142.73 107.073 146.762C122.915 150.792 137.417 149.288 148.479 141.293L151.993 146.155ZM310.515 95.2427L309.662 69.4431L315.659 69.2448L316.512 95.0444L310.515 95.2427ZM312.66 69.3439C312.377 72.3305 312.377 72.3305 312.376 72.3305C312.376 72.3304 312.376 72.3304 312.376 72.3304C312.375 72.3303 312.374 72.3302 312.373 72.3301C312.37 72.3298 312.366 72.3295 312.361 72.329C312.351 72.328 312.336 72.3266 312.316 72.3247C312.276 72.3209 312.217 72.3152 312.139 72.3078C311.985 72.293 311.758 72.2712 311.468 72.2431C310.888 72.1869 310.054 72.1056 309.037 72.0049C307.005 71.8035 304.243 71.5245 301.322 71.2139C295.566 70.6015 288.953 69.8424 286.295 69.3074L287.478 63.4253C289.797 63.8918 296.071 64.6214 301.957 65.2475C304.859 65.5561 307.606 65.8337 309.629 66.0341C310.64 66.1343 311.47 66.2152 312.046 66.271C312.334 66.2989 312.559 66.3206 312.712 66.3352C312.788 66.3425 312.847 66.3481 312.886 66.3518C312.905 66.3537 312.92 66.3551 312.93 66.356C312.935 66.3565 312.938 66.3568 312.941 66.3571C312.942 66.3572 312.943 66.3573 312.943 66.3573C312.944 66.3573 312.944 66.3574 312.944 66.3574C312.944 66.3574 312.944 66.3574 312.66 69.3439Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                        <div className="absolute top-0 right-0 hidden translate-x-48 -translate-y-32 -scale-x-100 -rotate-90 md:block lg:hidden">
                            <svg className="text-fg-brand-secondary" width="317" height="155" viewBox="0 0 317 155" fill="none">
                                <path
                                    d="M308.654 69.2268C309.704 67.9449 311.594 67.7565 312.876 68.8061C314.158 69.8557 314.346 71.7459 313.296 73.0278L308.654 69.2268ZM125.589 36.4204L125.868 33.4335L125.869 33.4335L125.589 36.4204ZM150.236 143.724L148.479 141.293L148.479 141.292L150.236 143.724ZM0.917705 3.2753C1.01701 1.62142 2.43825 0.361194 4.09212 0.4605C5.746 0.559807 7.00622 1.98104 6.90692 3.63492L0.917705 3.2753ZM316.512 95.0444C316.567 96.7004 315.269 98.0872 313.613 98.142C311.957 98.1967 310.57 96.8987 310.515 95.2427L316.512 95.0444ZM312.66 69.3439L312.944 66.3574C314.447 66.5001 315.609 67.7366 315.659 69.2448L312.66 69.3439ZM286.295 69.3074C284.67 68.9805 283.619 67.3988 283.945 65.7745C284.272 64.1502 285.854 63.0984 287.478 63.4253L286.295 69.3074ZM310.975 71.1273C313.296 73.0278 313.295 73.0289 313.294 73.0303C313.294 73.0313 313.292 73.0331 313.29 73.035C313.287 73.0388 313.283 73.044 313.278 73.0506C313.267 73.0639 313.251 73.0829 313.231 73.1073C313.19 73.1563 313.131 73.2275 313.054 73.32C312.899 73.5051 312.672 73.7757 312.373 74.1252C311.776 74.8243 310.897 75.8392 309.754 77.1173C307.468 79.6731 304.125 83.2834 299.881 87.5257C291.399 96.0037 279.281 107.038 264.76 117.223C235.869 137.488 196.675 154.93 157.571 140.779L159.613 135.138C195.851 148.251 232.849 132.278 261.314 112.311C275.471 102.381 287.322 91.5948 295.639 83.2819C299.795 79.1287 303.06 75.6008 305.282 73.1172C306.392 71.8756 307.241 70.8956 307.81 70.2296C308.094 69.8966 308.308 69.6422 308.45 69.4728C308.52 69.3882 308.573 69.3248 308.607 69.2835C308.624 69.2629 308.637 69.2478 308.644 69.2383C308.648 69.2336 308.651 69.2302 308.653 69.2283C308.653 69.2273 308.654 69.227 308.654 69.2265C308.654 69.2265 308.654 69.2268 310.975 71.1273ZM157.571 140.779C118.934 126.798 101.393 99.746 98.163 76.1849C96.5578 64.4758 98.4843 53.5141 103.294 45.5627C108.156 37.5256 116.052 32.5155 125.868 33.4335L125.31 39.4074C118.19 38.7417 112.326 42.224 108.428 48.6682C104.478 55.1981 102.646 64.7069 104.107 75.37C107.011 96.5536 122.908 121.855 159.613 135.138L157.571 140.779ZM125.869 33.4335C135.254 34.3138 144.636 39.72 152.578 47.5065C160.556 55.3284 167.323 65.7783 171.438 77.2421C179.68 100.207 177.378 127.813 151.993 146.156L148.479 141.292C171.099 124.948 173.407 100.49 165.79 79.2689C161.975 68.6397 155.696 58.9662 148.377 51.7909C141.023 44.5801 132.856 40.1152 125.309 39.4073L125.869 33.4335ZM151.993 146.155C139.06 155.503 122.569 156.895 105.593 152.576C88.6214 148.258 70.8875 138.182 54.9736 124.122C23.1795 96.0314 -1.97525 51.4552 0.917705 3.2753L6.90692 3.63492C4.15129 49.5278 28.1638 92.4288 58.9463 119.626C74.3207 133.209 91.2274 142.73 107.073 146.762C122.915 150.792 137.417 149.288 148.479 141.293L151.993 146.155ZM310.515 95.2427L309.662 69.4431L315.659 69.2448L316.512 95.0444L310.515 95.2427ZM312.66 69.3439C312.377 72.3305 312.377 72.3305 312.376 72.3305C312.376 72.3304 312.376 72.3304 312.376 72.3304C312.375 72.3303 312.374 72.3302 312.373 72.3301C312.37 72.3298 312.366 72.3295 312.361 72.329C312.351 72.328 312.336 72.3266 312.316 72.3247C312.276 72.3209 312.217 72.3152 312.139 72.3078C311.985 72.293 311.758 72.2712 311.468 72.2431C310.888 72.1869 310.054 72.1056 309.037 72.0049C307.005 71.8035 304.243 71.5245 301.322 71.2139C295.566 70.6015 288.953 69.8424 286.295 69.3074L287.478 63.4253C289.797 63.8918 296.071 64.6214 301.957 65.2475C304.859 65.5561 307.606 65.8337 309.629 66.0341C310.64 66.1343 311.47 66.2152 312.046 66.271C312.334 66.2989 312.559 66.3206 312.712 66.3352C312.788 66.3425 312.847 66.3481 312.886 66.3518C312.905 66.3537 312.92 66.3551 312.93 66.356C312.935 66.3565 312.938 66.3568 312.941 66.3571C312.942 66.3572 312.943 66.3573 312.943 66.3573C312.944 66.3573 312.944 66.3574 312.944 66.3574C312.944 66.3574 312.944 66.3574 312.66 69.3439Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>

                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const data = Object.fromEntries(new FormData(e.currentTarget));
                                console.log("Form data:", data);
                            }}
                        >
                            <div className="flex flex-col items-center gap-6">
                                <UntitledLogoMinimal className="hidden size-10 md:block" />
                                <div className="flex flex-col gap-2 text-center md:gap-3">
                                    <h2 className="text-display-xs font-semibold text-primary md:text-display-sm">Create an account</h2>
                                    <p className="text-md text-tertiary">Start your 30-day free trial</p>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-5 md:mt-6">
                                <Input isRequired hideRequiredIndicator name="name" label="Name" placeholder="Enter your name" size="md" />
                                <Input isRequired hideRequiredIndicator name="email" type="email" label="Email" placeholder="Enter your email" size="md" />
                            </div>

                            <div className="mt-6 flex flex-col gap-4">
                                <Button type="submit" size="lg">
                                    Get started
                                </Button>
                                <SocialButton social="google" theme="color">
                                    Sign up with Google
                                </SocialButton>
                            </div>

                            <div className="mt-8 flex justify-center gap-1 md:mt-6">
                                <span className="text-sm text-tertiary">Already have an account?</span>
                                <Button color="link-color" size="md" href="#">
                                    Log in
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};
