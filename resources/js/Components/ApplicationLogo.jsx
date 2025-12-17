export default function ApplicationLogo(props) {
    return (
        <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#31436B" />
            <text x="50" y="65" fontSize="40" textAnchor="middle" fill="white" fontFamily="sans-serif" fontWeight="bold">U</text>
        </svg>
    );
}
