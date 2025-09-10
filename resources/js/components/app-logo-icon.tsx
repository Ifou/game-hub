import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H7zm0 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"
            />
            <circle cx="9" cy="10" r="1" />
            <circle cx="15" cy="10" r="1" />
            <circle cx="9" cy="14" r="1" />
            <circle cx="15" cy="14" r="1" />
            <rect x="11" y="9" width="2" height="6" rx="1" />
        </svg>
    );
}
