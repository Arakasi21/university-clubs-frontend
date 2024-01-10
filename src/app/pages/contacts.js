import Link from 'next/link';

export default function ContactsPage() {
    return (
        <div>
            <h1>Contacts</h1>
            <Link href="/public"><a>Back to Main Page</a></Link>
        </div>
    );
}