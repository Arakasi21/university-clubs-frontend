import Link from 'next/link';

export default function MainPage() {
    return (
        <div>
            <h1>Main Page</h1>
            <nav>
                <Link href="/clubs"><a>Clubs Overview</a></Link>
                <Link href="/contacts"><a>Contacts</a></Link>
            </nav>
        </div>
    );
}